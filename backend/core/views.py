from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UsuarioRegisterSerializer, UsuarioLoginSerializer, NotificationTokenSerializer
from .models import Usuario, Paciente
from .services.notification_service import NotificationService
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from .models import Usuario, Paciente, Doctor, Anticonceptivo

logger = logging.getLogger(__name__)

class RegistroUsuarioView(generics.CreateAPIView):
    serializer_class = UsuarioRegisterSerializer
    permission_classes = [AllowAny]

class LoginUsuarioView(generics.GenericAPIView):
    serializer_class = UsuarioLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        dni = request.data.get("dni")
        password = request.data.get("password")
        user = authenticate(request, dni=dni, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            # Determinar el tipo de usuario basado en la instancia
            if hasattr(user, 'paciente'):
                tipo_usuario = "paciente"
            elif hasattr(user, 'doctor'):
                tipo_usuario = "doctor"
            else:
                tipo_usuario = "usuario"
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'usuario': {
                    'id': user.id,
                    'dni': user.dni,
                    'nombre': user.nombre,
                    'apellido': user.apellido,
                    'email': user.email,
                    'tipo_usuario': tipo_usuario
                }
            })
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


class NotificationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def register_token(self, request):
        serializer = NotificationTokenSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = Usuario.objects.get(id=serializer.validated_data['user_id'])
                # Update token for the user
                if isinstance(user, Paciente):
                    user.token_dispositivo = serializer.validated_data['token']
                    user.save()
                    return Response({'status': 'success'})
                return Response(
                    {'error': 'Solo los pacientes pueden registrar tokens'},
                    status=status.HTTP_403_FORBIDDEN
                )
            except Usuario.DoesNotExist:
                return Response(
                    {'error': 'Usuario no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    paciente = None
    try:
        if hasattr(user, 'paciente'):
            paciente = Paciente.objects.select_related('doctor_asignado', 'anticonceptivo').get(id=user.id)
    except Paciente.DoesNotExist:
        pass

    data = {
        'id': user.id,
        'nombre': user.nombre,
        'apellido': user.apellido,
        'email': user.email,
        'dni': user.dni,
        'sexo': paciente.sexo if paciente else None,
        'fecha_nacimiento': paciente.fecha_nacimiento if paciente else None,
        'fecha_de_inicio_periodo': paciente.fecha_de_inicio_periodo if paciente else None,
        'cantidad_de_cajas': paciente.cantidad_de_cajas if paciente else None,
        'obra_social': paciente.obra_social if paciente else None,
        'credencial': paciente.credencial if paciente else None,
        'anticonceptivo': None,
        'doctor': None,
        'solicitudes_recetas': []
    }

    if paciente:
        if paciente.anticonceptivo:
            data['anticonceptivo'] = {
                'id': paciente.anticonceptivo.id,
                'marca': paciente.anticonceptivo.marca,
                'tipo': paciente.anticonceptivo.tipo
            }
        if paciente.doctor_asignado:
            data['doctor'] = {
                'id': paciente.doctor_asignado.id,
                'nombre': paciente.doctor_asignado.nombre,
                'apellido': paciente.doctor_asignado.apellido,
                'especialidad': paciente.doctor_asignado.especialidad,
                'domicilio_atencion': paciente.doctor_asignado.domicilio_atencion
            }
        solicitudes = paciente.solicitudes_recetas.all().select_related('doctor')
        data['solicitudes_recetas'] = [
            {
                'id': s.id,
                'status': s.status,
                'archivo': request.build_absolute_uri(s.archivo.url) if s.archivo else None,
                'doctor': {
                    'nombre': s.doctor.nombre,
                    'apellido': s.doctor.apellido,
                }
            }
            for s in solicitudes
        ]
    return Response(data)


class UpdatePacienteView(generics.UpdateAPIView):
    serializer_class = UsuarioRegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        base_user = self.get_object()
        try:
            paciente = Paciente.objects.get(pk=base_user.pk)
        except Paciente.DoesNotExist:
            return Response({"error": "Este usuario no es paciente."}, status=400)

        for field in [
            'obra_social', 'credencial', 'fecha_de_inicio_periodo',
            'cantidad_de_cajas', 'doctor_asignado',
            'sexo', 'fecha_nacimiento', 'anticonceptivo'
        ]:
            if field in request.data:
                if field == "anticonceptivo":
                    if request.data[field] is not None:
                        try:
                            anticonceptivo = Anticonceptivo.objects.get(id=request.data[field])
                            paciente.anticonceptivo = anticonceptivo
                        except Anticonceptivo.DoesNotExist:
                            return Response({"error": "Anticonceptivo inválido"}, status=400)
                    else:
                        paciente.anticonceptivo = None
                else:
                    setattr(paciente, field, request.data[field])

        paciente.save()
        return Response({'status': 'perfil actualizado'})

class DoctorListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Doctor.objects.all()

    def list(self, request, *args, **kwargs):
        doctors = self.get_queryset()
        data = [
            {
                'id': doctor.id,
                'nombre': doctor.nombre,
                'apellido': doctor.apellido,
                'especialidad': doctor.especialidad,
                'domicilio_atencion': doctor.domicilio_atencion
            }
            for doctor in doctors
        ]
        return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_doctor(request):
    base_user = request.user

    # Reobtener la instancia real en la tabla 'paciente'
    try:
        user = Paciente.objects.get(pk=base_user.pk)
    except Paciente.DoesNotExist:
        return Response({'error': 'Solo los pacientes pueden asignar un doctor.'}, status=400)

    doctor_id = request.data.get("doctor_id")
    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({'error': 'El doctor no existe'}, status=status.HTTP_404_NOT_FOUND)

    user.doctor_asignado = doctor
    user.save()
    return Response({'status': 'doctor asignado'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_anticonceptivos(request):
    anticonceptivos = Anticonceptivo.objects.all()
    data = [
        {
            'id': a.id,
            'tipo': a.tipo,
            'marca': a.marca
        }
        for a in anticonceptivos
    ]
    return Response(data)

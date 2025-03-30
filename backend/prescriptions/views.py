from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from core.models import SolicitudReceta
from core.serializers import SolicitudRecetaSerializer
from core.services.notification_service import NotificationService
from core.models import Doctor
class PrescriptionRequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not hasattr(user, 'doctor'):
            return Response({'detail': 'Este usuario no es un doctor'}, status=403)
        
        
        print("request.user:", request.user)

        # prescriptions = SolicitudReceta.objects.filter(doctor=user.doctor)
        prescriptions = SolicitudReceta.objects.all()
        serializer = SolicitudRecetaSerializer(prescriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user

        # if not hasattr(user, 'paciente'):
        #     return Response({'detail': 'Solo los pacientes pueden crear solicitudes'}, status=403)

        serializer = SolicitudRecetaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(paciente=user.paciente)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_prescription_status(request, pk):
    prescription = SolicitudReceta.objects.get(pk=pk)
    serializer = SolicitudRecetaSerializer(prescription, data={"status": request.data.get("status")}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pedir_receta_unica(request):
    user = request.user

    if not hasattr(user, 'paciente'):
        return Response({'detail': 'Solo los pacientes pueden pedir recetas'}, status=403)

    paciente = user.paciente

    # Validaciones básicas
    if not paciente.anticonceptivo or not paciente.doctor_asignado:
        return Response({'detail': 'Falta anticonceptivo o doctor asignado'}, status=400)

    # Crear la solicitud
    receta = SolicitudReceta.objects.create(
        paciente=paciente,
        doctor=paciente.doctor_asignado,
        anticonceptivo=paciente.anticonceptivo,
        status='pendiente'
    )

    serializer = SolicitudRecetaSerializer(receta)
    return Response(serializer.data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def activar_receta_automatica(request):
    user = request.user
    if not hasattr(user, 'paciente'):
        return Response({'detail': 'Solo pacientes pueden hacer esto'}, status=403)

    paciente = user.paciente
    # paciente.receta_automatica = True
    # paciente.save()

    # Llamar directamente al servicio solo para este paciente
    NotificationService.check_and_send_notification(
        paciente_token=paciente.token_dispositivo,
        doctor_token=paciente.doctor_asignado.token_dispositivo if paciente.doctor_asignado else Doctor.objects.first().token_dispositivo,
        fecha_inicio=paciente.fecha_de_inicio_periodo,
        cantidad_cajas=paciente.cantidad_de_cajas,
        paciente=paciente,
        doctor=paciente.doctor_asignado if paciente.doctor_asignado else Doctor.objects.first()
        
    )

    return Response({'status': 'receta automática activada y chequeada'}, status=200)
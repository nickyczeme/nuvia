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
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'usuario': {
                    'id': user.id,
                    'dni': user.dni,
                    'nombre': user.nombre,
                    'apellido': user.apellido,
                    'email': user.email
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
    data = {
        'id': user.id,
        'nombre': user.nombre,
        'apellido': user.apellido,
        'email': user.email,
        'dni': user.dni,
    }
    return Response(data)


class UpdatePacienteProfileView(generics.UpdateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = UsuarioRegisterSerializer  # You can reuse this if it supports partial updates
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Updates the logged-in user's profile
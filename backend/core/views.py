from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken  # Si usas JWT para autenticación
from .models import Usuario, Paciente
from .serializers import UsuarioRegisterSerializer, LoginUsuarioSerializer  # Asegúrate de importar el serializer correcto
from django.contrib.auth import authenticate

# Clase para actualizar el perfil del paciente
class ActualizarPerfilView(generics.UpdateAPIView):
    serializer_class = UsuarioRegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtramos por el usuario autenticado
        return Paciente.objects.filter(usuario=self.request.user)

    def update(self, request, *args, **kwargs):
        # Obtenemos los datos enviados en la solicitud
        paciente_data = request.data
        try:
            paciente = self.get_object()
            # Actualizamos los campos del paciente
            paciente.nombre = paciente_data.get("first_name", paciente.nombre)
            paciente.apellido = paciente_data.get("last_name", paciente.apellido)
            paciente.mMetodo_anticonceptivo = paciente_data.get("contraceptiveMethod", paciente.mMetodo_anticonceptivo)
            paciente.marca = paciente_data.get("brand", paciente.marca)
            paciente.fecha_inicio = paciente_data.get("startDate", paciente.fecha_inicio)
            paciente.cajas_restantes = paciente_data.get("remainingBoxes", paciente.cajas_restantes)
            paciente.save()

            return Response({"status": "Perfil actualizado correctamente"}, status=status.HTTP_200_OK)
        except Paciente.DoesNotExist:
            return Response({"error": "Paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# Clase para registrar un nuevo usuario
class RegistroUsuarioView(generics.CreateAPIView):
    serializer_class = UsuarioRegisterSerializer

    def perform_create(self, serializer):
        # Aquí puedes agregar lógica extra, como enviar un correo de bienvenida, etc.
        serializer.save()

# Clase para iniciar sesión del usuario
class LoginUsuarioView(generics.GenericAPIView):
    serializer_class = LoginUsuarioSerializer

    def post(self, request, *args, **kwargs):
        # Obtenemos los datos de inicio de sesión
        username = request.data.get('username')
        password = request.data.get('password')

        # Autenticamos al usuario
        user = authenticate(username=username, password=password)

        if user is not None:
            # Si la autenticación es exitosa, generamos un token JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_400_BAD_REQUEST)

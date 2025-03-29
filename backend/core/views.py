from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UsuarioRegisterSerializer, UsuarioLoginSerializer

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

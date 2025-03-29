from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Doctor, Paciente, Anticonceptivo

Usuario = get_user_model()

class UsuarioRegisterSerializer(serializers.ModelSerializer):
    tipo_usuario = serializers.ChoiceField(choices=[('doctor', 'Doctor'), ('paciente', 'Paciente')], write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    # Doctor field
    firma_digital = serializers.FileField(required=False, allow_null=True)

    # Paciente fields
    obra_social = serializers.CharField(required=False, allow_null=True)
    credencial = serializers.CharField(required=False, allow_null=True)
    fecha_de_inicio_periodo = serializers.DateField(required=False, allow_null=True)
    cantidad_de_cajas = serializers.IntegerField(required=False)
    anticonceptivo = serializers.PrimaryKeyRelatedField(queryset=Anticonceptivo.objects.all(), required=False, allow_null=True)
    doctor_asignado = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = [
            'dni', 'nombre', 'apellido', 'email', 'password', 'password2', 'tipo_usuario',
            'firma_digital', 'obra_social', 'credencial', 'fecha_de_inicio_periodo',
            'cantidad_de_cajas', 'anticonceptivo', 'doctor_asignado'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        tipo_usuario = validated_data.pop('tipo_usuario')
        password = validated_data.pop('password')

        shared_fields = {
            'dni': validated_data.get('dni'),
            'nombre': validated_data.get('nombre'),
            'apellido': validated_data.get('apellido'),
            'email': validated_data.get('email'),
        }

        if tipo_usuario == 'doctor':
            user = Doctor(**shared_fields)
            user.firma_digital = validated_data.get('firma_digital')

        elif tipo_usuario == 'paciente':
            user = Paciente(**shared_fields)
            user.obra_social = validated_data.get('obra_social')
            user.credencial = validated_data.get('credencial')
            user.fecha_de_inicio_periodo = validated_data.get('fecha_de_inicio_periodo')
            user.cantidad_de_cajas = validated_data.get('cantidad_de_cajas', 3)
            user.anticonceptivo = validated_data.get('anticonceptivo')
            user.doctor_asignado = validated_data.get('doctor_asignado')

        else:
            raise serializers.ValidationError({"tipo_usuario": "Tipo de usuario inválido."})

        user.set_password(password)
        user.save()
        return user


class UsuarioLoginSerializer(serializers.Serializer):
    dni = serializers.IntegerField()
    password = serializers.CharField(write_only=True)

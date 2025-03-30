from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Doctor, Paciente, Anticonceptivo, Usuario, SolicitudReceta, SolicitudAmistad

Usuario = get_user_model()

class UsuarioRegisterSerializer(serializers.ModelSerializer):
    tipo_usuario = serializers.ChoiceField(choices=[('doctor', 'Doctor'), ('paciente', 'Paciente')], write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    notification_token = serializers.CharField(max_length=255, required=False, write_only=True)

    # Doctor fields
    firma_digital = serializers.FileField(required=False, allow_null=True)
    matricula = serializers.CharField(required=False, allow_null=True)
    estado_matricula = serializers.ChoiceField(
        choices=[('vigente', 'Vigente'), ('vencido', 'Vencido')],
        required=False,
        default='vigente'
    )
    profesion = serializers.CharField(required=False, allow_null=True)
    especialidad = serializers.CharField(required=False, allow_null=True)
    domicilio_atencion = serializers.CharField(required=False, allow_null=True)

    # Paciente fields
    obra_social = serializers.CharField(required=False, allow_null=True)
    credencial = serializers.CharField(required=False, allow_null=True)
    fecha_nacimiento = serializers.DateField(required=False, allow_null=True)
    sexo = serializers.ChoiceField(
        choices=[('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')],
        required=False,
        allow_null=True
    )
    fecha_de_inicio_periodo = serializers.DateField(required=False, allow_null=True)
    cantidad_de_cajas = serializers.IntegerField(required=False)
    anticonceptivo = serializers.PrimaryKeyRelatedField(queryset=Anticonceptivo.objects.all(), required=False, allow_null=True)
    doctor_asignado = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = [
            'dni', 'nombre', 'apellido', 'email', 'password', 'password2', 'tipo_usuario',
            # Doctor fields
            'firma_digital', 'matricula', 'estado_matricula', 'profesion', 'especialidad', 'domicilio_atencion',
            # Paciente fields
            'obra_social', 'credencial', 'fecha_nacimiento', 'sexo', 'fecha_de_inicio_periodo',
            'cantidad_de_cajas', 'anticonceptivo', 'doctor_asignado', 'notification_token'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        tipo_usuario = validated_data.pop('tipo_usuario')
        password = validated_data.pop('password')
        notification_token = validated_data.pop('notification_token', None)

        shared_fields = {
            'dni': validated_data.get('dni'),
            'nombre': validated_data.get('nombre'),
            'apellido': validated_data.get('apellido'),
            'email': validated_data.get('email'),
            'token_dispositivo': notification_token,
        }

        if tipo_usuario == 'doctor':
            user = Doctor(**shared_fields)
            user.firma_digital = validated_data.get('firma_digital')
            user.matricula = validated_data.get('matricula')
            user.estado_matricula = validated_data.get('estado_matricula', 'vigente')
            user.profesion = validated_data.get('profesion')
            user.especialidad = validated_data.get('especialidad')
            user.domicilio_atencion = validated_data.get('domicilio_atencion')

        elif tipo_usuario == 'paciente':
            user = Paciente(**shared_fields)
            user.obra_social = validated_data.get('obra_social')
            user.credencial = validated_data.get('credencial')
            user.fecha_nacimiento = validated_data.get('fecha_nacimiento')
            user.sexo = validated_data.get('sexo')
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

class NotificationTokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)
    user_id = serializers.IntegerField()

class NotificationCreateSerializer(serializers.Serializer):
    mensaje = serializers.CharField()
    fecha_programada = serializers.DateTimeField(required=False)

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ('id', 'nombre', 'apellido')

class AnticonceptivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anticonceptivo
        fields = ('id', 'marca')


class SolicitudRecetaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)
    anticonceptivo = AnticonceptivoSerializer(read_only=True)
    class Meta:
        model = SolicitudReceta
        fields = '__all__'  # Adjust fields as necessary

    def create(self, validated_data):
        # Custom creation logic here if needed
        return super().create(validated_data)

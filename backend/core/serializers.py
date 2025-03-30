from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Doctor, Paciente, Anticonceptivo, Usuario, SolicitudReceta, SolicitudAmistad

Usuario = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Doctor, Paciente, Anticonceptivo, Usuario

Usuario = get_user_model()

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'nombre', 'apellido', 'especialidad', 'domicilio_atencion']
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
    doctor_asignado = DoctorSerializer(read_only=True)  # <- importante para mostrar el doctor asignado

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

        if tipo_usuario == 'doctor':
            user = Doctor(
                dni=validated_data.pop('dni'),
                nombre=validated_data.pop('nombre'),
                apellido=validated_data.pop('apellido'),
                email=validated_data.pop('email'),
                token_dispositivo=notification_token,
                firma_digital=validated_data.pop('firma_digital', None),
                matricula=validated_data.pop('matricula', None),
                estado_matricula=validated_data.pop('estado_matricula', 'vigente'),
                profesion=validated_data.pop('profesion', None),
                especialidad=validated_data.pop('especialidad', None),
                domicilio_atencion=validated_data.pop('domicilio_atencion', None),
            )

        elif tipo_usuario == 'paciente':
            user = Paciente(
                dni=validated_data.pop('dni'),
                nombre=validated_data.pop('nombre'),
                apellido=validated_data.pop('apellido'),
                email=validated_data.pop('email'),
                token_dispositivo=notification_token,
                obra_social=validated_data.pop('obra_social', None),
                credencial=validated_data.pop('credencial', None),
                fecha_nacimiento=validated_data.pop('fecha_nacimiento', None),
                sexo=validated_data.pop('sexo', None),
                fecha_de_inicio_periodo=validated_data.pop('fecha_de_inicio_periodo', None),
                cantidad_de_cajas=validated_data.pop('cantidad_de_cajas', 3),
                anticonceptivo=validated_data.pop('anticonceptivo', None),
            )

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


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'nombre', 'apellido', 'especialidad', 'domicilio_atencion']

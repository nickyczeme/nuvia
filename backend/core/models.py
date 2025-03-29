from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator

# ------------------------------------------------------------------------------------------
# Manager for custom Usuario model
# ------------------------------------------------------------------------------------------
class UsuarioManager(BaseUserManager):
    """
    Custom manager for our Usuario model.
    Defines how to create users and superusers.
    """
    def create_user(self, dni, password=None, **extra_fields):
        if not dni:
            raise ValueError('El DNI es obligatorio')
        user = self.model(dni=dni, **extra_fields)
        # This hashes the password and stores it in the 'password' field
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, dni, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(dni, password, **extra_fields)

# ------------------------------------------------------------------------------------------
# Main User Model (Usuario) - uses DNI for login
# ------------------------------------------------------------------------------------------
class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that uses DNI as the username field.
    'password' is inherited from AbstractBaseUser.
    """
    dni = models.PositiveIntegerField(unique=True)
    nombre = models.CharField(max_length=100, blank=True)
    apellido = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # PermissionsMixin gives you 'is_superuser' and the group/permission relationships

    objects = UsuarioManager()

    # Tells Django which field is used for login
    USERNAME_FIELD = 'dni'
    # If you want to require other fields when creating superusers, list them here
    REQUIRED_FIELDS = []  # e.g. ['email']

    def __str__(self):
        return f"Usuario DNI: {self.dni}"

# ------------------------------------------------------------------------------------------
# Doctor and Paciente Subclasses
# ------------------------------------------------------------------------------------------
class Doctor(Usuario):
    """
    Subclase de Usuario para Doctores.
    Hereda todos los campos de Usuario.
    """
    firma_digital = models.FileField(
        upload_to='firmas_doctores/',
        null=True,
        blank=True
    )

class Anticonceptivo(models.Model):
    """
    Modelo para anticonceptivos, que pueden ser utilizados por varios pacientes.
    """
    tipo = models.CharField(max_length=100)
    marca = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.tipo} - {self.marca}"

class Paciente(Usuario):
    """
    Subclase de Usuario para Pacientes.
    Hereda todos los campos de Usuario.
    Relaciona con Doctor (uno) y Anticonceptivo (uno).
    """
    obra_social = models.CharField(max_length=100, blank=True, null=True)
    # Changed to CharField, so we can specify max_length=20
    credencial = models.CharField(max_length=20, blank=True, null=True)

    fecha_de_inicio_periodo = models.DateField(blank=True, null=True)
    cantidad_de_cajas = models.IntegerField(
        validators=[
            MinValueValidator(1, message="La cantidad de cajas debe ser mayor a 0"),
            MaxValueValidator(3, message="La cantidad de cajas no puede ser mayor a 3")
        ],
        help_text="Cantidad de cajas (1-3)",
        default=3
    )

    # Un paciente tiene un anticonceptivo; uno a varios Pacientes
    anticonceptivo = models.ForeignKey(
        Anticonceptivo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pacientes'
    )

    # Renamed to avoid clashing with the class name 'Doctor'
    doctor_asignado = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        null=True,
        related_name='pacientes'
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.dni}"

# ------------------------------------------------------------------------------------------
# SolicitudReceta
# ------------------------------------------------------------------------------------------
class SolicitudReceta(models.Model):
    """
    Conecta un Paciente con un Doctor, con un Anticonceptivo obligatorio,
    e incluye fecha de creación, estado y un archivo opcional.
    """
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
    ]

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='solicitudes_recetas'
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='solicitudes_recetas'
    )
    anticonceptivo = models.ForeignKey(
        Anticonceptivo,
        on_delete=models.CASCADE,
        related_name='solicitudes_recetas'
    )
    fecha = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pendiente'
    )
    archivo = models.FileField(
        upload_to='recetas_adjuntas/',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Receta #{self.pk} - {self.paciente} -> {self.doctor} ({self.status})"

# ------------------------------------------------------------------------------------------
# SolicitudAmistad
# ------------------------------------------------------------------------------------------
class SolicitudAmistad(models.Model):
    """
    Conecta un Paciente con un Doctor, puede tener un Anticonceptivo opcional,
    fecha de creación y estado.
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
    ]

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='solicitudes_amistad'
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='solicitudes_amistad'
    )
    anticonceptivo = models.ForeignKey(
        Anticonceptivo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='solicitudes_amistad'
    )
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default='pendiente'
    )

    def __str__(self):
        return f"Amistad #{self.pk} - {self.paciente} -> {self.doctor} ({self.estado})"

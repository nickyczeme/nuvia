from django.core.management.base import BaseCommand
from core.models import Doctor, Paciente, Anticonceptivo, SolicitudReceta, SolicitudAmistad

class Command(BaseCommand):
    help = 'Crea datos de prueba para desarrollo'

    def handle(self, *args, **kwargs):
        # Clear existing test data (optional)
        SolicitudReceta.objects.all().delete()
        SolicitudAmistad.objects.all().delete()
        Paciente.objects.all().delete()
        Doctor.objects.all().delete()
        Anticonceptivo.objects.all().delete()

        # Crear Doctor
        doc = Doctor.objects.create_user(
            dni=10000001,
            password='doctor123',
            nombre='Gabriela',
            apellido='Sosa',
            email='gsosa@example.com'
        )
        self.stdout.write(self.style.SUCCESS(f'Doctor creado: {doc}'))

        # Crear Anticonceptivo
        anti = Anticonceptivo.objects.create(
            tipo='Píldora',
            marca='MarcaX'
        )
        self.stdout.write(self.style.SUCCESS(f'Anticonceptivo creado: {anti}'))

        # Crear Paciente
        pac = Paciente.objects.create_user(
            dni=20000002,
            password='paciente123',
            nombre='Julieta',
            apellido='González',
            email='jgonzalez@example.com',
            doctor_asignado=doc,
            anticonceptivo=anti,
            credencial='XYZ987654',
            cantidad_de_cajas=2
        )
        self.stdout.write(self.style.SUCCESS(f'Paciente creado: {pac}'))

        # Crear SolicitudReceta
        receta = SolicitudReceta.objects.create(
            paciente=pac,
            doctor=doc,
            anticonceptivo=anti,
            status='pendiente'
        )
        self.stdout.write(self.style.SUCCESS(f'SolicitudReceta creada: {receta}'))

        # Crear SolicitudAmistad
        amistad = SolicitudAmistad.objects.create(
            paciente=pac,
            doctor=doc,
            estado='pendiente'
        )
        self.stdout.write(self.style.SUCCESS(f'SolicitudAmistad creada: {amistad}'))

        self.stdout.write(self.style.SUCCESS('✅ Datos de prueba creados con éxito'))

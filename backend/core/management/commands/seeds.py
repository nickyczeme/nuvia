from django.core.management.base import BaseCommand
from core.models import Doctor, Paciente, Anticonceptivo, SolicitudReceta, SolicitudAmistad
from datetime import date, timedelta
from django.utils import timezone
import subprocess
import time

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
            email='gsosa@example.com',
            token_dispositivo="ExponentPushToken[wBIrwfAWjkEewCYovjnIl7]"
        )
        self.stdout.write(self.style.SUCCESS(f'Doctor creado: {doc}'))

        # Crear Anticonceptivo
        anti = Anticonceptivo.objects.create(
            tipo='Píldora',
            marca='MarcaX'
        )
        self.stdout.write(self.style.SUCCESS(f'Anticonceptivo creado: {anti}'))

        # Fecha de inicio: hace 81 días (para que falten 3 días para terminar las cajas)
        fecha_inicio = date.today() - timedelta(days=81)

        # Crear Paciente 1 (con notificación próxima)
        pac1 = Paciente.objects.create_user(
            dni=20000002,
            password='paciente123',
            nombre='Julieta',
            apellido='González',
            email='jgonzalez@example.com',
            doctor_asignado=doc,
            anticonceptivo=anti,
            credencial='XYZ987654',
            cantidad_de_cajas=3,  # 3 cajas de 28 días = 84 días total
            fecha_de_inicio_periodo=fecha_inicio,  # Faltan 3 días para terminar
            token_dispositivo="ExponentPushToken[OPQLZoE-DMhYRKrLHAbjp9]"
        )
        self.stdout.write(self.style.SUCCESS(f'Paciente 1 creado: {pac1}'))

        # Crear Paciente 2 (con fecha de inicio reciente)
        pac2 = Paciente.objects.create_user(
            dni=20000003,
            password='paciente123',
            nombre='Lucía',
            apellido='Martínez',
            email='lmartinez@example.com',
            doctor_asignado=doc,
            anticonceptivo=anti,
            credencial='ABC123456',
            cantidad_de_cajas=3,
            fecha_de_inicio_periodo=date.today() - timedelta(days=10),  # Inicio hace 10 días
            token_dispositivo="ExponentPushToken[diferente-token]"
        )
        self.stdout.write(self.style.SUCCESS(f'Paciente 2 creado: {pac2}'))

        # Crear SolicitudReceta para ambos pacientes
        for pac in [pac1, pac2]:
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
                estado='aceptado'  # Cambiado a aceptado para que funcionen las notificaciones
            )
            self.stdout.write(self.style.SUCCESS(f'SolicitudAmistad creada: {amistad}'))

        self.stdout.write(self.style.SUCCESS('✅ Datos de prueba creados con éxito'))

def calculate_last_box_end_date(fecha_inicio, cantidad_cajas):
    # Calcular días transcurridos desde el inicio
    days_elapsed = (timezone.now().date() - fecha_inicio).days
    
    # Calcular días hasta que se termine la última caja
    days_per_box = 28  # Cada caja dura 28 días
    total_days = days_per_box * cantidad_cajas
    days_remaining = total_days - days_elapsed

    # Si faltan 3 días o menos, enviar notificación
    if days_remaining <= NotificationService.DIAS_ANTES_NOTIFICACION:
        # Enviar notificación al paciente y al doctor

def run_notifications():
    while True:
        # Ejecutar el comando de notificaciones
        subprocess.run(["python3", "manage.py", "send_notifications"])
        # Esperar 24 horas
        time.sleep(24 * 60 * 60)

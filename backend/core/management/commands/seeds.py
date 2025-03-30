from django.core.management.base import BaseCommand
from core.models import Doctor, Paciente, Anticonceptivo, SolicitudReceta, SolicitudAmistad
from datetime import date, timedelta
from django.utils import timezone
import subprocess
import time

class Command(BaseCommand):
    help = 'Crea datos de prueba para desarrollo'

    def handle(self, *args, **kwargs):
        # Borrar datos previos
        SolicitudReceta.objects.all().delete()
        SolicitudAmistad.objects.all().delete()
        Paciente.objects.all().delete()
        Doctor.objects.all().delete()
        Anticonceptivo.objects.all().delete()

        # Crear anticonceptivos
        anticonceptivos_data = [
            {"tipo": "Pastillas", "marca": "Divina"},
            {"tipo": "Pastillas", "marca": "Diane 35"},
            {"tipo": "Pastillas", "marca": "Femexin"},
            {"tipo": "Pastillas", "marca": "Ciclo 21"},
            {"tipo": "Pastillas", "marca": "Jasmin"},
            {"tipo": "Pastillas", "marca": "Yasmin"},
            {"tipo": "Pastillas", "marca": "Bellaface"},
            {"tipo": "Pastillas", "marca": "Isis Mini"},
            {"tipo": "Pastillas", "marca": "Kala MD"},
            {"tipo": "Pastillas", "marca": "Miranda"},
            {"tipo": "Parche", "marca": "Evra"},
            {"tipo": "Parche", "marca": "Lisvy"},
            {"tipo": "Anillo", "marca": "Nuvaring"},
            {"tipo": "Anillo", "marca": "Blisovi"},
            {"tipo": "Anillo", "marca": "Circlet"},
            {"tipo": "Anillo", "marca": "Ellering"},
        ]
        anticonceptivos = [Anticonceptivo.objects.create(**data) for data in anticonceptivos_data]

        # Datos realistas
        doctor_data = [
            {"nombre": "Gabriela", "apellido": "Sosa"},
            {"nombre": "Juan", "apellido": "Pérez"},
            {"nombre": "Martina", "apellido": "López"},
        ]
        paciente_data = [
            {"nombre": "Julieta", "apellido": "González"},
            {"nombre": "Lucía", "apellido": "Martínez"},
            {"nombre": "Camila", "apellido": "Fernández"},
            {"nombre": "Sofía", "apellido": "Torres"},
            {"nombre": "Valentina", "apellido": "Ramírez"},
            {"nombre": "Martina", "apellido": "Sánchez"},
            {"nombre": "Agustina", "apellido": "Díaz"},
            {"nombre": "Paula", "apellido": "Morales"},
            {"nombre": "Carla", "apellido": "Gómez"},
            {"nombre": "Florencia", "apellido": "Ruiz"},
        ]

        # Crear doctores
        doctores = []
        for i, doc in enumerate(doctor_data):
            doctor = Doctor.objects.create_user(
                dni=10000000 + i,
                password='doctor123',
                nombre=doc["nombre"],
                apellido=doc["apellido"],
                email=f'{doc["nombre"].lower()}.{doc["apellido"].lower()}@example.com',
                token_dispositivo=f"ExponentPushToken[token-doctor{i}]"
            )
            doctores.append(doctor)

        # Crear pacientes
        for i, pac in enumerate(paciente_data):
            doctor = doctores[i % len(doctores)]
            anticonceptivo = anticonceptivos[i % len(anticonceptivos)]
            paciente = Paciente.objects.create_user(
                dni=20000000 + i,
                password='paciente123',
                nombre=pac["nombre"],
                apellido=pac["apellido"],
                email=f'{pac["nombre"].lower()}.{pac["apellido"].lower()}@example.com',
                doctor_asignado=doctor,
                anticonceptivo=anticonceptivo,
                credencial=f'CRED{i:06}',
                cantidad_de_cajas=(i % 3) + 1,
                fecha_de_inicio_periodo=date.today() - timedelta(days=(i * 7)),
                token_dispositivo=f"ExponentPushToken[token-paciente{i}]"
            )

            SolicitudReceta.objects.create(
                paciente=paciente,
                doctor=doctor,
                anticonceptivo=anticonceptivo,
                status='pendiente'
            )

            SolicitudAmistad.objects.create(
                paciente=paciente,
                doctor=doctor,
                anticonceptivo=anticonceptivo,
                estado='aceptado'
            )

        self.stdout.write(self.style.SUCCESS("✅ Datos realistas de prueba creados con éxito."))
def calculate_last_box_end_date(fecha_inicio, cantidad_cajas):
    # Calcular días transcurridos desde el inicio
    days_elapsed = (timezone.now().date() - fecha_inicio).days

    # Calcular días hasta que se termine la última caja
    days_per_box = 28  # Cada caja dura 28 días
    total_days = days_per_box * cantidad_cajas
    days_remaining = total_days - days_elapsed

    # Si faltan 3 días o menos, enviar notificación
    if days_remaining <= NotificationService.DIAS_ANTES_NOTIFICACION:
        return True
    return False

def run_notifications():
    while True:
        # Ejecutar el comando de notificaciones
        subprocess.run(["python3", "manage.py", "send_notifications"])
        # Esperar 24 horas
        time.sleep(24 * 60 * 60)

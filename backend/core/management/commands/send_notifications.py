# backend/core/management/commands/send_notifications.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from core.services.notification_service import NotificationService
from core.models import Paciente
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Verifica y envía notificaciones a los pacientes según su fecha de inicio y cantidad de cajas'

    def handle(self, *args, **options):
        try:
            # Obtener todos los pacientes
            pacientes = Paciente.objects.all()
            self.stdout.write(f'Encontrados {pacientes.count()} pacientes')
            
            for paciente in pacientes:
                try:
                    self.stdout.write(f'\nProcesando paciente: {paciente.nombre} {paciente.apellido}')
                    
                    # Verificar que el paciente tenga configurado fecha de inicio y cantidad de cajas
                    if not paciente.fecha_de_inicio_periodo:
                        self.stdout.write(self.style.WARNING(
                            f'Paciente {paciente.nombre} no tiene fecha de inicio configurada'
                        ))
                        continue
                        
                    if not paciente.cantidad_de_cajas:
                        self.stdout.write(self.style.WARNING(
                            f'Paciente {paciente.nombre} no tiene cantidad de cajas configurada'
                        ))
                        continue
                    
                    # Calcular la fecha fin de la última caja usando la función del NotificationService
                    fecha_fin = NotificationService.calculate_last_box_end_date(
                        paciente.fecha_de_inicio_periodo,
                        paciente.cantidad_de_cajas
                    )
                    
                    if not fecha_fin:
                        self.stdout.write(self.style.WARNING(
                            f'Paciente {paciente.nombre} ya terminó su última caja'
                        ))
                        # En este caso, podemos continuar o, para pruebas, forzar la notificación
                        # Si se quiere forzar, la lógica de check_and_send_notification ya la fuerza a 2 días
                        
                    self.stdout.write(f'Fecha fin última caja: {fecha_fin}')
                    
                    # Verificar y enviar notificación si es necesario
                    success = NotificationService.check_and_send_notification(
                        paciente_token=paciente.token_dispositivo,
                        doctor_token=paciente.doctor_asignado.token_dispositivo if paciente.doctor_asignado and hasattr(paciente.doctor_asignado, 'token_dispositivo') else None,
                        fecha_inicio=paciente.fecha_de_inicio_periodo,
                        cantidad_cajas=paciente.cantidad_de_cajas,
                        paciente=paciente,
                        doctor=paciente.doctor_asignado
                    )
                    
                    if success:
                        self.stdout.write(self.style.SUCCESS(
                            f'Notificación enviada a {paciente.nombre} {paciente.apellido}'
                        ))
                    else:
                        self.stdout.write(self.style.ERROR(
                            f'No se envió notificación a {paciente.nombre} {paciente.apellido}'
                        ))
                        
                except Exception as e:
                    logger.error(f"Error procesando paciente {paciente.id}: {str(e)}")
                    self.stdout.write(self.style.ERROR(
                        f'Error procesando paciente {paciente.nombre}: {str(e)}'
                    ))
            
            self.stdout.write(self.style.SUCCESS('\nProceso de notificaciones completado'))
            
        except Exception as e:
            logger.error(f"Error en el proceso de notificaciones: {str(e)}")
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))

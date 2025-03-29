from datetime import datetime, timedelta
from django.utils import timezone
import logging
import requests
import json

logger = logging.getLogger(__name__)

class NotificationService:
    EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send"
    DIAS_ANTES_NOTIFICACION = 3  # Días antes de que se termine la última caja

    @staticmethod
    def send_expo_push_notification(token, title, body):
        """Send a push notification using Expo's push notification service."""
        if not token:
            logger.warning("No se puede enviar notificación: token no proporcionado")
            return False
            
        try:
            message = {
                "to": token,
                "sound": "default",
                "title": title,
                "body": body,
                "data": {"type": "notification"}
            }
            
            print(f"Enviando notificación a token: {token}")
            print(f"Mensaje: {json.dumps(message, indent=2)}")
            
            response = requests.post(
                NotificationService.EXPO_PUSH_API_URL,
                json=message,
                headers={
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-Type": "application/json"
                }
            )
            
            print(f"Respuesta de Expo: {response.status_code}")
            print(f"Contenido de la respuesta: {response.text}")
            
            if response.status_code == 200:
                logger.info(f"Notificación enviada exitosamente a {token}")
                return True
            else:
                logger.error(f"Error sending Expo push notification: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Exception sending Expo push notification: {str(e)}")
            return False

    @staticmethod
    def calculate_last_box_end_date(fecha_inicio, cantidad_cajas):
        """Calculate when the last box will end based on start date and total boxes."""
        if not fecha_inicio:
            return None

        # Calcular días transcurridos desde el inicio
        days_elapsed = (timezone.now().date() - fecha_inicio).days
        print(f"Días transcurridos desde el inicio: {days_elapsed}")
        
        # Calcular días hasta que se termine la última caja
        # Cada caja dura 28 días
        days_per_box = 28
        total_days = days_per_box * cantidad_cajas
        days_remaining = total_days - days_elapsed
        
        print(f"Días totales: {total_days}")
        print(f"Días restantes: {days_remaining}")
        
        if days_remaining <= 0:
            return None
            
        # Calcular la fecha en que se terminará la última caja
        last_box_end_date = timezone.now().date() + timedelta(days=days_remaining)
        print(f"Fecha fin última caja: {last_box_end_date}")
        
        return last_box_end_date

    @staticmethod
    def check_and_send_notification(paciente_token, doctor_token, fecha_inicio, cantidad_cajas):
        """Check if it's time to send the notification and send it if needed."""
        try:
            print(f"\nVerificando notificación para paciente con fecha inicio: {fecha_inicio}")
            print(f"Cantidad de cajas: {cantidad_cajas}")
            
            # Calcular fecha de fin de la última caja
            fecha_fin = NotificationService.calculate_last_box_end_date(fecha_inicio, cantidad_cajas)
            
            if not fecha_fin:
                logger.info("No hay cajas activas para notificar")
                return False
                
            # Calcular días hasta que se termine la última caja
            dias_restantes = (fecha_fin - timezone.now().date()).days
            print(f"Días restantes hasta fin de última caja: {dias_restantes}")
            print(f"Días antes de notificación: {NotificationService.DIAS_ANTES_NOTIFICACION}")
            
            # Si faltan 3 días o menos, enviar notificación
            if dias_restantes <= NotificationService.DIAS_ANTES_NOTIFICACION:
                print("Enviando notificación...")
                # Enviar notificación al paciente
                paciente_success = NotificationService.send_expo_push_notification(
                    token=paciente_token,
                    title="¡Atención! Última caja",
                    body=f"Te quedan {dias_restantes} días para terminar tu última caja de anticonceptivos."
                )
                
                # Enviar notificación al doctor si tiene token
                doctor_success = True
                if doctor_token:
                    doctor_success = NotificationService.send_expo_push_notification(
                        token=doctor_token,
                        title="Notificación de paciente",
                        body=f"Tu paciente terminará su última caja en {dias_restantes} días."
                    )
                
                return paciente_success and doctor_success
            else:
                print("No se envía notificación: faltan más de 3 días")
                
            return False
            
        except Exception as e:
            logger.error(f"Error en check_and_send_notification: {str(e)}")
            return False 
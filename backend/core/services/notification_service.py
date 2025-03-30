from datetime import timedelta
from django.utils import timezone
import logging
import requests
import json

logger = logging.getLogger(__name__)

class NotificationService:
    EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send"
    DIAS_ANTES_NOTIFICACION = 3  # Se dispara si quedan 3 o menos días

    @staticmethod
    def send_expo_push_notification(token, title, body):
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
            logger.info(f"Enviando notificación a token: {token}")
            logger.debug(f"Mensaje: {json.dumps(message, indent=2)}")
            response = requests.post(
                NotificationService.EXPO_PUSH_API_URL,
                json=message,
                headers={
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-Type": "application/json"
                }
            )
            logger.info(f"Respuesta de Expo: {response.status_code}")
            logger.debug(f"Contenido de la respuesta: {response.text}")
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
        if not fecha_inicio:
            return None
        days_elapsed = (timezone.now().date() - fecha_inicio).days
        logger.info(f"Días transcurridos desde el inicio: {days_elapsed}")
        days_per_box = 28
        total_days = days_per_box * cantidad_cajas
        days_remaining = total_days - days_elapsed
        logger.info(f"Días totales: {total_days}")
        logger.info(f"Días restantes: {days_remaining}")
        if days_remaining <= 0:
            return None
        last_box_end_date = timezone.now().date() + timedelta(days=days_remaining)
        logger.info(f"Fecha fin última caja: {last_box_end_date}")
        return last_box_end_date

    @staticmethod
    def check_and_send_notification(paciente_token, doctor_token, fecha_inicio, cantidad_cajas, paciente, doctor):
        """
        Verifica si quedan pocos días o si ya se terminó el tratamiento y, en ese caso,
        crea automáticamente una solicitud de receta y envía notificaciones a ambos.
        """
        last_box_end_date = NotificationService.calculate_last_box_end_date(fecha_inicio, cantidad_cajas)
        if last_box_end_date is None:
            days_remaining = -1
        else:
            days_remaining = (last_box_end_date - timezone.now().date()).days

        logger.info(f"Días restantes para terminar la última caja: {days_remaining}")

        # Para propósitos de prueba: si days_remaining es negativo, forzamos a 2
        if days_remaining < 0:
            logger.info("Forzando días restantes a 2 para notificación de prueba")
            days_remaining = 2

        if days_remaining <= NotificationService.DIAS_ANTES_NOTIFICACION:
            # Importamos los modelos aquí para evitar ciclos
            from core.models import SolicitudReceta, Anticonceptivo
            # Obtener (o crear) un objeto Anticonceptivo por defecto
            if paciente.anticonceptivo:
                anticonceptivo = paciente.anticonceptivo
            else:
                anticonceptivo, created = Anticonceptivo.objects.get_or_create(
                    marca="Default"
                )
                
            # Crear la solicitud de receta
            solicitud = SolicitudReceta.objects.create(
                paciente=paciente,
                doctor=doctor,
                anticonceptivo=anticonceptivo,
                status='pendiente'
            )
            logger.info(f"Solicitud de receta creada: {solicitud}")

            # Enviar notificación al doctor
            doctor_title = "Nueva solicitud de receta"
            doctor_body = "Tiene una nueva solicitud de receta pendiente de aprobación."
            NotificationService.send_expo_push_notification(doctor_token, doctor_title, doctor_body)

            # Enviar notificación al paciente
            paciente_title = "Solicitud enviada"
            paciente_body = "Su solicitud de receta ha sido generada y está pendiente de aprobación."
            NotificationService.send_expo_push_notification(paciente_token, paciente_title, paciente_body)

            return True
        else:
            logger.info("Aún no es tiempo de notificar; quedan más días.")
            return False

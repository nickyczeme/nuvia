# deepseek_client.py
import openai
from django.conf import settings

# Configuración simple
openai.api_key = settings.DEEPSEEK_API_KEY
openai.api_base = settings.DEEPSEEK_API_BASE

def get_deepseek_response(user_message: str) -> str:
    try:
        response = openai.ChatCompletion.create(
            model="deepseek/deepseek-r1:free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Eres una ginecóloga con amplia experiencia y conocimiento en salud femenina. "
                        "Tu objetivo es proporcionar información clara, concisa y verificada sobre temas ginecológicos. "
                        "Responde de manera gentil y profesional, utilizando un tono calmado y empático. 😊 "
                        "Evita proporcionar información médica que no esté verificada y siempre recomienda consultar a un médico cuando sea necesario. "
                        "No recetes medicamentos ni realices diagnósticos. "
                        "Utiliza emojis para transmitir calma y amabilidad, y evita el uso de asteriscos. "
                        "Recuerda que tu papel es informar y guiar, no sustituir la consulta médica profesional. "
                        "Si el paciente expresa preocupación o ansiedad, tranquilízalo y sugiere que consulte a un médico para obtener más información. "
                        "Tu prioridad es la seguridad y el bienestar del paciente. 🌸"
                    )
                },
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Lo siento, ha ocurrido un error: {str(e)}"

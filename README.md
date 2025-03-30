# 🩺 Nuvia - Sistema de Recetas de Anticoneptivas Automatizadas

Este proyecto permite a **pacientes** solicitar recetas de anticonceptivas de forma automática, y a **doctores** revisar, aceptar o rechazar dichas solicitudes desde una app móvil. Se incluyen notificaciones push para alertar a ambos roles cuando corresponde.

---

## Stack Tecnológico

- **Frontend:** [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/)
- **Backend:** [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- **Base de datos:** [MySQL](https://www.mysql.com/)
- **Notificaciones:** [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

---

## ¿Cómo correr el proyecto?

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/nuvia.git
cd nuvia
```

### 2. Backend (Django)
- Ir a la carpeta del backend
```bash
cd backend
```    

- Instalar dependencias
```bash
pip install -r requirements.txt
```

- Crear la base y aplicar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```
- Crear superusuario (opcional)
```bash
python manage.py createsuperuser
```

- Levantar el servidor de desarrollo
```bash
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend (Expo)
- Ir a la carpeta del frontend
```bash
cd app
```
- Instalar dependencias
```bash
npm install
```
- Iniciar Expo
```bash
npx expo start
```
Escaneá el código QR con la app de Expo Go para probarlo en tu celular. Tenes que tener descargada la aplicación de Expo Go.

### Servicios Automáticos
Para activar el sistema de notificaciones automáticas (cuando un paciente tiene recetas programadas), corré el siguiente comando desde backend:

```bash
python manage.py send_notifications
```
### Datos de prueba
Hay un comando para crear un entorno de desarrollo con usuarios, doctores y recetas:

```bash
python manage.py seeds
```

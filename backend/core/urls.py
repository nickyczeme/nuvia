from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import (
    RegistroUsuarioView, LoginUsuarioView, NotificationViewSet,
    get_user_info
)
=======
from .views import RegistroUsuarioView, LoginUsuarioView, NotificationViewSet, DoctorListView, assign_doctor
from . import views
from .views import UpdatePacienteView
>>>>>>> main

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
    path('', include(router.urls)),
<<<<<<< HEAD
    path('me/', get_user_info, name='user-info'),
=======
    path('me/', views.get_user_info, name='user-info'),
    path('update/', UpdatePacienteView.as_view(), name='update-paciente'),
    path("doctores/", DoctorListView.as_view(), name="lista-doctores"),
    path("asignar-doctor/", assign_doctor, name="asignar-doctor"),
>>>>>>> main
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroUsuarioView, LoginUsuarioView, NotificationViewSet, DoctorListView, assign_doctor, get_anticonceptivos
from . import views
from .views import UpdatePacienteView

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
    path('', include(router.urls)),
    path('me/', views.get_user_info, name='user-info'),
    path('update/', UpdatePacienteView.as_view(), name='update-paciente'),
    path("doctores/", DoctorListView.as_view(), name="lista-doctores"),
    path("asignar-doctor/", assign_doctor, name="asignar-doctor"),
    path("anticonceptivos/", get_anticonceptivos, name="anticonceptivos"),

]

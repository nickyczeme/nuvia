from django.urls import path
from .views import RegistroUsuarioView, LoginUsuarioView

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
] 

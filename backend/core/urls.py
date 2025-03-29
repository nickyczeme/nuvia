from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroUsuarioView, LoginUsuarioView, NotificationViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
    path('', include(router.urls)),
] 

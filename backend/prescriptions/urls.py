from django.urls import path
from .views import PrescriptionRequestListCreateView, update_prescription_status,pedir_receta_unica, activar_receta_automatica

urlpatterns = [
    path('', PrescriptionRequestListCreateView.as_view(), name='prescription-list-create'),
    path('<int:pk>/update/', update_prescription_status, name='prescription-update'),
    path('pedir-unica/', pedir_receta_unica, name='pedir-receta-unica'), 
    path('activar-automatica/', activar_receta_automatica),  # 👈 nueva ruta
]

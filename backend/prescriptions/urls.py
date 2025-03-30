from django.urls import path
from .views import PrescriptionRequestListCreateView, update_prescription_status

urlpatterns = [
    path('', PrescriptionRequestListCreateView.as_view(), name='prescription-list-create'),
    path('<int:pk>/update/', update_prescription_status, name='prescription-update'),
]

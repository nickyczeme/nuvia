from rest_framework import serializers
from .models import ContraceptiveMethod, Prescription
from users.serializers import UserSerializer

class ContraceptiveMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContraceptiveMethod
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor = UserSerializer(read_only=True)
    patient = UserSerializer(read_only=True)
    contraceptive_method = ContraceptiveMethodSerializer(read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ('doctor', 'date_prescribed')

class PrescriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ('patient', 'contraceptive_method', 'start_date', 'end_date', 'notes') 
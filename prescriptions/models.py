from django.db import models
from users.models import User

class ContraceptiveMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    instructions = models.TextField()
    side_effects = models.TextField()
    effectiveness_rate = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Prescription(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions_given')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions_received')
    contraceptive_method = models.ForeignKey(ContraceptiveMethod, on_delete=models.CASCADE)
    date_prescribed = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Prescription for {self.patient.username} - {self.contraceptive_method.name}" 
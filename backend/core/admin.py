from django.contrib import admin
from .models import Usuario, Doctor, Anticonceptivo, Paciente

admin.site.register(Usuario)
admin.site.register(Doctor)
admin.site.register(Anticonceptivo)
admin.site.register(Paciente)

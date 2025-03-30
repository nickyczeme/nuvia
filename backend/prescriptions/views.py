from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from core.models import SolicitudReceta
from core.serializers import SolicitudRecetaSerializer

class PrescriptionRequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not hasattr(user, 'doctor'):
            return Response({'detail': 'Este usuario no es un doctor'}, status=403)
        
        
        print("request.user:", request.user)

        # prescriptions = SolicitudReceta.objects.filter(doctor=user.doctor)
        prescriptions = SolicitudReceta.objects.all()
        serializer = SolicitudRecetaSerializer(prescriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user

        if not hasattr(user, 'paciente'):
            return Response({'detail': 'Solo los pacientes pueden crear solicitudes'}, status=403)

        serializer = SolicitudRecetaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(paciente=user.paciente)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_prescription_status(request, pk):
    prescription = SolicitudReceta.objects.get(pk=pk)
    serializer = SolicitudRecetaSerializer(prescription, data={"status": request.data.get("status")}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

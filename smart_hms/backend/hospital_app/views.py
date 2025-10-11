from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from .models import User, Patient, Doctor, Admin, Appointment, MedicalRecord, Prescription, SymptomChecker
from .serializers import (
    UserSerializer, PatientSerializer, DoctorSerializer, AdminSerializer,
    AppointmentSerializer, MedicalRecordSerializer, PrescriptionSerializer,
    SymptomCheckerSerializer, UserRegistrationSerializer, LoginSerializer
)
from .ai_model.symptom_checker import SymptomCheckerAI


class UserViewSet(viewsets.ModelViewSet):
    """User management viewset"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'doctor':
            # Doctors can see patients they have appointments with
            patient_ids = Appointment.objects.filter(doctor__user=user).values_list('patient__user_id', flat=True)
            return User.objects.filter(id__in=patient_ids)
        else:
            # Patients can only see their own profile
            return User.objects.filter(id=user.id)


class PatientViewSet(viewsets.ModelViewSet):
    """Patient management viewset"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Patient.objects.all()
        elif user.role == 'doctor':
            # Doctors can see patients they have appointments with
            return Patient.objects.filter(appointments__doctor__user=user).distinct()
        else:
            # Patients can only see their own profile
            return Patient.objects.filter(user=user)


class DoctorViewSet(viewsets.ModelViewSet):
    """Doctor management viewset"""
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Doctor.objects.all()
        elif user.role == 'doctor':
            # Doctors can only see their own profile
            return Doctor.objects.filter(user=user)
        else:
            # Patients can see all available doctors
            return Doctor.objects.filter(is_available=True)


class AdminViewSet(viewsets.ModelViewSet):
    """Admin management viewset"""
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Admin.objects.all()
        else:
            return Admin.objects.none()


class AppointmentViewSet(viewsets.ModelViewSet):
    """Appointment management viewset"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Appointment.objects.all()
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        else:
            # Patients can only see their own appointments
            return Appointment.objects.filter(patient__user=user)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment"""
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response({'status': 'Appointment confirmed'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'status': 'Appointment cancelled'})


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """Medical record management viewset"""
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return MedicalRecord.objects.all()
        elif user.role == 'doctor':
            return MedicalRecord.objects.filter(doctor__user=user)
        else:
            # Patients can only see their own medical records
            return MedicalRecord.objects.filter(patient__user=user)


class PrescriptionViewSet(viewsets.ModelViewSet):
    """Prescription management viewset"""
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Prescription.objects.all()
        elif user.role == 'doctor':
            return Prescription.objects.filter(doctor__user=user)
        else:
            # Patients can only see their own prescriptions
            return Prescription.objects.filter(patient__user=user)


class SymptomCheckerViewSet(viewsets.ModelViewSet):
    """Symptom checker viewset"""
    queryset = SymptomChecker.objects.all()
    serializer_class = SymptomCheckerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return SymptomChecker.objects.all()
        elif user.role == 'doctor':
            return SymptomChecker.objects.filter(patient__user__in=User.objects.filter(
                appointments__doctor__user=user
            ).distinct())
        else:
            # Patients can only see their own symptom checks
            return SymptomChecker.objects.filter(patient__user=user)
    
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze symptoms using AI"""
        symptoms = request.data.get('symptoms', '')
        if not symptoms:
            return Response({'error': 'Symptoms are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Initialize AI model
            ai_model = SymptomCheckerAI()
            
            # Get predictions
            predictions = ai_model.predict(symptoms)
            
            # Create symptom check record
            symptom_check = SymptomChecker.objects.create(
                patient=request.user.patient_profile if hasattr(request.user, 'patient_profile') else None,
                symptoms=symptoms,
                predicted_conditions=predictions.get('conditions', []),
                confidence_scores=predictions.get('confidence', {}),
                recommendations=predictions.get('recommendations', '')
            )
            
            serializer = self.get_serializer(symptom_check)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(APIView):
    """User registration view"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print(f"Register request received: {request.data}")
        print(f"Request headers: {request.headers}")
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create profile based on role
            if user.role == 'patient':
                Patient.objects.create(user=user)
            elif user.role == 'doctor':
                Doctor.objects.create(user=user, license_number=f"DOC{user.id:06d}")
            elif user.role == 'admin':
                Admin.objects.create(user=user, employee_id=f"ADM{user.id:06d}")
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        print(f"Register serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login view"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print(f"Login request received: {request.data}")
        print(f"Request headers: {request.headers}")
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        print(f"Login serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardView(APIView):
    """Dashboard view for different user roles"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = {'user': UserSerializer(user).data}
        
        if user.role == 'patient':
            # Patient dashboard data
            appointments = Appointment.objects.filter(patient__user=user).order_by('-appointment_date')[:5]
            prescriptions = Prescription.objects.filter(patient__user=user, is_active=True).order_by('-created_at')[:5]
            medical_records = MedicalRecord.objects.filter(patient__user=user).order_by('-created_at')[:5]
            
            data.update({
                'appointments': AppointmentSerializer(appointments, many=True).data,
                'prescriptions': PrescriptionSerializer(prescriptions, many=True).data,
                'medical_records': MedicalRecordSerializer(medical_records, many=True).data,
            })
            
        elif user.role == 'doctor':
            # Doctor dashboard data
            appointments = Appointment.objects.filter(doctor__user=user).order_by('-appointment_date')[:5]
            patients = Patient.objects.filter(appointments__doctor__user=user).distinct()[:5]
            
            data.update({
                'appointments': AppointmentSerializer(appointments, many=True).data,
                'patients': PatientSerializer(patients, many=True).data,
            })
            
        elif user.role == 'admin':
            # Admin dashboard data
            total_users = User.objects.count()
            total_appointments = Appointment.objects.count()
            total_doctors = Doctor.objects.count()
            total_patients = Patient.objects.count()
            
            data.update({
                'stats': {
                    'total_users': total_users,
                    'total_appointments': total_appointments,
                    'total_doctors': total_doctors,
                    'total_patients': total_patients,
                }
            })
        
        return Response(data)
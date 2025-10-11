from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Patient, Doctor, Admin, Appointment, MedicalRecord, Prescription, SymptomChecker


class UserSerializer(serializers.ModelSerializer):
    """User serializer for basic user information"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'address', 'date_of_birth']
        read_only_fields = ['id']


class PatientSerializer(serializers.ModelSerializer):
    """Patient serializer with user information"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'user', 'emergency_contact', 'emergency_phone', 'blood_type', 'allergies', 'medical_insurance']
        read_only_fields = ['id']


class DoctorSerializer(serializers.ModelSerializer):
    """Doctor serializer with user information"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialization', 'license_number', 'experience_years', 'consultation_fee', 'is_available']
        read_only_fields = ['id']


class AdminSerializer(serializers.ModelSerializer):
    """Admin serializer with user information"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Admin
        fields = ['id', 'user', 'department', 'employee_id']
        read_only_fields = ['id']


class AppointmentSerializer(serializers.ModelSerializer):
    """Appointment serializer"""
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name', 'appointment_date', 'status', 'reason', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Medical record serializer"""
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'doctor', 'appointment', 'patient_name', 'doctor_name', 'diagnosis', 'symptoms', 'treatment_plan', 'vital_signs', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrescriptionSerializer(serializers.ModelSerializer):
    """Prescription serializer"""
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Prescription
        fields = ['id', 'patient', 'doctor', 'medical_record', 'patient_name', 'doctor_name', 'medication_name', 'dosage', 'frequency', 'duration', 'instructions', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class SymptomCheckerSerializer(serializers.ModelSerializer):
    """Symptom checker serializer"""
    class Meta:
        model = SymptomChecker
        fields = ['id', 'patient', 'symptoms', 'predicted_conditions', 'confidence_scores', 'recommendations', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'phone_number', 'address', 'date_of_birth']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Login serializer"""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password.')

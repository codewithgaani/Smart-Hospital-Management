from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Extended User model with role-based access"""
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_full_name(self):
        """Return the full name of the user"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return self.username
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class Patient(models.Model):
    """Patient-specific information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=15, blank=True)
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    medical_insurance = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"Patient: {self.user.get_full_name() or self.user.username}"


class Doctor(models.Model):
    """Doctor-specific information"""
    SPECIALIZATION_CHOICES = [
        ('cardiology', 'Cardiology'),
        ('neurology', 'Neurology'),
        ('orthopedics', 'Orthopedics'),
        ('pediatrics', 'Pediatrics'),
        ('dermatology', 'Dermatology'),
        ('psychiatry', 'Psychiatry'),
        ('general', 'General Medicine'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=20, choices=SPECIALIZATION_CHOICES, default='general')
    license_number = models.CharField(max_length=50, unique=True)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username} ({self.specialization})"


class Admin(models.Model):
    """Admin-specific information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    department = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return f"Admin: {self.user.get_full_name() or self.user.username}"


class Appointment(models.Model):
    """Appointment scheduling"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    reason = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-appointment_date']
    
    def __str__(self):
        return f"Appointment: {self.patient.user.username} with Dr. {self.doctor.user.username} on {self.appointment_date}"


class MedicalRecord(models.Model):
    """Patient medical records"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medical_records')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='medical_records', null=True, blank=True)
    diagnosis = models.TextField()
    symptoms = models.TextField()
    treatment_plan = models.TextField()
    vital_signs = models.JSONField(default=dict, blank=True)  # Store BP, temperature, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Medical Record: {self.patient.user.username} - {self.created_at.date()}"


class Prescription(models.Model):
    """Prescription management"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='prescriptions', null=True, blank=True)
    medication_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    instructions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Prescription: {self.medication_name} for {self.patient.user.username}"


class SymptomChecker(models.Model):
    """AI Symptom Checker results"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='symptom_checks', null=True, blank=True)
    symptoms = models.TextField()
    predicted_conditions = models.JSONField(default=list)
    confidence_scores = models.JSONField(default=dict)
    recommendations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Symptom Check: {self.symptoms[:50]}... - {self.created_at.date()}"
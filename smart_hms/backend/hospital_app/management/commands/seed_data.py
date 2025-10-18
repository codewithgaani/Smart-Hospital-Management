from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from hospital_app.models import User, Patient, Doctor, Admin, Appointment, MedicalRecord, Prescription
import random


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with sample data...')
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@hospital.com',
                'first_name': 'Hospital',
                'last_name': 'Administrator',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            Admin.objects.create(user=admin_user, employee_id='ADM000001', department='Administration')
            self.stdout.write('Created admin user')
        
        # Create doctors
        doctors_data = [
            {
                'username': 'dr_smith',
                'email': 'dr.smith@hospital.com',
                'first_name': 'John',
                'last_name': 'Smith',
                'specialization': 'cardiology',
                'license_number': 'DOC000001',
                'experience_years': 15,
                'consultation_fee': 150.00
            },
            {
                'username': 'dr_johnson',
                'email': 'dr.johnson@hospital.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'specialization': 'neurology',
                'license_number': 'DOC000002',
                'experience_years': 12,
                'consultation_fee': 200.00
            },
            {
                'username': 'dr_williams',
                'email': 'dr.williams@hospital.com',
                'first_name': 'Michael',
                'last_name': 'Williams',
                'specialization': 'orthopedics',
                'license_number': 'DOC000003',
                'experience_years': 10,
                'consultation_fee': 180.00
            },
            {
                'username': 'dr_brown',
                'email': 'dr.brown@hospital.com',
                'first_name': 'Emily',
                'last_name': 'Brown',
                'specialization': 'pediatrics',
                'license_number': 'DOC000004',
                'experience_years': 8,
                'consultation_fee': 120.00
            },
            {
                'username': 'dr_davis',
                'email': 'dr.davis@hospital.com',
                'first_name': 'Robert',
                'last_name': 'Davis',
                'specialization': 'general',
                'license_number': 'DOC000005',
                'experience_years': 20,
                'consultation_fee': 100.00
            }
        ]
        
        doctors = []
        for doctor_data in doctors_data:
            user, created = User.objects.get_or_create(
                username=doctor_data['username'],
                defaults={
                    'email': doctor_data['email'],
                    'first_name': doctor_data['first_name'],
                    'last_name': doctor_data['last_name'],
                    'role': 'doctor',
                    'phone_number': f'555-{random.randint(1000, 9999)}'
                }
            )
            if created:
                user.set_password('doctor123')
                user.save()
            
            doctor, created = Doctor.objects.get_or_create(
                user=user,
                defaults={
                    'specialization': doctor_data['specialization'],
                    'license_number': doctor_data['license_number'],
                    'experience_years': doctor_data['experience_years'],
                    'consultation_fee': doctor_data['consultation_fee']
                }
            )
            doctors.append(doctor)
            self.stdout.write(f'Created doctor: {doctor}')
        
        # Create patients
        patients_data = [
            {
                'username': 'patient1',
                'email': 'patient1@email.com',
                'first_name': 'Alice',
                'last_name': 'Johnson',
                'phone_number': '555-1001',
                'blood_type': 'A+',
                'allergies': 'Penicillin'
            },
            {
                'username': 'patient2',
                'email': 'patient2@email.com',
                'first_name': 'Bob',
                'last_name': 'Smith',
                'phone_number': '555-1002',
                'blood_type': 'B+',
                'allergies': 'None'
            },
            {
                'username': 'patient3',
                'email': 'patient3@email.com',
                'first_name': 'Carol',
                'last_name': 'Davis',
                'phone_number': '555-1003',
                'blood_type': 'O+',
                'allergies': 'Shellfish'
            },
            {
                'username': 'patient4',
                'email': 'patient4@email.com',
                'first_name': 'David',
                'last_name': 'Wilson',
                'phone_number': '555-1004',
                'blood_type': 'AB+',
                'allergies': 'Latex'
            },
            {
                'username': 'patient5',
                'email': 'patient5@email.com',
                'first_name': 'Eva',
                'last_name': 'Brown',
                'phone_number': '555-1005',
                'blood_type': 'A-',
                'allergies': 'Aspirin'
            },
            {
                'username': 'patient6',
                'email': 'patient6@email.com',
                'first_name': 'Frank',
                'last_name': 'Miller',
                'phone_number': '555-1006',
                'blood_type': 'B-',
                'allergies': 'None'
            },
            {
                'username': 'patient7',
                'email': 'patient7@email.com',
                'first_name': 'Grace',
                'last_name': 'Taylor',
                'phone_number': '555-1007',
                'blood_type': 'O-',
                'allergies': 'Peanuts'
            },
            {
                'username': 'patient8',
                'email': 'patient8@email.com',
                'first_name': 'Henry',
                'last_name': 'Anderson',
                'phone_number': '555-1008',
                'blood_type': 'AB-',
                'allergies': 'None'
            },
            {
                'username': 'patient9',
                'email': 'patient9@email.com',
                'first_name': 'Ivy',
                'last_name': 'Thomas',
                'phone_number': '555-1009',
                'blood_type': 'A+',
                'allergies': 'Dust'
            },
            {
                'username': 'patient10',
                'email': 'patient10@email.com',
                'first_name': 'Jack',
                'last_name': 'Jackson',
                'phone_number': '555-1010',
                'blood_type': 'B+',
                'allergies': 'None'
            },
            {
                'username': 'patient11',
                'email': 'patient11@email.com',
                'first_name': 'Kate',
                'last_name': 'White',
                'phone_number': '555-1011',
                'blood_type': 'O+',
                'allergies': 'Cats'
            },
            {
                'username': 'patient12',
                'email': 'patient12@email.com',
                'first_name': 'Liam',
                'last_name': 'Harris',
                'phone_number': '555-1012',
                'blood_type': 'A-',
                'allergies': 'None'
            }
        ]
        
        patients = []
        for patient_data in patients_data:
            user, created = User.objects.get_or_create(
                username=patient_data['username'],
                defaults={
                    'email': patient_data['email'],
                    'first_name': patient_data['first_name'],
                    'last_name': patient_data['last_name'],
                    'role': 'patient',
                    'phone_number': patient_data['phone_number']
                }
            )
            if created:
                user.set_password('patient123')
                user.save()
            
            patient, created = Patient.objects.get_or_create(
                user=user,
                defaults={
                    'blood_type': patient_data['blood_type'],
                    'allergies': patient_data['allergies'],
                    'emergency_contact': f'Emergency Contact for {patient_data["first_name"]}',
                    'emergency_phone': f'555-{random.randint(2000, 2999)}',
                    'medical_insurance': 'Health Insurance Co.'
                }
            )
            patients.append(patient)
            self.stdout.write(f'Created patient: {patient}')
        
        # Create appointments
        appointment_reasons = [
            'Routine checkup',
            'Chest pain',
            'Headache',
            'Annual physical',
            'Follow-up visit',
            'Vaccination',
            'Blood pressure check',
            'Diabetes management'
        ]
        
        # Create only 2 appointments for realistic demo
        for i in range(2):
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            appointment_date = timezone.now() + timedelta(days=random.randint(-7, 7))
            
            appointment, created = Appointment.objects.get_or_create(
                patient=patient,
                doctor=doctor,
                appointment_date=appointment_date,
                defaults={
                    'reason': random.choice(appointment_reasons),
                    'status': random.choice(['scheduled', 'confirmed']),
                    'notes': f'Appointment notes for {patient.user.get_full_name()}'
                }
            )
            if created:
                self.stdout.write(f'Created appointment: {appointment}')
        
        # Create medical records
        diagnoses = [
            'Hypertension',
            'Diabetes Type 2',
            'Common Cold',
            'Migraine',
            'Arthritis',
            'Asthma',
            'Depression',
            'Anxiety'
        ]
        
        symptoms_list = [
            'fever headache fatigue',
            'chest pain shortness of breath',
            'nausea vomiting',
            'joint pain swelling',
            'rash itching',
            'dizziness confusion',
            'abdominal pain bloating',
            'back pain stiffness'
        ]
        
        for i in range(15):
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            appointment = Appointment.objects.filter(patient=patient, doctor=doctor).first()
            
            medical_record, created = MedicalRecord.objects.get_or_create(
                patient=patient,
                doctor=doctor,
                appointment=appointment,
                defaults={
                    'diagnosis': random.choice(diagnoses),
                    'symptoms': random.choice(symptoms_list),
                    'treatment_plan': f'Treatment plan for {random.choice(diagnoses)}',
                    'vital_signs': {
                        'blood_pressure': f'{random.randint(110, 140)}/{random.randint(70, 90)}',
                        'heart_rate': random.randint(60, 100),
                        'temperature': round(random.uniform(98.0, 100.0), 1),
                        'weight': random.randint(120, 200)
                    }
                }
            )
            if created:
                self.stdout.write(f'Created medical record: {medical_record}')
        
        # Create prescriptions
        medications = [
            'Metformin 500mg',
            'Lisinopril 10mg',
            'Ibuprofen 400mg',
            'Amoxicillin 500mg',
            'Paracetamol 500mg',
            'Omeprazole 20mg',
            'Atorvastatin 20mg',
            'Metoprolol 50mg'
        ]
        
        for i in range(10):
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            medical_record = MedicalRecord.objects.filter(patient=patient, doctor=doctor).first()
            
            prescription, created = Prescription.objects.get_or_create(
                patient=patient,
                doctor=doctor,
                medical_record=medical_record,
                medication_name=random.choice(medications),
                defaults={
                    'dosage': '1 tablet',
                    'frequency': 'twice daily',
                    'duration': '7 days',
                    'instructions': 'Take with food'
                }
            )
            if created:
                self.stdout.write(f'Created prescription: {prescription}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with sample data!')
        )
        self.stdout.write('Sample users created:')
        self.stdout.write('Admin: admin / admin123')
        self.stdout.write('Doctors: dr_smith, dr_johnson, dr_williams, dr_brown, dr_davis / doctor123')
        self.stdout.write('Patients: patient1, patient2, patient3, patient4, patient5, patient6, patient7, patient8, patient9, patient10, patient11, patient12 / patient123')

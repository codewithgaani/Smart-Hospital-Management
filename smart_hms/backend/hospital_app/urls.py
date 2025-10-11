from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'doctors', views.DoctorViewSet)
router.register(r'admins', views.AdminViewSet)
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'medical-records', views.MedicalRecordViewSet)
router.register(r'prescriptions', views.PrescriptionViewSet)
router.register(r'symptom-checker', views.SymptomCheckerViewSet)

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard endpoint
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # AI endpoints
    path('ai/symptom-checker/', views.SymptomCheckerViewSet.as_view({'post': 'analyze'}), name='ai_symptom_checker'),
    
    # Include router URLs
    path('', include(router.urls)),
]

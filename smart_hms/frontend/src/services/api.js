import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/'),
  updateProfile: (data) => api.patch('/users/', data),
};

// Patient API
export const patientAPI = {
  getPatients: () => api.get('/patients/'),
  getPatient: (id) => api.get(`/patients/${id}/`),
  updatePatient: (id, data) => api.patch(`/patients/${id}/`, data),
};

// Doctor API
export const doctorAPI = {
  getDoctors: () => api.get('/doctors/'),
  getDoctor: (id) => api.get(`/doctors/${id}/`),
  updateDoctor: (id, data) => api.patch(`/doctors/${id}/`, data),
};

// Appointment API
export const appointmentAPI = {
  getAppointments: () => api.get('/appointments/'),
  getAppointment: (id) => api.get(`/appointments/${id}/`),
  createAppointment: (data) => api.post('/appointments/', data),
  updateAppointment: (id, data) => api.patch(`/appointments/${id}/`, data),
  confirmAppointment: (id) => api.post(`/appointments/${id}/confirm/`),
  cancelAppointment: (id) => api.post(`/appointments/${id}/cancel/`),
};

// Medical Record API
export const medicalRecordAPI = {
  getMedicalRecords: () => api.get('/medical-records/'),
  getMedicalRecord: (id) => api.get(`/medical-records/${id}/`),
  createMedicalRecord: (data) => api.post('/medical-records/', data),
  updateMedicalRecord: (id, data) => api.patch(`/medical-records/${id}/`, data),
};

// Prescription API
export const prescriptionAPI = {
  getPrescriptions: () => api.get('/prescriptions/'),
  getPrescription: (id) => api.get(`/prescriptions/${id}/`),
  createPrescription: (data) => api.post('/prescriptions/', data),
  updatePrescription: (id, data) => api.patch(`/prescriptions/${id}/`, data),
};

// AI API
export const aiAPI = {
  analyzeSymptoms: (symptoms) => api.post('/ai/symptom-checker/', { symptoms }),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard/'),
};

export default api;

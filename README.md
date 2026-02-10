# Smart Hospital Management System

A comprehensive AI-powered hospital management system built with Django REST API backend and React frontend, featuring role-based access control, appointment management, and AI symptom checker.

## 🌐 Live Demo

- **Frontend**: [https://smart-hms-frontend.vercel.app](https://smart-hms-frontend.vercel.app)
- **Backend API**: [https://smart-hms-backend.onrender.com/api/](https://smart-hms-backend.onrender.com/api/)
- **Admin Panel**: [https://smart-hms-backend.onrender.com/admin/](https://smart-hms-backend.onrender.com/admin/)

## 🔐 Demo Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Doctor Accounts
- **Username**: `dr_smith` | **Password**: `doctor123`
- **Username**: `dr_johnson` | **Password**: `doctor123`
- **Username**: `dr_davis` | **Password**: `doctor123`

### Patient Accounts
- **Username**: `patient1` | **Password**: `patient123`
- **Username**: `patient2` | **Password**: `patient123`
## 🏥 Features

### Core Functionality
- **Role-based Authentication** (Patient, Doctor, Admin)
- **Appointment Management** with booking and scheduling
- **Patient Records** management
- **Doctor Profiles** with specializations
- **AI Symptom Checker** for preliminary diagnosis
- **Analytics Dashboard** with key performance indicators
- **Responsive Design** for mobile and desktop

### AI Features
- Machine learning-based symptom analysis
- Disease prediction with confidence scoring
- Medical recommendations and next steps
- Preliminary diagnosis assistance

### User Roles
- **Patients**: Book appointments, view medical records, use symptom checker
- **Doctors**: Manage appointments, view patient records, access symptom checker
- **Admins**: Full system access, analytics, user management

## 🚀 Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **JWT Authentication** - Secure token-based auth
- **scikit-learn** - Machine learning for AI features
- **pandas** - Data processing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shorya06/Smart-Hospital-Management.git
   cd Smart-Hospital-Management/smart_hms/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py seed_data  # Load sample data
   ```

5. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```


## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
smart_hms/
├── backend/
│   ├── hospital/           # Django project settings
│   ├── hospital_app/       # Main application
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views
│   │   ├── serializers.py # Data serialization
│   │   └── ai_model/      # AI/ML components
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── theme.js       # Material-UI theme
│   └── package.json       # Node.js dependencies
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/refresh/` - Token refresh

### Core Features
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/patients/` - List patients
- `GET /api/doctors/` - List doctors
- `POST /api/ai/symptom-checker/` - AI symptom analysis

## 🎨 UI/UX Features

- **Healthcare-inspired Design** with professional color scheme
- **Responsive Layout** with Material-UI components
- **Role-based Navigation** with dynamic menu items
- **Interactive Dashboards** with KPI cards and charts
- **Smooth Animations** using Framer Motion
- **Mobile-first Design** with touch-friendly interfaces

## 🤖 AI Features

### Symptom Checker
- Natural language symptom input
- Machine learning-based disease prediction
- Confidence scoring and recommendations
- Medical disclaimer and professional advice prompts

### Future AI Enhancements
- Medical image analysis
- Predictive analytics
- Natural language processing
- Integration with medical databases

## 🚀 Deployment

### Production Setup
1. Configure production database
2. Set up environment variables
3. Configure static file serving
4. Set up SSL certificates
5. Configure reverse proxy (Nginx)

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 10GB
- **CPU**: 2 cores
- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

### Recommended Requirements
- **RAM**: 8GB
- **Storage**: 20GB SSD
- **CPU**: 4 cores
- **OS**: Latest stable versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Krishna** - *Initial work* - [codewithgaani](https://github.com/codewithgaani)
- Collaborated later with a team of 3 members.

## 🙏 Acknowledgments

- Material-UI for the component library
- Django REST Framework for API development
- React community for excellent documentation
- Healthcare professionals for domain insights

## 📞 Support

For support, email support@smarthms.com or create an issue in the repository.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic hospital management features
- ✅ AI symptom checker
- ✅ Role-based access control
- ✅ Responsive UI/UX

### Phase 2 (Planned)
- 🔄 Advanced AI features
- 🔄 Medical image analysis
- 🔄 Real-time notifications
- 🔄 Mobile app development

### Phase 3 (Future)
- ⏳ Integration with medical devices
- ⏳ Telemedicine features
- ⏳ Advanced analytics
- ⏳ Multi-language support

---

**Built with ❤️ for better healthcare management**

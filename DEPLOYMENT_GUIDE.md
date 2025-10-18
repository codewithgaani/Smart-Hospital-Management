# Smart Hospital Management System - Deployment Guide

## 🚀 Deployment Overview

This guide will help you deploy the Smart Hospital Management System with:
- **Backend**: Django REST API on Render
- **Frontend**: React + Vite on Vercel
- **Database**: PostgreSQL on Render

## 📋 Prerequisites

1. GitHub account
2. Render account (free tier available)
3. Vercel account (free tier available)
4. Git installed locally

## 🗄️ Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository
```bash
cd "C:\Users\hp\Desktop\AI Hospital Management"
git init
git add .
git commit -m "Initial commit: Smart Hospital Management System"
```

### 1.2 Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it: `smart-hospital-management-system`
3. Don't initialize with README
4. Copy the repository URL

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-hospital-management-system.git
git branch -M main
git push -u origin main
```

## 🛠️ Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `smart-hms-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `smart_hms/backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn hospital.wsgi:application`

### 2.3 Environment Variables
Add these environment variables in Render:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=smart-hms-backend.onrender.com
CORS_ALLOW_ALL_ORIGINS=True
DATABASE_URL=postgres://user:password@host:port/dbname
```

### 2.4 Create PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `smart-hms-db`
3. Copy the connection string
4. Add it as `DATABASE_URL` environment variable

### 2.5 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://smart-hms-backend.onrender.com`

## 🌐 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 3.2 Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `smart_hms/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Environment Variables
Add this environment variable in Vercel:
```
VITE_API_URL=https://smart-hms-backend.onrender.com
```

### 3.4 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://smart-hms-frontend.vercel.app`

## 🔗 Step 4: Final Configuration

### 4.1 Update Backend CORS Settings
In your Render backend environment variables, add:
```
CORS_ALLOWED_ORIGINS=https://smart-hms-frontend.vercel.app
```

### 4.2 Run Database Migrations
1. Go to your Render backend service
2. Open the shell/console
3. Run:
```bash
python manage.py migrate
python manage.py seed_data
```

## ✅ Step 5: Testing

### 5.1 Test Backend
Visit: `https://smart-hms-backend.onrender.com/api/`
- Should return API information

### 5.2 Test Frontend
Visit: `https://smart-hms-frontend.vercel.app`
- Should load the application
- Test login with demo credentials:
  - Admin: `admin` / `admin123`
  - Doctor: `dr_smith` / `doctor123`
  - Patient: `patient1` / `patient123`

### 5.3 Test API Integration
1. Open browser developer tools
2. Check console for errors
3. Test login functionality
4. Verify appointments page loads

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
   - Check `CORS_ALLOW_ALL_ORIGINS=True` is set

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL service is running

3. **Static Files Not Loading**
   - Check `STATIC_ROOT` and `STATIC_URL` settings
   - Ensure `whitenoise` is in middleware

4. **Frontend API Calls Failing**
   - Verify `VITE_API_URL` environment variable
   - Check browser network tab for failed requests

## 📊 Monitoring

### Render Monitoring
- Check service logs in Render dashboard
- Monitor uptime and performance
- Set up alerts for downtime

### Vercel Monitoring
- Check deployment logs
- Monitor build times
- Set up analytics

## 🔄 Updates and Maintenance

### Backend Updates
1. Make changes locally
2. Test locally
3. Push to GitHub
4. Render will auto-deploy

### Frontend Updates
1. Make changes locally
2. Test locally
3. Push to GitHub
4. Vercel will auto-deploy

## 🎯 Final URLs

After successful deployment:
- **Frontend**: `https://smart-hms-frontend.vercel.app`
- **Backend API**: `https://smart-hms-backend.onrender.com/api/`
- **Admin Panel**: `https://smart-hms-backend.onrender.com/admin/`

## 📝 Demo Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Doctor Accounts
- Username: `dr_smith` | Password: `doctor123`
- Username: `dr_johnson` | Password: `doctor123`

### Patient Accounts
- Username: `patient1` | Password: `patient123`
- Username: `patient2` | Password: `patient123`

## 🎉 Success!

Your Smart Hospital Management System is now live on the internet! 

Share the frontend URL with users and the backend URL with developers who need API access.

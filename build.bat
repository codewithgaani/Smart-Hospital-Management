@echo off
echo 🏥 Building Smart Hospital Management System...

REM Build backend
echo 📦 Building backend...
cd smart_hms\backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
echo ✅ Backend build complete

REM Build frontend
echo 📦 Building frontend...
cd ..\frontend
npm install
npm run build
echo ✅ Frontend build complete

echo 🎉 Build complete! Ready for deployment.
pause

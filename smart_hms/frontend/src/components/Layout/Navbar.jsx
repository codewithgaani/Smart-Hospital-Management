import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  People,
  CalendarToday,
  MedicalServices,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...baseItems,
          { label: 'Book Appointment', path: '/appointments', icon: <CalendarToday /> },
          { label: 'Medical Records', path: '/medical-records', icon: <MedicalServices /> },
          { label: 'Prescriptions', path: '/prescriptions', icon: <MedicalServices /> },
          { label: 'Symptom Checker', path: '/symptom-checker', icon: <MedicalServices /> },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { label: 'My Appointments', path: '/appointments', icon: <CalendarToday /> },
          { label: 'Patients', path: '/patients', icon: <People /> },
          { label: 'Medical Records', path: '/medical-records', icon: <MedicalServices /> },
          { label: 'Prescriptions', path: '/prescriptions', icon: <MedicalServices /> },
        ];
      case 'admin':
        return [
          ...baseItems,
          { label: 'Users', path: '/users', icon: <People /> },
          { label: 'Appointments', path: '/appointments', icon: <CalendarToday /> },
          { label: 'Medical Records', path: '/medical-records', icon: <MedicalServices /> },
          { label: 'Prescriptions', path: '/prescriptions', icon: <MedicalServices /> },
          { label: 'Admin Panel', path: '/admin', icon: <AdminPanelSettings /> },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Hospital Management System
        </Typography>
        
        {user && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.first_name} {user.last_name} ({user.role})
            </Typography>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

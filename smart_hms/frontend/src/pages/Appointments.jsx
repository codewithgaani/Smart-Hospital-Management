import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Fab,
  Grid,
  Avatar,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday,
  Person,
  MedicalServices,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  Edit,
  Delete,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI, doctorAPI } from '@/services/api';

const Appointments = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    appointment_date: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
    if (user?.role === 'patient') {
      fetchDoctors();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Mock data for demo
      setAppointments([
        {
          id: 1,
          patient_name: 'John Doe',
          doctor_name: 'Dr. Smith',
          appointment_date: '2024-01-15',
          appointment_time: '10:00',
          reason: 'Regular checkup',
          status: 'scheduled',
        },
        {
          id: 2,
          patient_name: 'Jane Smith',
          doctor_name: 'Dr. Johnson',
          appointment_date: '2024-01-16',
          appointment_time: '14:30',
          reason: 'Follow-up consultation',
          status: 'completed',
        },
        {
          id: 3,
          patient_name: 'Mike Wilson',
          doctor_name: 'Dr. Brown',
          appointment_date: '2024-01-17',
          appointment_time: '09:15',
          reason: 'Initial consultation',
          status: 'pending',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Mock data for demo
      setDoctors([
        { id: 1, name: 'Dr. Smith', specialization: 'Cardiology' },
        { id: 2, name: 'Dr. Johnson', specialization: 'Neurology' },
        { id: 3, name: 'Dr. Brown', specialization: 'Dermatology' },
      ]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ doctor: '', appointment_date: '', reason: '' });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await appointmentAPI.createAppointment(formData);
      await fetchAppointments();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'scheduled':
        return <Schedule />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <CalendarToday />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Appointments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your appointments and schedule new ones.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<CalendarToday />}>
            Calendar View
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            Book Appointment
          </Button>
        </Box>
      </Box>

      {/* Appointments Grid */}
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.light', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {appointment.patient_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.doctor_name}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {formatDate(appointment.appointment_date)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {formatTime(appointment.appointment_time)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalServices sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {appointment.reason}
                  </Typography>
                </Box>

                <Chip
                  icon={getStatusIcon(appointment.status)}
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </Box>
                <Button size="small" variant="outlined">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      {/* Appointment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
            Book New Appointment
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                label="Doctor"
                required
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              name="appointment_date"
              label="Appointment Date"
              type="date"
              value={formData.appointment_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              name="reason"
              label="Reason for Visit"
              multiline
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please describe the reason for your appointment..."
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Appointments;
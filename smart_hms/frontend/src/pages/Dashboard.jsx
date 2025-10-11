import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CalendarToday,
  People,
  MedicalServices,
  Assignment,
  TrendingUp,
  TrendingDown,
  Add,
  Refresh,
  Schedule,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Mock data for demo purposes
        setDashboardData({
          total_patients: 1247,
          total_doctors: 45,
          total_appointments: 89,
          today_appointments: 12,
          pending_appointments: 23,
          completed_appointments: 66,
          recent_appointments: [
            {
              id: 1,
              patient_name: 'John Doe',
              doctor_name: 'Dr. Smith',
              date: '2024-01-15',
              time: '10:00 AM',
              status: 'scheduled',
            },
            {
              id: 2,
              patient_name: 'Jane Smith',
              doctor_name: 'Dr. Johnson',
              date: '2024-01-15',
              time: '11:30 AM',
              status: 'completed',
            },
            {
              id: 3,
              patient_name: 'Mike Wilson',
              doctor_name: 'Dr. Brown',
              date: '2024-01-15',
              time: '2:00 PM',
              status: 'pending',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
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
      default:
        return <Assignment />;
    }
  };

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: `${color}.main` }}>
                {value}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography variant="body2" color={trend === 'up' ? 'success.main' : 'error.main'}>
                    {trendValue}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                backgroundColor: `${color}.light`,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Welcome back, {user?.first_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening at your hospital today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => window.location.reload()}>
            <Refresh />
          </IconButton>
          <Button variant="contained" startIcon={<Add />}>
            Quick Action
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={dashboardData?.total_patients || 0}
            icon={<People />}
            color="primary"
            trend="up"
            trendValue="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Doctors"
            value={dashboardData?.total_doctors || 0}
            icon={<MedicalServices />}
            color="secondary"
            trend="up"
            trendValue="5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Appointments"
            value={dashboardData?.today_appointments || 0}
            icon={<CalendarToday />}
            color="info"
            trend="down"
            trendValue="3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Reviews"
            value={dashboardData?.pending_appointments || 0}
            icon={<Assignment />}
            color="warning"
            trend="up"
            trendValue="8"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Appointment Trends
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Chart visualization would go here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Completed Today</Typography>
                  <Chip label={dashboardData?.completed_appointments || 0} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Scheduled</Typography>
                  <Chip label={dashboardData?.total_appointments - dashboardData?.pending_appointments || 0} color="info" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Pending</Typography>
                  <Chip label={dashboardData?.pending_appointments || 0} color="warning" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Appointments
            </Typography>
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData?.recent_appointments?.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {appointment.patient_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {appointment.doctor_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {appointment.date} at {appointment.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Assignment />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
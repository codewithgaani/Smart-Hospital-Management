import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp,
  TrendingDown,
  People,
  CalendarToday,
  MedicalServices,
  Assignment,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo with realistic numbers
    setAnalyticsData({
      totalPatients: 12,
      totalDoctors: 5,
      totalAppointments: 2,
      revenue: 650,
      patientGrowth: 2.5,
      appointmentGrowth: 1.2,
      revenueGrowth: 3.8,
      topSpecializations: [
        { name: 'Cardiology', count: 3, growth: 2 },
        { name: 'Neurology', count: 2, growth: 1 },
        { name: 'Orthopedics', count: 2, growth: 1 },
        { name: 'Pediatrics', count: 2, growth: 1 },
        { name: 'General', count: 3, growth: 2 },
      ],
      monthlyStats: [
        { month: 'Jan', patients: 10, appointments: 1, revenue: 500 },
        { month: 'Feb', patients: 12, appointments: 2, revenue: 650 },
      ],
    });
    setLoading(false);
  }, []);

  const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: `${color}.main` }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
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
          <Avatar sx={{ backgroundColor: `${color}.light`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography variant="h6">Loading analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights and performance metrics.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="Last 30 Days" color="primary" variant="outlined" />
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={analyticsData.totalPatients}
            icon={<People />}
            color="primary"
            trend="up"
            trendValue={analyticsData.patientGrowth}
            subtitle="Active patients"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Doctors"
            value={analyticsData.totalDoctors}
            icon={<MedicalServices />}
            color="secondary"
            trend="up"
            trendValue="5.2"
            subtitle="Active staff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments"
            value={analyticsData.totalAppointments}
            icon={<CalendarToday />}
            color="info"
            trend="up"
            trendValue={analyticsData.appointmentGrowth}
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`$${analyticsData.revenue.toLocaleString()}`}
            icon={<Assessment />}
            color="success"
            trend="up"
            trendValue={analyticsData.revenueGrowth}
            subtitle="Monthly revenue"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Trends
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
                Top Specializations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analyticsData.topSpecializations.map((spec, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {spec.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {spec.count} patients
                      </Typography>
                    </Box>
                    <Chip 
                      label={`+${spec.growth}%`} 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Performance Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Patient Satisfaction</Typography>
                  <Chip label="94%" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Appointment Completion</Typography>
                  <Chip label="87%" color="info" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Average Wait Time</Typography>
                  <Chip label="12 min" color="warning" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Staff Utilization</Typography>
                  <Chip label="78%" color="primary" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'success.light', width: 32, height: 32 }}>
                    <Assignment />
                  </Avatar>
                  <Box>
                    <Typography variant="body2">New patient registered</Typography>
                    <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'info.light', width: 32, height: 32 }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="body2">Appointment completed</Typography>
                    <Typography variant="caption" color="text.secondary">4 hours ago</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'warning.light', width: 32, height: 32 }}>
                    <MedicalServices />
                  </Avatar>
                  <Box>
                    <Typography variant="body2">New doctor added</Typography>
                    <Typography variant="caption" color="text.secondary">1 day ago</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
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
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  MedicalServices,
  Search,
  Person,
  Phone,
  Email,
  CalendarToday,
  Star,
  Edit,
  Delete,
  Add,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const Doctors = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for demo
    setDoctors([
      {
        id: 1,
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@hospital.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        experience: 8,
        license_number: 'DOC000001',
        consultation_fee: 150,
        is_available: true,
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Dr. Michael Johnson',
        email: 'michael.johnson@hospital.com',
        phone: '+1-555-0102',
        specialization: 'Neurology',
        experience: 12,
        license_number: 'DOC000002',
        consultation_fee: 200,
        is_available: true,
        rating: 4.9,
      },
      {
        id: 3,
        name: 'Dr. Emily Brown',
        email: 'emily.brown@hospital.com',
        phone: '+1-555-0103',
        specialization: 'Dermatology',
        experience: 6,
        license_number: 'DOC000003',
        consultation_fee: 120,
        is_available: false,
        rating: 4.7,
      },
    ]);
    setLoading(false);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (isAvailable) => {
    return isAvailable ? 'success' : 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Doctors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage doctor profiles and schedules.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Search />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Doctor
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Doctors
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {doctors.length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'primary.light' }}>
                  <MedicalServices />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Available Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {doctors.filter(d => d.is_available).length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'success.light' }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Specializations
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                    {new Set(doctors.map(d => d.specialization)).size}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'info.light' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg. Experience
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    {Math.round(doctors.reduce((sum, d) => sum + d.experience, 0) / doctors.length)}y
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'warning.light' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Doctors Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Doctor Profiles
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>License</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, backgroundColor: 'primary.light' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {doctor.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doctor.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={doctor.specialization} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {doctor.experience} years
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {doctor.license_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${doctor.consultation_fee}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="body2">
                          {doctor.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.is_available ? 'Available' : 'Unavailable'}
                        color={getAvailabilityColor(doctor.is_available)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
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

export default Doctors;

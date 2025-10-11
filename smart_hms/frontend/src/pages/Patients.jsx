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
  People,
  Search,
  Person,
  Phone,
  Email,
  CalendarToday,
  MedicalServices,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const Patients = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for demo
    setPatients([
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        age: 35,
        blood_type: 'O+',
        last_visit: '2024-01-10',
        status: 'active',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        age: 28,
        blood_type: 'A+',
        last_visit: '2024-01-08',
        status: 'active',
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1-555-0125',
        age: 42,
        blood_type: 'B+',
        last_visit: '2024-01-05',
        status: 'inactive',
      },
    ]);
    setLoading(false);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Patients
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient records and information.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Search />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Patient
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search patients by name or email..."
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
                    Total Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {patients.length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'primary.light' }}>
                  <People />
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
                    Active Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {patients.filter(p => p.status === 'active').length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'success.light' }}>
                  <Person />
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
                    New This Month
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                    12
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'info.light' }}>
                  <CalendarToday />
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
                    Avg. Age
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    {Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: 'warning.light' }}>
                  <MedicalServices />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Patients Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Patient Records
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Blood Type</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, backgroundColor: 'primary.light' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {patient.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {patient.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {patient.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {patient.age} years
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={patient.blood_type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(patient.last_visit).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        color={getStatusColor(patient.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
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

export default Patients;

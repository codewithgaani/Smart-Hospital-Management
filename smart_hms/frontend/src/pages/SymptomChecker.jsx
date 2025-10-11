import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  MedicalServices,
  Psychology,
  TrendingUp,
  Warning,
  CheckCircle,
  AutoFixHigh,
  Science,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { aiAPI } from '@/services/api';

const SymptomChecker = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ['Describe Symptoms', 'AI Analysis', 'Results & Recommendations'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);
    setCurrentStep(1);

    try {
      const response = await aiAPI.analyzeSymptoms(symptoms);
      setResults(response.data);
      setCurrentStep(2);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to analyze symptoms');
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.7) return 'success';
    if (confidence > 0.4) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence > 0.7) return 'High';
    if (confidence > 0.4) return 'Medium';
    return 'Low';
  };

  const resetForm = () => {
    setSymptoms('');
    setResults(null);
    setError('');
    setCurrentStep(0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              backgroundColor: 'primary.light',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
            }}
          >
            <Psychology sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            AI Symptom Checker
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Describe your symptoms and get AI-powered preliminary analysis and recommendations.
            This tool is for informational purposes only and should not replace professional medical advice.
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Describe Your Symptoms
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    variant="outlined"
                    label="Symptoms Description"
                    placeholder="Please describe your symptoms in detail. Include information such as:&#10;- When did the symptoms start?&#10;- How severe are they?&#10;- Any additional symptoms?&#10;- Any triggers or patterns you've noticed?"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    sx={{ mb: 3 }}
                    disabled={loading}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !symptoms.trim()}
                      startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHigh />}
                      sx={{ flexGrow: 1 }}
                    >
                      {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Reset
                    </Button>
                  </Box>
                </form>

                {loading && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      AI is analyzing your symptoms...
                    </Typography>
                    <LinearProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            {results ? (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Analysis Results
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Predicted Condition
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {results.predicted_disease}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Confidence Level
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={results.confidence * 100}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        color={getConfidenceColor(results.confidence)}
                      />
                      <Chip
                        label={`${Math.round(results.confidence * 100)}% ${getConfidenceLabel(results.confidence)}`}
                        color={getConfidenceColor(results.confidence)}
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Recommendations
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {results.recommendations?.map((recommendation, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 16, color: 'primary.main', mt: 0.5 }} />
                          <Typography variant="body2">
                            {recommendation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> This is an AI-powered preliminary analysis. 
                      Please consult with a healthcare professional for proper diagnosis and treatment.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Science sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Enter your symptoms to get AI-powered analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Our AI will analyze your symptoms and provide preliminary insights
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Paper sx={{ p: 3, mt: 4, backgroundColor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            How It Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ backgroundColor: 'primary.light', mx: 'auto', mb: 2 }}>
                  <MedicalServices />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  1. Describe Symptoms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide detailed information about your symptoms, including duration and severity.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ backgroundColor: 'secondary.light', mx: 'auto', mb: 2 }}>
                  <AutoFixHigh />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  2. AI Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI analyzes your symptoms using advanced machine learning algorithms.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ backgroundColor: 'success.light', mx: 'auto', mb: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  3. Get Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive preliminary analysis and recommendations for next steps.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default SymptomChecker;
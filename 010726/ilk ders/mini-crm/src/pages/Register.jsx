import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearAuthError } from '../store/authSlice';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [validationError, setValidationError] = useState('');

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Tüm zorunlu alanlar doldurulmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Şifreler eşleşmiyor.');
      return;
    }

    setValidationError('');
    dispatch(register({ name, email, jobTitle, password }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, hsl(210, 30%, 94%) 0%, hsl(165, 20%, 94%) 100%)',
        py: 4,
        px: 2
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                bgcolor: 'primary.main', 
                color: '#fff', 
                px: 2, 
                py: 1, 
                borderRadius: '12px', 
                fontWeight: 800, 
                fontSize: '1.5rem',
                fontFamily: 'Outfit',
                mb: 1.5
              }}
            >
              M
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', color: 'text.primary' }}>
              Yeni Hesap Oluştur
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'Outfit' }}>
              CRM sistemine kaydolun
            </Typography>
          </Box>

          {/* Validation or Server Errors */}
          {(validationError || error) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {validationError || error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Adınız Soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              type="email"
              label="E-posta Adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@crmapp.com"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Görev / Ünvan"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Satış Yöneticisi"
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              type="password"
              label="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              type="password"
              label="Şifreyi Onaylayın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={status === 'loading'}
              fullWidth
              sx={{ py: 1.25, fontSize: '0.95rem', fontFamily: 'Outfit', textTransform: 'none', mt: 1 }}
            >
              {status === 'loading' ? <CircularProgress size={24} /> : 'Hesap Oluştur'}
            </Button>
          </Box>

          {/* Bottom link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Outfit' }}>
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--color-primary)', 
                  textDecoration: 'none', 
                  fontWeight: 600 
                }}
              >
                Giriş Yapın
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;

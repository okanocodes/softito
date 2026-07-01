import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearAuthError } from '../store/authSlice';
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Clear errors on load
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setValidationError('E-posta ve şifre alanları zorunludur.');
      return;
    }
    setValidationError('');
    dispatch(login({ email, password }));
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
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo / Title Area */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
              Tekrar Hoş Geldiniz!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'Outfit' }}>
              CRM hesabınıza giriş yapın
            </Typography>
          </Box>

          {/* Validation or Server Errors */}
          {(validationError || error) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {validationError || error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
              required
              fullWidth
              type="password"
              label="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {status === 'loading' ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
          </Box>

          {/* Bottom link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Outfit' }}>
              Hesabınız yok mu?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--color-primary)', 
                  textDecoration: 'none', 
                  fontWeight: 600 
                }}
              >
                Kayıt Olun
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

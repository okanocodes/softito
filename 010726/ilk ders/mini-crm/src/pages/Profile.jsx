import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateProfile } from '../store/settingsSlice';
import { Save, User, Mail, Shield, Briefcase, PhoneCall } from 'lucide-react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Avatar, 
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const Profile = () => {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  const { profile, status, error } = useSelector((state) => state.settings);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    avatar: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Set local state when profile is fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        jobTitle: profile.jobTitle || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setValidationError('İsim ve E-posta alanları zorunludur.');
      return;
    }
    setValidationError('');
    setSuccessMsg('');

    dispatch(updateProfile(formData)).then((res) => {
      if (!res.error) {
        setSuccessMsg(t('successProfile'));
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setValidationError(res.payload || t('errorProfile'));
      }
    });
  };

  if (status === 'loading' && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box className="page-container" sx={{ maxWidth: '800px !important', margin: '0 auto' }}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title" sx={{ fontFamily: 'Outfit' }}>{t('profileTitle')}</Typography>
          <Typography className="page-subtitle" sx={{ fontFamily: 'Outfit' }}>{t('profileSubtitle')}</Typography>
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ borderRadius: '8px' }}>{successMsg}</Alert>
      )}

      {validationError && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{validationError}</Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src={formData.avatar}
                alt={formData.name}
                sx={{ width: 100, height: 100, mb: 2, border: '4px solid', borderColor: 'primary.main' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit' }}>
                {formData.name || (language === 'tr' ? 'CRM Kullanıcısı' : 'CRM User')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Outfit' }}>
                {formData.jobTitle || (language === 'tr' ? 'Ünvan Belirtilmedi' : 'No title specified')}
              </Typography>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.85rem', color: 'text.secondary' }}>
                  <Mail size={16} />
                  {formData.email}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.85rem', color: 'text.secondary' }}>
                  <PhoneCall size={16} />
                  {formData.phone || (language === 'tr' ? 'Telefon Belirtilmedi' : 'No phone specified')}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.85rem', color: 'text.secondary' }}>
                  <Shield size={16} />
                  {t('role')}: {user?.role === 'admin' ? t('admin') : t('editor')}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Edit Fields */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, fontFamily: 'Outfit' }}>
                {t('profileCardTitle')}
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label={t('nameLabel')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label={t('email')}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t('phoneLabel')}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t('jobTitleLabel')}
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label={t('avatarUrl')}
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={status === 'loading'}
                    startIcon={status === 'loading' ? <CircularProgress size={16} /> : <Save size={16} />}
                    sx={{ textTransform: 'none', fontFamily: 'Outfit', px: 3 }}
                  >
                    {t('updateProfileBtn')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

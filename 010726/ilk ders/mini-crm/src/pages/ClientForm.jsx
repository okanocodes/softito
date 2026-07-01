import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addClient, updateClient } from '../store/clientsSlice';
import { addRecentActivityPersistent } from '../store/dashboardSlice';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const ClientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { id } = useParams();
  const isEditMode = !!id;

  const { clients, status } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    dealValue: 0,
    notes: '',
  });

  const [validationError, setValidationError] = useState('');

  // Load client details if edit mode
  useEffect(() => {
    if (isEditMode) {
      const client = clients.find((c) => c.id === id);
      if (client) {
        setFormData({
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          email: client.email || '',
          phone: client.phone || '',
          company: client.company || '',
          status: client.status || 'lead',
          dealValue: client.dealValue || 0,
          notes: client.notes || '',
        });
      } else {
        setValidationError('Müşteri kaydı bulunamadı.');
      }
    }
  }, [id, isEditMode, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dealValue' ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      return t('formErrorRequired');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return t('formErrorEmail');
    }
    if (formData.dealValue < 0) {
      return t('formErrorNegative');
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError('');

    if (isEditMode) {
      dispatch(updateClient({ id, data: formData })).then((res) => {
        if (!res.error) {
          const description = language === 'tr'
            ? `${formData.firstName} ${formData.lastName} bilgileri güncellendi.`
            : `${formData.firstName} ${formData.lastName} details were updated.`;

          dispatch(addRecentActivityPersistent({
            type: 'status_change',
            clientId: id,
            description
          }));
          navigate('/clients');
        } else {
          setValidationError(res.payload || 'Güncelleme hatası oluştu.');
        }
      });
    } else {
      const newId = 'c' + (Date.now());
      dispatch(addClient({ id: newId, ...formData })).then((res) => {
        if (!res.error) {
          const description = language === 'tr'
            ? `Yeni müşteri ekleme: ${formData.firstName} ${formData.lastName} (${formData.company}).`
            : `New client added: ${formData.firstName} ${formData.lastName} (${formData.company}).`;

          dispatch(addRecentActivityPersistent({
            type: 'deal',
            clientId: newId,
            description
          }));
          navigate('/clients');
        } else {
          setValidationError(res.payload || 'Ekleme hatası oluştu.');
        }
      });
    }
  };

  return (
    <Box className="page-container" sx={{ maxWidth: '800px !important', margin: '0 auto' }}>
      {/* Page Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Button 
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/clients')}
          color="inherit"
          sx={{ textTransform: 'none', fontFamily: 'Outfit' }}
        >
          {t('back')}
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'Outfit' }}>
          {isEditMode ? t('editClient') : t('addClient')}
        </Typography>
      </Box>

      {validationError && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{validationError}</Alert>
      )}

      {/* Form Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t('firstName')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t('lastName')}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Company */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t('company')}
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Deal Value */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('dealValueLabel')}
                  name="dealValue"
                  value={formData.dealValue}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label={t('email')}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Phone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+90 (5xx) xxx-xxxx"
                  variant="outlined"
                />
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">{t('statusLabel')}</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    label={t('statusLabel')}
                    onChange={handleChange}
                  >
                    <MenuItem value="active">{t('active')}</MenuItem>
                    <MenuItem value="lead">{t('lead')}</MenuItem>
                    <MenuItem value="inactive">{t('inactive')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('notes')}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder={t('notesPlaceholder')}
                />
              </Grid>

              {/* Form Buttons */}
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={() => navigate('/clients')}
                  sx={{ textTransform: 'none', fontFamily: 'Outfit' }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={status === 'loading'}
                  startIcon={status === 'loading' ? <CircularProgress size={16} /> : <Save size={16} />}
                  sx={{ textTransform: 'none', fontFamily: 'Outfit' }}
                >
                  {isEditMode ? t('saveChanges') : t('saveClient')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientForm;

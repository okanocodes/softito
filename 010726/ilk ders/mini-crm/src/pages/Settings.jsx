import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '../store/settingsSlice';
import { toggleMode } from '../store/uiSlice';
import { Save, Bell, Globe, Users, ShieldAlert } from 'lucide-react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  FormControlLabel, 
  Switch, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const Settings = () => {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  const { profile, notifications, preferences, team, status } = useSelector((state) => state.settings);
  const { theme } = useSelector((state) => state.ui);

  const [notificationState, setNotificationState] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true
  });

  const [preferenceState, setPreferenceState] = useState({
    theme: 'light',
    language: 'en',
    currency: 'USD'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Sync state with store settings
  useEffect(() => {
    if (notifications) {
      setNotificationState({
        emailNotifications: notifications.emailNotifications ?? true,
        pushNotifications: notifications.pushNotifications ?? false,
        weeklyReport: notifications.weeklyReport ?? true
      });
    }
    if (preferences) {
      setPreferenceState({
        theme: preferences.theme || 'light',
        language: preferences.language || 'en',
        currency: preferences.currency || 'USD'
      });
    }
  }, [notifications, preferences]);

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferenceState(prev => ({
      ...prev,
      [name]: value
    }));

    // If theme choice changed, update UI state immediately
    if (name === 'theme' && value !== theme) {
      dispatch(toggleMode());
    }
  };

  const handleSaveSettings = () => {
    setSuccessMsg('');
    setErrorMsg('');

    const updatedData = {
      profile, // Keep profile unchanged
      notifications: notificationState,
      preferences: preferenceState,
      team // Keep team unchanged
    };

    dispatch(updateSettings(updatedData)).then((res) => {
      if (!res.error) {
        setSuccessMsg(t('successSettings'));
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(t('errorSettings'));
      }
    });
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'editor': return 'primary';
      default: return 'default';
    }
  };

  if (status === 'loading' && !notifications) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Box className="page-header">
        <Box>
          <Typography className="page-title" sx={{ fontFamily: 'Outfit' }}>{t('settingsTitle')}</Typography>
          <Typography className="page-subtitle" sx={{ fontFamily: 'Outfit' }}>{t('settingsSubtitle')}</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<Save size={18} />}
          onClick={handleSaveSettings}
          sx={{ fontFamily: 'Outfit', textTransform: 'none', py: 1, px: 2 }}
        >
          {t('saveSettingsBtn')}
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ borderRadius: '8px' }}>{successMsg}</Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{errorMsg}</Alert>
      )}

      <Grid container spacing={3}>
        {/* Notifications and Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Notification Card */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit' }}>
                  <Bell size={18} color="var(--color-primary)" />
                  {t('notificationsTitle')}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationState.emailNotifications} 
                        onChange={handleNotificationChange} 
                        name="emailNotifications" 
                        color="primary" 
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontFamily: 'Outfit' }}>{t('emailNotifLabel')}</Typography>}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationState.pushNotifications} 
                        onChange={handleNotificationChange} 
                        name="pushNotifications" 
                        color="primary" 
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontFamily: 'Outfit' }}>{t('pushNotifLabel')}</Typography>}
                  />

                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationState.weeklyReport} 
                        onChange={handleNotificationChange} 
                        name="weeklyReport" 
                        color="primary" 
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontFamily: 'Outfit' }}>{t('weeklyReportLabel')}</Typography>}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit' }}>
                  <Globe size={18} color="var(--color-secondary)" />
                  {t('preferencesTitle')}
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Theme Select */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="theme-select-label">{t('themeLabel')}</InputLabel>
                      <Select
                        labelId="theme-select-label"
                        name="theme"
                        value={preferenceState.theme}
                        label={t('themeLabel')}
                        onChange={handlePreferenceChange}
                      >
                        <MenuItem value="light">{t('themeLight')}</MenuItem>
                        <MenuItem value="dark">{t('themeDark')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Language Select */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="lang-select-label">{t('langLabel')}</InputLabel>
                      <Select
                        labelId="lang-select-label"
                        name="language"
                        value={preferenceState.language}
                        label={t('langLabel')}
                        onChange={handlePreferenceChange}
                      >
                        <MenuItem value="tr">Türkçe (TR)</MenuItem>
                        <MenuItem value="en">English (EN)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Currency Select */}
                  <Grid size={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="currency-select-label">{t('currencyLabel')}</InputLabel>
                      <Select
                        labelId="currency-select-label"
                        name="currency"
                        value={preferenceState.currency}
                        label={t('currencyLabel')}
                        onChange={handlePreferenceChange}
                      >
                        <MenuItem value="USD">Dolar (USD - $)</MenuItem>
                        <MenuItem value="EUR">Euro (EUR - €)</MenuItem>
                        <MenuItem value="TRY">Lira (TRY - ₺)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Team Members List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit' }}>
                <Users size={18} color="var(--color-primary)" />
                {t('teamTitle')} ({team?.length || 0})
              </Typography>
              
              <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, maxHeight: 330, overflowY: 'auto', border: '1px solid', borderColor: 'divider' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('firstName')}</TableCell>
                      <TableCell>{t('memberRole')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {team && team.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="caption" 
                            color={getRoleChipColor(member.role)} 
                            sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                          >
                            {member.role === 'admin' ? t('admin') : member.role === 'editor' ? t('editor') : t('viewer')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;

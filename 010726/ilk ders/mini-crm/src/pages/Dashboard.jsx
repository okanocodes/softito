import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, addTask, completeTask, addRecentActivityPersistent } from '../store/dashboardSlice';
import { fetchClients } from '../store/clientsSlice';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  UserCheck, 
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Alert
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  const { formatCurrency, currency, currencySymbol } = useCurrency();
  const { stats, recentActivity, upcomingTasks, revenueChart, status, error } = useSelector(
    (state) => state.dashboard
  );
  const { clients, status: clientsStatus } = useSelector((state) => state.clients);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    dueDate: '',
    clientId: ''
  });
  const [taskError, setTaskError] = useState('');

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.dueDate) {
      setTaskError(language === 'tr' ? 'Lütfen tüm alanları doldurun.' : 'Please fill all required fields.');
      return;
    }

    dispatch(addTask(taskForm)).then(() => {
      const description = language === 'tr'
        ? `Yeni görev tanımlandı: ${taskForm.title}`
        : `New task created: ${taskForm.title}`;
      
      dispatch(addRecentActivityPersistent({
        type: 'deal',
        description
      }));

      // Reset
      setTaskForm({ title: '', dueDate: '', clientId: '' });
      setTaskError('');
      setTaskModalOpen(false);
    });
  };

  const handleCompleteTask = (taskId) => {
    const task = upcomingTasks.find(t => t.id === taskId);
    dispatch(completeTask(taskId)).then(() => {
      if (task) {
        const description = language === 'tr'
          ? `Görev tamamlandı: ${task.title}`
          : `Task completed: ${task.title}`;
        dispatch(addRecentActivityPersistent({
          type: 'status_change',
          description
        }));
      }
    });
  };

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchClients());
  }, [dispatch]);

  if (status === 'loading' || clientsStatus === 'loading' || !stats || !clients) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: 2 }}>
        <AlertCircle size={48} color="red" />
        <Typography variant="h6" color="error">{error || 'Veriler yüklenirken hata oluştu.'}</Typography>
      </Box>
    );
  }

  // Format relative time/dates for current language
  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatDueDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' });
  };

  const formatShorthand = (val) => {
    const kVal = `${val / 1000}k`;
    return currency === 'EUR' ? `${kVal} ${currencySymbol}` : `${currencySymbol}${kVal}`;
  };

  // SVG Chart Configuration
  const chartHeight = 320;
  const chartWidth = 500;
  const padding = 40;
  
  // Calculate points for the 3 points (Apr: 62000, May: 74500, Jun: 84500)
  // Min value is 50000, max is 90000
  const minVal = 50000;
  const maxVal = 90000;
  const valRange = maxVal - minVal;
  
  const points = revenueChart.map((item, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (revenueChart.length - 1);
    const y = chartHeight - padding - ((item.revenue - minVal) * (chartHeight - padding * 2)) / valRange;
    return { x, y, ...item };
  });

  // Area path logic
  const areaPath = points.length > 0 
    ? `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  // Line path logic
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Calculate real metrics from active clients list
  const realTotalClients = clients.length;
  const realActiveDeals = clients.filter(c => c.status === 'active' || c.status === 'lead').length;
  const realRevenue = clients.reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);

  const statsCards = [
    { 
      title: t('totalClients'), 
      value: realTotalClients, 
      desc: t('totalClientsDesc'), 
      icon: <Users size={24} />, 
      color: 'primary.main',
      growth: stats.growth
    },
    { 
      title: t('activeDeals'), 
      value: realActiveDeals, 
      desc: t('activeDealsDesc'), 
      icon: <TrendingUp size={24} />, 
      color: 'secondary.main',
      growth: null
    },
    { 
      title: t('totalRevenue'), 
      value: formatCurrency(realRevenue), 
      desc: t('totalRevenueDesc'), 
      icon: <DollarSign size={24} />, 
      color: 'success.main',
      growth: 15.4
    }
  ];

  return (
    <Box className="page-container">
      {/* Welcome Header */}
      <Box className="page-header">
        <Box>
          <Typography className="page-title" sx={{ fontFamily: 'Outfit' }}>{t('welcomeTitle')}</Typography>
          <Typography className="page-subtitle" sx={{ fontFamily: 'Outfit' }}>{t('welcomeSubtitle')}</Typography>
        </Box>
      </Box>

      {/* Summary Row */}
      <Grid container spacing={3}>
        {statsCards.map((card, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Card className="glass-card" sx={{ overflow: 'visible', position: 'relative' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontFamily: 'Outfit' }}>
                    {card.title}
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: '8px', 
                      bgcolor: 'action.hover', 
                      color: card.color,
                      display: 'flex'
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
                  {card.value}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {card.growth && (
                    <Chip 
                      label={`+${card.growth}%`} 
                      size="small" 
                      color="success" 
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  )}
                  <Typography variant="caption" color="text.muted" sx={{ fontFamily: 'Outfit' }}>
                    {card.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Middle Row: Graph and side modules */}
      <Grid container spacing={3}>
        {/* Revenue Graph Area */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, fontFamily: 'Outfit' }}>
                {t('revenueChartTitle')}
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--color-border)" strokeDasharray="3 3" />
                  <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--color-border)" strokeDasharray="3 3" />
                  <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--color-border)" />
                  
                  {/* Grid Values */}
                  <text x={padding - 5} y={padding + 5} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{formatShorthand(90000)}</text>
                  <text x={padding - 5} y={chartHeight / 2 + 5} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{formatShorthand(70000)}</text>
                  <text x={padding - 5} y={chartHeight - padding + 5} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{formatShorthand(50000)}</text>
                  
                  {/* Filled Area */}
                  {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
                  
                  {/* Line Chart */}
                  {linePath && <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />}
                  
                  {/* Tooltips and Node Dots */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="6" 
                        fill="var(--color-primary)" 
                        stroke="var(--color-bg-card)" 
                        strokeWidth="2" 
                        style={{ transition: 'r 0.2s', cursor: 'pointer' }}
                        onMouseOver={(e) => e.target.setAttribute('r', '8')}
                        onMouseOut={(e) => e.target.setAttribute('r', '6')}
                      />
                      {/* Interactive labels showing exact values */}
                      <text 
                        x={p.x} 
                        y={p.y - 12} 
                        textAnchor="middle" 
                        fontSize="11" 
                        fontWeight="600" 
                        fill="var(--color-text-primary)"
                        fontFamily="Outfit"
                      >
                        {formatCurrency(p.revenue)}
                      </text>
                      {/* Month names on X axis */}
                      <text 
                        x={p.x} 
                        y={chartHeight - padding + 20} 
                        textAnchor="middle" 
                        fontSize="12" 
                        fontWeight="500"
                        fill="var(--color-text-secondary)"
                        fontFamily="Outfit"
                      >
                        {p.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task lists and activities */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Grid container spacing={3}>
            {/* Upcoming Tasks */}
            <Grid size={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Outfit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={18} color="var(--color-primary)" />
                      {t('upcomingTasks')} ({upcomingTasks.length})
                    </Box>
                    <IconButton size="small" color="primary" onClick={() => setTaskModalOpen(true)}>
                      <Plus size={16} />
                    </IconButton>
                  </Typography>
                  <List sx={{ width: '100%', py: 0 }}>
                    {upcomingTasks.map((task) => (
                      <ListItem 
                        key={task.id} 
                        divider 
                        sx={{ 
                          py: 1.5, 
                          px: 0, 
                          '&:last-child': { borderBottom: 'none' } 
                        }}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="complete" 
                            size="small" 
                            color="success"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle size={18} />
                          </IconButton>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Clock size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={task.title}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontFamily: 'Outfit' }}
                          secondary={`${t('dueDate')}: ${formatDueDate(task.dueDate)}`}
                          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid size={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit' }}>
                    <Activity size={18} color="var(--color-secondary)" />
                    {t('recentActivity')}
                  </Typography>
                  <List sx={{ width: '100%', py: 0 }}>
                    {recentActivity.slice(0, 5).map((activity) => {
                      const getIcon = (type) => {
                        switch (type) {
                          case 'note': return <FileText size={16} color="var(--color-primary)" />;
                          case 'status_change': return <UserCheck size={16} color="var(--color-secondary)" />;
                          default: return <TrendingUp size={16} color="var(--color-success)" />;
                        }
                      };

                      return (
                        <ListItem 
                          key={activity.id} 
                          divider 
                          sx={{ 
                            py: 1.5, 
                            px: 0, 
                            '&:last-child': { borderBottom: 'none' } 
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {getIcon(activity.type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={activity.description}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontFamily: 'Outfit' }}
                            secondary={formatDate(activity.timestamp)}
                            secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={taskModalOpen} onClose={() => setTaskModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>
          {language === 'tr' ? 'Yeni Görev Ekle' : 'Add New Task'}
        </DialogTitle>
        <Box component="form" onSubmit={handleTaskSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {taskError && <Alert severity="error">{taskError}</Alert>}
            
            <TextField
              fullWidth
              required
              label={language === 'tr' ? 'Görev Başlığı' : 'Task Title'}
              value={taskForm.title}
              onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              fullWidth
              required
              type="date"
              label={language === 'tr' ? 'Bitiş Tarihi' : 'Due Date'}
              InputLabelProps={{ shrink: true }}
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
            />
            
            <FormControl fullWidth size="small">
              <InputLabel id="task-client-select-label">
                {language === 'tr' ? 'İlişkili Müşteri' : 'Related Client'}
              </InputLabel>
              <Select
                labelId="task-client-select-label"
                value={taskForm.clientId}
                label={language === 'tr' ? 'İlişkili Müşteri' : 'Related Client'}
                onChange={(e) => setTaskForm(prev => ({ ...prev, clientId: e.target.value }))}
              >
                <MenuItem value="">
                  <em>{language === 'tr' ? 'İlişkilendirme Yok' : 'No relation'}</em>
                </MenuItem>
                {clients.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.company})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setTaskModalOpen(false)} color="inherit">
              {t('cancel')}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {language === 'tr' ? 'Ekle' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dashboard;

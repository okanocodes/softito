import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClients, deleteClient } from '../store/clientsSlice';
import { addRecentActivityPersistent } from '../store/dashboardSlice';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  Tooltip,
  Grid
} from '@mui/material';

const Clients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { clients, status, error } = useSelector((state) => state.clients);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [dealRange, setDealRange] = useState('all');
  
  // For Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Search and Filter clients
  const filteredClients = useMemo(() => {
    let result = clients.filter((client) => {
      const matchesSearch = 
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      const matchesDeal = (() => {
        if (dealRange === 'all') return true;
        if (dealRange === 'high') return client.dealValue >= 1000; // wait, let's make it 10k:
        if (dealRange === 'high') return client.dealValue >= 10000;
        if (dealRange === 'medium') return client.dealValue >= 5000 && client.dealValue < 10000;
        if (dealRange === 'low') return client.dealValue < 5000;
        return true;
      })();
      
      return matchesSearch && matchesStatus && matchesDeal;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'tr'));
    } else if (sortBy === 'name-desc') {
      result = [...result].sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`, 'tr'));
    } else if (sortBy === 'value-desc') {
      result = [...result].sort((a, b) => b.dealValue - a.dealValue);
    } else if (sortBy === 'value-asc') {
      result = [...result].sort((a, b) => a.dealValue - b.dealValue);
    } else if (sortBy === 'date-desc') {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'date-asc') {
      result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    return result;
  }, [clients, searchTerm, statusFilter, sortBy, dealRange]);

  const handleEdit = (id) => {
    navigate(`/clients/edit-client/${id}`);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      dispatch(deleteClient(clientToDelete.id)).then(() => {
        // Log activity in dashboard
        const description = language === 'tr'
          ? `${clientToDelete.firstName} ${clientToDelete.lastName} silindi.`
          : `${clientToDelete.firstName} ${clientToDelete.lastName} was deleted.`;

        dispatch(addRecentActivityPersistent({
          type: 'status_change',
          clientId: clientToDelete.id,
          description
        }));
      });
      setDeleteConfirmOpen(false);
      setClientToDelete(null);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label={t('active')} color="success" size="small" sx={{ fontWeight: 500 }} />;
      case 'lead':
        return <Chip label={t('lead')} color="warning" size="small" sx={{ fontWeight: 500 }} />;
      case 'inactive':
        return <Chip label={t('inactive')} color="error" size="small" sx={{ fontWeight: 500 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (status === 'loading' && clients.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box className="page-container">
      {/* Title & Add Button */}
      <Box className="page-header">
        <Box>
          <Typography className="page-title" sx={{ fontFamily: 'Outfit' }}>{t('clientsTitle')}</Typography>
          <Typography className="page-subtitle" sx={{ fontFamily: 'Outfit' }}>{t('clientsSubtitle')}</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/clients/add-client')}
          sx={{ fontFamily: 'Outfit', textTransform: 'none', py: 1, px: 2 }}
        >
          {t('addNewClient')}
        </Button>
      </Box>

      {/* Filter Toolbar Card */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid size={{ xs: 12, md: 6, lg: 3.5 }}>
            <TextField
              fullWidth
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="var(--color-text-muted)" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">{t('statusFilter')}</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label={t('statusFilter')}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{t('allStatuses')}</MenuItem>
                <MenuItem value="active">{t('active')}</MenuItem>
                <MenuItem value="lead">{t('lead')}</MenuItem>
                <MenuItem value="inactive">{t('inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Deal Value Range Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="deal-range-label">{t('dealValue')}</InputLabel>
              <Select
                labelId="deal-range-label"
                id="deal-range"
                value={dealRange}
                label={t('dealValue')}
                onChange={(e) => setDealRange(e.target.value)}
              >
                <MenuItem value="all">{t('allValues')}</MenuItem>
                <MenuItem value="high">{t('highDeals')}</MenuItem>
                <MenuItem value="medium">{t('mediumDeals')}</MenuItem>
                <MenuItem value="low">{t('lowDeals')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-by-label">{t('sortBy')}</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                label={t('sortBy')}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="none">{t('sortNone')}</MenuItem>
                <MenuItem value="name-asc">{t('sortNameAsc')}</MenuItem>
                <MenuItem value="name-desc">{t('sortNameDesc')}</MenuItem>
                <MenuItem value="value-desc">{t('sortValueDesc')}</MenuItem>
                <MenuItem value="value-asc">{t('sortValueAsc')}</MenuItem>
                <MenuItem value="date-desc">{t('sortDateDesc')}</MenuItem>
                <MenuItem value="date-asc">{t('sortDateAsc')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Table Area */}
      {filteredClients.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
          <Typography variant="h6" color="text.secondary">{t('noClientsFound')}</Typography>
          <Typography variant="body2" color="text.muted">{t('noClientsDesc')}</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('clientCol')}</TableCell>
                <TableCell>{t('companyCol')}</TableCell>
                <TableCell>{t('contactCol')}</TableCell>
                <TableCell>{t('dateCol')}</TableCell>
                <TableCell>{t('dealValue')}</TableCell>
                <TableCell>{t('statusLabel')}</TableCell>
                <TableCell align="right">{t('actionsCol')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        src={client.avatar} 
                        alt={`${client.firstName} ${client.lastName}`}
                        sx={{ width: 38, height: 38 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Outfit' }}>
                          {client.firstName} {client.lastName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Outfit' }}>
                    {client.company}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Mail size={12} />
                        {client.email}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Phone size={12} />
                        {client.phone}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Outfit' }}>
                    {formatDate(client.createdAt)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Outfit' }}>
                    {formatCurrency(client.dealValue)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(client.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Düzenle">
                        <IconButton size="small" onClick={() => handleEdit(client.id)} color="primary">
                          <Edit size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton size="small" onClick={() => handleDeleteClick(client)} color="error">
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>{t('deleteClientTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            <strong>{clientToDelete?.firstName} {clientToDelete?.lastName}</strong> {t('deleteClientConfirm')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">{t('cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">{t('delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients;

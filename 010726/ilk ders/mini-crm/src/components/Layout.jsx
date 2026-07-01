import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  Box, 
  IconButton, 
  Avatar, 
  Typography, 
  Divider, 
  Tooltip,
  Paper
} from '@mui/material';
import { toggleSidebar, toggleMode } from '../store/uiSlice';
import { logout } from '../store/authSlice';
import { fetchSettings } from '../store/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const { theme, sidebarCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const activePath = location.pathname;

  useEffect(() => {
    if (user) {
      dispatch(fetchSettings());
    }
  }, [dispatch, user]);

  const navItems = [
    { text: t('dashboard'), icon: <LayoutDashboard size={20} />, path: '/' },
    { text: t('clients'), icon: <Users size={20} />, path: '/clients' },
    { text: t('profile'), icon: <User size={20} />, path: '/profile' },
    { text: t('settings'), icon: <SettingsIcon size={20} />, path: '/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      
      {/* Sidebar Section */}
      <Paper
        elevation={0}
        sx={{
          width: sidebarCollapsed ? '72px' : '260px',
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
          overflow: 'hidden',
          borderRadius: 0
        }}
      >
        {/* Brand/Logo Area */}
        <Box sx={{ height: '70px', display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between' }}>
          {!sidebarCollapsed && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                fontFamily: 'Outfit',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: '8px' }}>M</Box>
              Mini CRM
            </Typography>
          )}
          {sidebarCollapsed && (
            <Box sx={{ bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: '8px', fontWeight: 700, mx: 'auto' }}>M</Box>
          )}
          
          {!sidebarCollapsed && (
            <IconButton onClick={() => dispatch(toggleSidebar())} size="small">
              <ChevronLeft size={18} />
            </IconButton>
          )}
        </Box>
        
        <Divider />

        {/* Navigation Items */}
        <Box sx={{ flexGrow: 1, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5 }}>
          {navItems.map((item) => {
            const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
            return (
              <Tooltip 
                key={item.text} 
                title={sidebarCollapsed ? item.text : ''} 
                placement="right"
                arrow
              >
                <Box
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: sidebarCollapsed ? 0 : 2,
                    px: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.light' : 'action.hover',
                      color: isActive ? 'primary.main' : 'text.primary',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    color: isActive ? 'primary.main' : 'inherit',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}>
                    {item.icon}
                  </Box>
                  {!sidebarCollapsed && (
                    <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem', fontFamily: 'Outfit' }}>
                      {item.text}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        <Divider />

        {/* User Info & Logout */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {user && !sidebarCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                src={user.avatar} 
                alt={user.name} 
                sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'primary.main' }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, noWrap: true }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ noWrap: true, display: 'block' }}>
                  {user.jobTitle}
                </Typography>
              </Box>
            </Box>
          )}

          {user && sidebarCollapsed && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip title={user.name} placement="right">
                <Avatar 
                  src={user.avatar} 
                  alt={user.name} 
                  sx={{ width: 36, height: 36, border: '2px solid', borderColor: 'primary.main', cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                />
              </Tooltip>
            </Box>
          )}

          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: sidebarCollapsed ? 0 : 2,
              px: 2,
              py: 1.25,
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'error.main',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.dark',
              }
            }}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (
              <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Outfit' }}>
                {t('logout')}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Main Panel Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        {/* Header Navigation Bar */}
        <Box
          sx={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 1100
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {sidebarCollapsed && (
              <IconButton onClick={() => dispatch(toggleSidebar())} edge="start">
                <Menu size={20} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit', color: 'text.primary' }}>
              {navItems.find(item => item.path === activePath || (item.path !== '/' && activePath.startsWith(item.path)))?.text || 'Mini CRM'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle Button */}
            <Tooltip title={theme === 'dark' ? t('themeLight') : t('themeDark')}>
              <IconButton onClick={() => dispatch(toggleMode())} color="inherit">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content View Area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            bgcolor: 'background.default',
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

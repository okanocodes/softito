import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { logout, fetchCurrentUser } from '../store/slices/authSlice';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Sparkles,
  Settings,
  User,
  CreditCard,
  Users,
  Bell,
  Trash2,
  LogOut,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { sidebarOpen, theme } = useAppSelector((state) => state.ui);
  const { user, isAuthenticated, status } = useAppSelector((state) => state.auth);
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user && status === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, user, status, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/dashboard')) {
      navigate('/register');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { name: 'Özet', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Formlarım', path: '/dashboard/forms', icon: FileText },
    { name: 'Yeni Form', path: '/dashboard/forms/new', icon: PlusCircle },
    { name: 'AI Form Sihirbazı', path: '/dashboard/ai', icon: Sparkles },
    { name: 'Şablonlar', path: '/dashboard/templates', icon: FolderOpen },
    { name: 'Takım Yönetimi', path: '/dashboard/team', icon: Users },
    { name: 'Hesabım', path: '/dashboard/account', icon: User },
    { name: 'Abonelik', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Bildirimler', path: '/dashboard/notifications', icon: Bell },
    { name: 'Çöp Kutusu', path: '/dashboard/trash', icon: Trash2 },
  ];

  if (!isAuthenticated) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
          <p className="text-text-secondary font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-text-primary transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`glass-panel border-r border-border-subtle flex flex-col transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-primary">
            <Sparkles className="h-6 w-6 text-brand-secondary animate-pulse" />
            {sidebarOpen && <span className="font-sans font-extrabold tracking-tight">AI Form</span>}
          </Link>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden md:flex rounded-md p-1 hover:bg-neutral-bg-dark/10 dark:hover:bg-neutral-bg-light/10"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = location.pathname === item.path;
            if (!isActive && item.path !== '/dashboard') {
              if (item.path === '/dashboard/forms') {
                isActive = location.pathname.startsWith('/dashboard/forms/') && location.pathname !== '/dashboard/forms/new';
              } else {
                isActive = location.pathname.startsWith(item.path + '/');
              }
            }
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile section at the bottom */}
        <div className="border-t border-border-subtle p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-panel border-b border-border-subtle flex h-16 items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden rounded-md p-1 hover:bg-border-subtle"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight m-0 text-text-primary hidden sm:block">
              {menuItems.find((item) => location.pathname === item.path)?.name || 'Yönetim Paneli'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="rounded-full p-2 hover:bg-border-subtle transition-colors"
              title="Tema Değiştir"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserDropdown(false);
                }}
                className="relative rounded-full p-2 hover:bg-border-subtle transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-brand-secondary"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-bg-surface border border-border-subtle p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
                    <span className="font-semibold text-sm">Son Bildirimler</span>
                    <Link
                      to="/dashboard/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-brand-primary font-medium hover:underline"
                    >
                      Tümünü Gör
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs p-2 rounded-lg hover:bg-bg-base transition-colors">
                      <p className="font-medium text-text-primary">Yeni bir yanıt alındı</p>
                      <p className="text-text-muted">Müşteri Geri Bildirim Formu için yeni bir yanıt gönderildi.</p>
                      <span className="text-[10px] text-text-muted">5 dakika önce</span>
                    </div>
                    <div className="text-xs p-2 rounded-lg hover:bg-bg-base transition-colors">
                      <p className="font-medium text-text-primary">Formunuz yayınlandı</p>
                      <p className="text-text-muted">İş Başvuru Formu başarıyla yayına alındı.</p>
                      <span className="text-[10px] text-text-muted">2 saat önce</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
                  alt="Kullanıcı Avatarı"
                  className="h-8 w-8 rounded-full object-cover border border-brand-primary"
                />
                <span className="hidden md:block text-sm font-semibold">{user?.name || 'Kullanıcı'}</span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-bg-surface border border-border-subtle p-2 shadow-xl z-50">
                  <div className="px-4 py-2 border-b border-border-subtle mb-1">
                    <p className="text-sm font-semibold text-text-primary leading-none mb-1">{user?.name}</p>
                    <p className="text-xs text-text-muted truncate leading-none">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/account"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm hover:bg-bg-base transition-colors"
                  >
                    <User className="h-4 w-4" /> Profil Ayarları
                  </Link>
                  <Link
                    to="/dashboard/billing"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm hover:bg-bg-base transition-colors"
                  >
                    <CreditCard className="h-4 w-4" /> Abonelik & Fatura
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

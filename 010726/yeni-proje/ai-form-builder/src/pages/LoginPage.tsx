import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../store/slices/authSlice';
import { Sparkles, ArrowLeft, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, status } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('alex@crmapp.com'); // Default pre-filled as mock
  const [password, setPassword] = useState('123456');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    dispatch(login({ email }));
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-brand-primary/10 rounded-2xl mb-4 border border-brand-primary/20">
          <Sparkles className="h-8 w-8 text-brand-primary" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Hesabınıza Giriş Yapın</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Veya{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:text-brand-primary-dark hover:underline transition-all">
            ücretsiz yeni hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-bg-surface border border-border-subtle py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 rounded-xl bg-semantic-error-bg border border-semantic-error-base/20 p-4 flex gap-3 text-semantic-error-text text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@adres.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base placeholder-text-muted text-text-primary text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base placeholder-text-muted text-text-primary text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-all">
                  Şifremi Unuttum
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all disabled:opacity-50 disabled:scale-100 active:scale-[0.98]"
              >
                {status === 'loading' ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-surface text-text-muted">Veya şununla devam et</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => dispatch(login({ email: 'alex@crmapp.com' }))}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-border-subtle bg-bg-base text-sm font-semibold hover:bg-border-subtle transition-all text-red-500"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c7.055 0 11.75-4.964 11.75-11.964 0-.8-.087-1.42-.197-1.99H12.24z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                onClick={() => dispatch(login({ email: 'alex@crmapp.com' }))}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-border-subtle bg-bg-base text-sm font-semibold hover:bg-border-subtle transition-all text-text-primary"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCurrentUser } from '../store/slices/authSlice';
import axios from 'axios';
import { User, Mail, Briefcase, Key, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('viewer');
  const [avatar, setAvatar] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setJobTitle(user.jobTitle);
      setRole(user.role);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch('http://localhost:5000/user', {
        name,
        email,
        jobTitle,
      });
      // Refresh current user in redux store
      dispatch(fetchCurrentUser());
      setStatusMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi!' });
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold m-0">Profil Ayarları</h2>
        <p className="text-xs text-text-secondary">Hesap bilgilerinizi ve profil tercihlerinizi buradan güncelleyin.</p>
      </div>

      {statusMessage && (
        <div className={`rounded-xl border p-4 flex gap-3 text-sm animate-fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-semantic-success-bg border-semantic-success-base/20 text-semantic-success-text' 
            : 'bg-semantic-error-bg border-semantic-error-base/20 text-semantic-error-text'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <ShieldAlert className="h-5 w-5 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
        {/* Avatar section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border-subtle pb-6">
          <img
            src={avatar || 'https://i.pravatar.cc/150?img=12'}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover border-2 border-brand-primary shadow-md"
          />
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base m-0">{name}</h4>
            <p className="text-xs text-text-secondary leading-none capitalize">{role} &bull; {jobTitle}</p>
            <span className="text-[10px] text-text-muted">Avatar değiştirme özelliği pasiftir.</span>
          </div>
        </div>

        {/* Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Adınız Soyadınız</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">E-posta Adresi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Görev Unvanı</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Kullanıcı Rolü</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Key className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  disabled
                  value={role}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-base/50 text-sm focus:outline-none text-text-muted capitalize"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-brand-primary px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
            >
              Bilgileri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

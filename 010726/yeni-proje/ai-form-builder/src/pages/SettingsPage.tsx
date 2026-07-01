import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchForm, updateForm } from '../store/slices/formsSlice';
import { ArrowLeft, Save, Globe, Lock, CheckCircle, Paintbrush } from 'lucide-react';

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentForm, status } = useAppSelector((state) => state.forms);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('light');
  const [submitMessage, setSubmitMessage] = useState('');
  const [passwordProtection, setPasswordProtection] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchForm(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentForm) {
      setTitle(currentForm.title);
      setDescription(currentForm.description);
      setTheme(currentForm.theme || 'light');
      setSubmitMessage(currentForm.submitMessage || 'Yanıtınız kaydedildi, teşekkür ederiz!');
      setPasswordProtection(currentForm.passwordProtection || '');
      setCustomDomain(currentForm.customDomain || '');
    }
  }, [currentForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const resultAction = await dispatch(
      updateForm({
        id,
        data: {
          title,
          description,
          theme,
          submitMessage,
          passwordProtection,
          customDomain,
        },
      })
    );

    if (updateForm.fulfilled.match(resultAction)) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  if (status === 'loading' && !currentForm) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/forms" className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold m-0">Form Ayarları</h2>
            <p className="text-xs text-text-secondary">"{title}" formunun genel ayarlarını düzenleyin.</p>
          </div>
        </div>
        
        {/* Editor link */}
        <Link
          to={`/dashboard/forms/${id}/editor`}
          className="rounded-xl border border-brand-primary text-brand-primary px-4 py-2.5 text-xs font-bold hover:bg-brand-primary/5 transition-all"
        >
          Soruları Düzenle
        </Link>
      </div>

      {isSaved && (
        <div className="rounded-xl bg-semantic-success-bg border border-semantic-success-base/20 p-4 flex gap-3 text-semantic-success-text text-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Form ayarları başarıyla kaydedildi!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General section */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Genel Bilgiler</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Form Başlığı</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Form Açıklaması</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base p-4 text-sm focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Theme and appearance */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3 flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-brand-primary" /> Görünüm & Tema
          </h3>
          
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2">Tema Seçimi</label>
            <div className="grid grid-cols-3 gap-4">
              {['light', 'dark', 'glass'].map((themeName) => (
                <div
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    theme === themeName
                      ? 'border-brand-primary bg-brand-primary/5 font-bold text-brand-primary shadow-sm'
                      : 'border-border-subtle hover:bg-bg-base text-text-secondary'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold">{themeName === 'light' ? 'Açık' : themeName === 'dark' ? 'Koyu' : 'Glass'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Gönderim Sonrası</h3>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2">Teşekkür Mesajı</label>
            <textarea
              rows={2}
              required
              value={submitMessage}
              onChange={(e) => setSubmitMessage(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-bg-base p-4 text-sm focus:outline-none focus:border-brand-primary transition-all resize-none"
            />
          </div>
        </div>

        {/* Privacy & Domain */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Gizlilik & Alan Adı</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-text-muted" /> Şifre Koruması
              </label>
              <input
                type="password"
                placeholder="Formu şifrelemek istemiyorsanız boş bırakın"
                value={passwordProtection}
                onChange={(e) => setPasswordProtection(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-text-muted" /> Özel Alan Adı (CName)
              </label>
              <input
                type="text"
                placeholder="Örn: form.sirketiniz.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
          >
            <Save className="h-5 w-5" /> Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

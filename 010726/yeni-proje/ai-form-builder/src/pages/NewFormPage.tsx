import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { createForm } from '../store/slices/formsSlice';
import { PlusCircle, Sparkles, FolderOpen, ArrowRight, FileSignature } from 'lucide-react';

export default function NewFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formTitle, setFormTitle] = useState('');

  const handleCreateBlank = async () => {
    const resultAction = await dispatch(
      createForm({
        title: formTitle.trim() || 'Başlıksız Form',
        description: 'Lütfen form açıklamasını girin.',
        status: 'draft',
        shareId: Math.random().toString(36).substr(2, 9),
        theme: 'light',
        submitMessage: 'Yanıtınız kaydedildi, teşekkür ederiz!',
      })
    );
    if (createForm.fulfilled.match(resultAction)) {
      navigate(`/dashboard/forms/${resultAction.payload.id}/editor`);
    }
  };

  const options = [
    {
      title: 'Boş Form',
      description: 'Sıfırdan başlayarak sürükle-bırak editörümüz ile formunuzu kendiniz tasarlayın.',
      icon: PlusCircle,
      action: handleCreateBlank,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'AI ile Üret',
      description: 'İhtiyacınızı yazın, yapay zeka formunuzu saniyeler içinde otomatik olarak kursun.',
      icon: Sparkles,
      action: () => navigate('/dashboard/ai', { state: { initialTitle: formTitle } }),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      tag: 'Önerilen'
    },
    {
      title: 'Şablondan Başla',
      description: 'Müşteri memnuniyeti, iş başvurusu veya kayıt gibi popüler hazır şablonlardan birini seçin.',
      icon: FolderOpen,
      action: () => navigate('/dashboard/templates', { state: { initialTitle: formTitle } }),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold m-0">Yeni Bir Form Başlatın</h2>
        <p className="text-sm text-text-secondary">Tercih ettiğiniz başlangıç yöntemini seçerek hemen tasarlamaya başlayın.</p>
      </div>

      {/* Form Title Input */}
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl max-w-md mx-auto w-full space-y-3 shadow-sm">
        <label className="block text-xs font-bold text-text-secondary flex items-center gap-1.5">
          <FileSignature className="h-4 w-4 text-brand-primary" /> Form Başlığı (İsteğe Bağlı)
        </label>
        <input
          type="text"
          placeholder="Boş form veya şablonlar için başlık girin..."
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.title}
              onClick={opt.action}
              className="bg-bg-surface border border-border-subtle p-6 rounded-3xl cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between group relative"
            >
              {opt.tag && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-secondary px-3 py-0.5 text-[10px] font-bold text-white uppercase">
                  {opt.tag}
                </span>
              )}
              
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border w-fit ${opt.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${opt.color}`} />
                </div>
                <h3 className="font-bold text-lg m-0 group-hover:text-brand-primary transition-colors">{opt.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{opt.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between text-xs font-bold text-brand-primary">
                <span>Başla</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

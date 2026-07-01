import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { createForm } from '../store/slices/formsSlice';
import { addQuestion } from '../store/slices/questionsSlice';
import { Sparkles, ArrowLeft, BookOpen, Star, UserPlus, Heart } from 'lucide-react';

interface TemplateQuestion {
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'rating';
  required: boolean;
  options?: string[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  questions: TemplateQuestion[];
}

export default function TemplatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const initialTitle = location.state?.initialTitle || '';

  const templates: Template[] = [
    {
      id: 'temp-feedback',
      title: 'Müşteri Geri Bildirim Formu',
      description: 'Müşterilerinizin ürünleriniz ve hizmetleriniz hakkındaki memnuniyetini ölçün.',
      category: 'Müşteri İlişkileri',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      questions: [
        { label: 'Adınız Soyadınız', type: 'text', required: true },
        { label: 'E-posta Adresiniz', type: 'email', required: true },
        { label: 'Hizmet kalitemizi 1-5 arasında puanlayın', type: 'rating', required: true },
        { label: 'Görüş ve Önerileriniz', type: 'textarea', required: false }
      ]
    },
    {
      id: 'temp-job',
      title: 'Ayrıntılı İş Başvuru Şablonu',
      description: 'Açık pozisyonlarınız için adaylardan nitelik ve deneyim detaylarını toplayın.',
      category: 'İnsan Kaynakları',
      icon: UserPlus,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      questions: [
        { label: 'Aday Adı Soyadı', type: 'text', required: true },
        { label: 'E-posta', type: 'email', required: true },
        { label: 'Telefon No', type: 'text', required: true },
        { label: 'Başvurulan Departman', type: 'select', options: ['Mühendislik', 'Pazarlama', 'Satış', 'İK'], required: true },
        { label: 'Deneyim Süresi (Yıl)', type: 'number', required: false },
        { label: 'Neden bizimle çalışmak istiyorsunuz?', type: 'textarea', required: false }
      ]
    },
    {
      id: 'temp-event',
      title: 'Etkinlik LCV ve Kayıt Formu',
      description: 'Etkinliğinize katılacak konuk listesini, yemek tercihlerini ve LCV durumlarını yönetin.',
      category: 'Etkinlikler',
      icon: Star,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      questions: [
        { label: 'Katılımcı Adı Soyadı', type: 'text', required: true },
        { label: 'Katılımcı E-posta', type: 'email', required: true },
        { label: 'Bilet Türü', type: 'select', options: ['Genel Katılım', 'VIP', 'Basın'], required: true },
        { label: 'Yemek Tercihiniz', type: 'radio', options: ['Standart Menü', 'Vejetaryen', 'Vegan'], required: false }
      ]
    }
  ];

  const handleUseTemplate = async (template: Template) => {
    // 1. Create form
    const formAction = await dispatch(
      createForm({
        title: initialTitle.trim() || template.title,
        description: template.description,
        status: 'draft',
        shareId: Math.random().toString(36).substr(2, 9),
        theme: 'light',
        submitMessage: 'Yanıtınız başarıyla kaydedildi, katılımınız için teşekkür ederiz!',
      })
    );

    if (createForm.fulfilled.match(formAction)) {
      const formId = formAction.payload.id;

      // 2. Add template questions to JSON Server
      for (const question of template.questions) {
        await dispatch(
          addQuestion({
            formId,
            type: question.type,
            label: question.label,
            required: question.required,
            options: question.options || [],
          })
        );
      }

      // 3. Navigate to editor
      navigate(`/dashboard/forms/${formId}/editor`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/forms/new')} className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold m-0">Hazır Form Şablonları</h2>
          <p className="text-xs text-text-secondary">İşinizi kolaylaştıracak önceden tasarlanmış hazır form yapıları.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((temp) => {
          const Icon = temp.icon;
          return (
            <div 
              key={temp.id}
              className="bg-bg-surface border border-border-subtle p-6 rounded-3xl hover:shadow-lg transition-all flex flex-col justify-between hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full uppercase">
                  {temp.category}
                </span>
                
                <div className={`p-3.5 rounded-2xl border w-fit ${temp.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                
                <h3 className="font-bold text-base m-0 leading-snug">{temp.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{temp.description}</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {temp.questions.length} Standart Soru
                </div>
                <button
                  onClick={() => handleUseTemplate(temp)}
                  className="w-full text-center rounded-xl bg-brand-primary py-3 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
                >
                  Şablonu Kullan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

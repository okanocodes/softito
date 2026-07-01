import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Share2, Sparkles, AlertCircle } from 'lucide-react';

interface FormModel {
  title: string;
  submitMessage: string;
}

export default function FormSuccessPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [form, setForm] = useState<FormModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) return;
    axios.get<FormModel[]>(`http://localhost:5000/forms?shareId=${shareId}`)
      .then((res) => {
        if (res.data.length > 0) {
          setForm(res.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-md w-full bg-bg-surface border border-border-subtle p-8 rounded-3xl space-y-6 shadow-xl animate-fade-in">
        {/* Animated Check icon */}
        <div className="h-16 w-16 bg-semantic-success-bg border border-semantic-success-base/20 rounded-full text-semantic-success-base flex items-center justify-center mx-auto text-3xl font-extrabold animate-bounce">
          ✓
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold m-0">Gönderim Başarılı</h2>
          <p className="text-sm font-bold text-brand-primary">{form?.title || 'Form'}</p>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed px-4">
          {form?.submitMessage || 'Yanıtınız başarıyla kaydedildi, teşekkür ederiz!'}
        </p>

        <div className="border-t border-border-subtle pt-6 flex flex-col gap-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
          >
            <Sparkles className="h-4.5 w-4.5" /> Kendi Formunu AI ile Yarat
          </Link>
          <a
            href="https://google.com"
            className="w-full text-center rounded-xl border border-border-subtle bg-bg-base py-3 text-xs font-semibold hover:bg-border-subtle transition-all"
          >
            Ayrıl
          </a>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { generateForm } from '../store/slices/aiSlice';
import { createForm } from '../store/slices/formsSlice';
import { addQuestion } from '../store/slices/questionsSlice';
import { Sparkles, ArrowLeft, Send, CheckCircle, HelpCircle, Eye } from 'lucide-react';

export default function AiPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { prompt, generatedQuestions, generatedTitle, generatedDescription, loading, error } = useAppSelector((state) => state.ai);
  
  const [inputText, setInputText] = useState(prompt || '');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  React.useEffect(() => {
    if (generatedTitle) {
      setCustomTitle(generatedTitle);
    }
  }, [generatedTitle]);

  React.useEffect(() => {
    if (generatedDescription) {
      setCustomDescription(generatedDescription);
    }
  }, [generatedDescription]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    dispatch(generateForm(inputText));
  };

  const handleSaveForm = async () => {
    if (generatedQuestions.length === 0) return;
    
    // 1. Create the form
    const formAction = await dispatch(
      createForm({
        title: customTitle.trim() || generatedTitle || 'AI Oluşturulmuş Form',
        description: customDescription.trim() || generatedDescription || 'AI tarafından otomatik oluşturulmuştur.',
        status: 'draft',
        shareId: Math.random().toString(36).substr(2, 9),
        theme: 'light',
        submitMessage: 'Yanıtınız başarıyla kaydedildi!',
      })
    );

    if (createForm.fulfilled.match(formAction)) {
      const formId = formAction.payload.id;

      // 2. Add each question to JSON Server
      for (const question of generatedQuestions) {
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

  const suggestedPrompts = [
    'Kurs kayıt formu oluştur.',
    'İş başvuru formu oluştur.',
    'Müşteri memnuniyet anketi.',
    'Etkinlik LCV formu.'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/forms/new')} className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold m-0">AI Form Sihirbazı</h2>
          <p className="text-xs text-text-secondary">Yapay zeka ile dilediğiniz yapıda formu anında tasarlayın.</p>
        </div>
      </div>

      {/* Prompter area */}
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <label className="block text-sm font-bold text-text-primary">
            Nasıl bir form oluşturmak istersiniz?
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Örn: 5 soruluk, müşteri memnuniyetini ölçen ve derecelendirme (rating) sorusu içeren bir restoran geri bildirim formu oluştur..."
              className="w-full rounded-2xl border border-border-subtle bg-bg-base p-4 text-sm focus:outline-none focus:border-brand-primary placeholder-text-muted transition-all resize-none"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="absolute right-4 bottom-4 inline-flex items-center justify-center p-3 rounded-xl bg-brand-primary text-white hover:bg-brand-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>

        {/* Suggestion badges */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase">Hızlı Örnekler</span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setInputText(p);
                  dispatch(generateForm(p));
                }}
                className="rounded-full border border-border-subtle bg-bg-base px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-semantic-error-bg text-semantic-error-text border border-semantic-error-base/20 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* AI loading animation state */}
      {loading && (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-3xl space-y-6">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-brand-secondary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg m-0">AI Düşünüyor...</h3>
            <p className="text-xs text-text-secondary">Talimatlarınız doğrultusunda form şeması hazırlanıyor. Lütfen bekleyin.</p>
          </div>
        </div>
      )}

      {/* Generated Form Preview Area */}
      {!loading && generatedQuestions.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-6">
            <div className="space-y-3 w-full sm:max-w-xl">
              <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-full uppercase mb-2 inline-block">Yapay Zeka Taslağı</span>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-lg font-extrabold bg-bg-base border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-primary text-text-primary shadow-sm"
                  placeholder="Form Başlığı girin..."
                />
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={2}
                  className="w-full text-xs text-text-secondary bg-bg-base border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-primary text-text-secondary resize-none shadow-sm"
                  placeholder="Form açıklaması girin..."
                />
              </div>
            </div>
            <button
              onClick={handleSaveForm}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98] shrink-0"
            >
              <CheckCircle className="h-5 w-5" /> Formu Kaydet ve Düzenle
            </button>
          </div>

          {/* Form Questions list */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase">Üretilen Sorular ({generatedQuestions.length})</h4>
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="bg-bg-base border border-border-subtle p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-brand-primary">Soru {idx + 1}</span>
                    <h5 className="font-bold text-sm m-0">{q.label}</h5>
                    {q.required && <span className="text-red-500 font-bold text-xs">*</span>}
                  </div>
                  <span className="text-[10px] font-extrabold bg-bg-surface border border-border-subtle px-2 py-0.5 rounded uppercase text-text-secondary">{q.type}</span>
                </div>
                
                {/* Options display if applicable */}
                {q.options && q.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {q.options.map((opt) => (
                      <span key={opt} className="text-xs px-2.5 py-1 rounded-lg bg-bg-surface border border-border-subtle">{opt}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

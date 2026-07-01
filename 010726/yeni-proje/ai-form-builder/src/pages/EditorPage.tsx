import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Settings, 
  Sparkles,
  ChevronRight,
  GripVertical,
  Star
} from 'lucide-react';

interface FormModel {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface QuestionModel {
  id: string;
  formId: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'rating';
  label: string;
  required: boolean;
  options?: string[];
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormModel | null>(null);
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // AI Panel State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Selected question shortcut helper
  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || null;

  useEffect(() => {
    if (!id) return;
    
    const fetchFormDetails = axios.get<FormModel>(`http://localhost:5000/forms/${id}`);
    const fetchFormQuestions = axios.get<QuestionModel[]>(`http://localhost:5000/questions?formId=${id}`);

    Promise.all([fetchFormDetails, fetchFormQuestions])
      .then(([formRes, questionsRes]) => {
        setForm(formRes.data);
        setQuestions(questionsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddQuestionType = (type: QuestionModel['type']) => {
    if (!id) return;
    const newQuestion: QuestionModel = {
      id: Math.random().toString(36).substr(2, 9),
      formId: id,
      type,
      label: `Yeni ${type === 'text' ? 'Metin' : type === 'email' ? 'E-posta' : type === 'number' ? 'Sayı' : type === 'textarea' ? 'Paragraf' : type === 'select' ? 'Açılır Liste' : type === 'radio' ? 'Tekli Seçim' : type === 'checkbox' ? 'Çoklu Seçim' : type === 'date' ? 'Tarih' : 'Derecelendirme'} Alanı`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Seçenek 1', 'Seçenek 2'] : []
    };

    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
    setIsDirty(true);
  };

  const handleUpdateQuestion = (questionId: string, updatedFields: Partial<QuestionModel>) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, ...updatedFields } : q));
    setIsDirty(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
    setIsDirty(true);
  };

  // Add Option helper
  const handleAddOption = (questionId: string) => {
    const q = questions.find(item => item.id === questionId);
    if (!q) return;
    const currentOptions = q.options || [];
    const nextOptions = [...currentOptions, `Seçenek ${currentOptions.length + 1}`];
    handleUpdateQuestion(questionId, { options: nextOptions });
  };

  // Remove Option helper
  const handleRemoveOption = (questionId: string, optIndex: number) => {
    const q = questions.find(item => item.id === questionId);
    if (!q) return;
    const currentOptions = q.options || [];
    const nextOptions = currentOptions.filter((_, idx) => idx !== optIndex);
    handleUpdateQuestion(questionId, { options: nextOptions });
  };

  // Update Option text helper
  const handleUpdateOptionText = (questionId: string, optIndex: number, text: string) => {
    const q = questions.find(item => item.id === questionId);
    if (!q) return;
    const currentOptions = q.options || [];
    const nextOptions = currentOptions.map((opt, idx) => idx === optIndex ? text : opt);
    handleUpdateQuestion(questionId, { options: nextOptions });
  };

  // Interactive AI Assistant Panel simulation
  const handleAiAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || !id) return;

    setAiLoading(true);

    setTimeout(() => {
      const query = aiPrompt.toLowerCase();
      let updatedQuestions = [...questions];
      
      // Simple NLP rule parsing
      if (query.includes('tarih') || query.includes('date')) {
        updatedQuestions.push({
          id: Math.random().toString(36).substr(2, 9),
          formId: id,
          type: 'date',
          label: 'Tarih Seçiniz',
          required: false
        });
      } else if (query.includes('derece') || query.includes('puan') || query.includes('rating')) {
        updatedQuestions.push({
          id: Math.random().toString(36).substr(2, 9),
          formId: id,
          type: 'rating',
          label: 'Memnuniyet Puanı',
          required: true
        });
      } else if (query.includes('telefon') || query.includes('phone')) {
        updatedQuestions.push({
          id: Math.random().toString(36).substr(2, 9),
          formId: id,
          type: 'text',
          label: 'Telefon Numarası',
          required: true
        });
      } else if (query.includes('zorunlu yap') || query.includes('make required')) {
        updatedQuestions = updatedQuestions.map(q => ({ ...q, required: true }));
      } else if ((query.includes('seçenek') || query.includes('options')) && selectedQuestionId) {
        // Extract words like 'a, b, c'
        const match = aiPrompt.match(/(?:seçenekleri|options)\s+([\w\s,ğüşiöçĞÜŞİÖÇ]+)/i);
        if (match) {
          const opts = match[1].split(',').map(s => s.trim());
          updatedQuestions = updatedQuestions.map(q => q.id === selectedQuestionId ? { ...q, options: opts } : q);
        }
      } else {
        // General text field creation
        updatedQuestions.push({
          id: Math.random().toString(36).substr(2, 9),
          formId: id,
          type: 'text',
          label: aiPrompt.charAt(0).toUpperCase() + aiPrompt.slice(1),
          required: false
        });
      }

      setQuestions(updatedQuestions);
      setIsDirty(true);
      setAiPrompt('');
      setAiLoading(false);
    }, 1000);
  };

  const handleSave = async () => {
    if (!id || !form) return;
    setIsSaving(true);

    try {
      // 1. Fetch current database questions to delete them
      const dbRes = await axios.get<QuestionModel[]>(`http://localhost:5000/questions?formId=${id}`);
      
      // 2. Delete all existing questions for this form in db.json
      for (const dbQ of dbRes.data) {
        await axios.delete(`http://localhost:5000/questions/${dbQ.id}`);
      }

      // 3. Post all current editor questions to db.json
      for (const q of questions) {
        await axios.post('http://localhost:5000/questions', {
          id: q.id,
          formId: id,
          type: q.type,
          label: q.label,
          required: q.required,
          options: q.options || [],
        });
      }

      setIsSaving(false);
      setIsDirty(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Form kaydedilirken veritabanı hatası oluştu.');
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  const paletteItems: { type: QuestionModel['type']; label: string }[] = [
    { type: 'text', label: 'Metin Alanı' },
    { type: 'email', label: 'E-posta' },
    { type: 'number', label: 'Sayı' },
    { type: 'textarea', label: 'Uzun Metin' },
    { type: 'select', label: 'Açılır Liste' },
    { type: 'radio', label: 'Tekli Seçim' },
    { type: 'checkbox', label: 'Çoklu Seçim' },
    { type: 'date', label: 'Tarih Seçici' },
    { type: 'rating', label: 'Değerlendirme' }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/forms" className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold m-0">{form?.title}</h2>
            <p className="text-xs text-text-secondary">Sürükle-bırak veya tıklayarak form tasarımınızı tamamlayın.</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Preview toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 text-xs font-bold hover:bg-bg-base transition-all active:scale-[0.98]"
          >
            {isPreviewMode ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            <span>{isPreviewMode ? 'Tasarım Modu' : 'Canlı Önizleme'}</span>
          </button>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSaving || (!isDirty && questions.length > 0)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="rounded-xl bg-semantic-success-bg border border-semantic-success-base/20 p-4 flex gap-3 text-semantic-success-text text-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Form ve sorularınız başarıyla kaydedildi!</span>
        </div>
      )}

      {/* Editor Main Section */}
      {isPreviewMode ? (
        /* Live Preview Simulation */
        <div className="bg-bg-surface border border-border-subtle p-8 rounded-3xl max-w-2xl mx-auto w-full space-y-6 shadow-md">
          <div className="border-b border-border-subtle pb-4">
            <h3 className="text-xl font-extrabold m-0 text-text-primary">{form?.title}</h3>
            <p className="text-xs text-text-secondary mt-1">{form?.description}</p>
          </div>
          
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-bold text-text-primary">{q.label}</label>
                  {q.required && <span className="text-red-500 font-bold text-xs">*</span>}
                </div>
                
                {q.type === 'text' && <input type="text" className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs text-text-primary" />}
                {q.type === 'email' && <input type="email" className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs text-text-primary" />}
                {q.type === 'number' && <input type="number" className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs text-text-primary" />}
                {q.type === 'textarea' && <textarea rows={3} className="w-full rounded-xl border border-border-subtle bg-bg-base p-4 text-xs text-text-primary resize-none" />}
                {q.type === 'date' && <input type="date" className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs text-text-primary" />}
                
                {q.type === 'select' && (
                  <select className="w-full rounded-xl border border-border-subtle bg-bg-base p-3 text-xs text-text-secondary">
                    <option value="">Seçim yapın...</option>
                    {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}

                {q.type === 'radio' && (
                  <div className="space-y-1.5">
                    {q.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-3 text-xs text-text-secondary">
                        <input type="radio" name={`preview-radio-${q.id}`} className="h-4 w-4 text-brand-primary" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && (
                  <div className="space-y-1.5">
                    {q.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-3 text-xs text-text-secondary">
                        <input type="checkbox" className="h-4 w-4 text-brand-primary rounded" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'rating' && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-text-muted hover:text-amber-400" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Designer layout */
        <div className="flex-1 grid lg:grid-cols-4 gap-8 overflow-hidden items-stretch">
          {/* Tool Palette */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 flex flex-col space-y-4">
            <h3 className="font-bold text-xs text-text-muted uppercase tracking-wider">Bileşen Paleti</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 overflow-y-auto">
              {paletteItems.map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleAddQuestionType(item.type)}
                  className="flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-base/50 px-3 py-3 text-xs font-bold text-text-secondary hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-left"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Central canvas */}
          <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto max-h-[70vh] pr-2">
            {/* Canvas Info */}
            {questions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-3xl p-12 text-center text-text-muted bg-bg-surface/20 min-h-[300px]">
                <Plus className="h-8 w-8 mb-2" />
                <p className="text-xs font-semibold">Tasarım alanı boş</p>
                <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed mt-1">
                  Soldaki paletten bir bileşene tıklayarak formunuza sorular ekleyin veya AI asistanından yardım isteyin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const isSelected = selectedQuestionId === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`bg-bg-surface border p-5 rounded-2xl flex items-start gap-4 cursor-pointer hover:shadow-sm transition-all ${
                        isSelected ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-border-subtle'
                      }`}
                    >
                      <GripVertical className="h-5 w-5 text-text-muted mt-0.5 cursor-grab shrink-0" />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold text-brand-primary uppercase">Soru {idx + 1}</span>
                            <span className="text-[10px] font-extrabold bg-bg-base px-2 py-0.5 rounded uppercase text-text-secondary">{q.type}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                            className="rounded p-1 hover:bg-bg-base text-red-500 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-text-primary">{q.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Properties & AI Sidebar Panel */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
            {/* AI Assistant panel */}
            <div className="bg-bg-surface border border-border-subtle p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-xs text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-4.5 w-4.5 text-brand-secondary animate-pulse" /> AI Form Asistanı
              </h3>
              
              <form onSubmit={handleAiAssistantSubmit} className="space-y-3">
                <textarea
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Örn: 'tarih sorusu ekle' veya 'seçilen soruya seçenekler ekle: Evet, Hayır'"
                  className="w-full rounded-xl border border-border-subtle bg-bg-base p-3 text-xs focus:outline-none focus:border-brand-primary placeholder-text-muted resize-none transition-all"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-xs font-bold text-white hover:bg-brand-primary-dark transition-all disabled:opacity-50"
                >
                  {aiLoading ? 'Düzenleniyor...' : 'AI Uygula'}
                </button>
              </form>
            </div>

            {/* Selected Element Properties */}
            <div className="bg-bg-surface border border-border-subtle p-5 rounded-3xl flex-1 flex flex-col">
              <h3 className="font-bold text-xs text-text-muted uppercase tracking-wider border-b border-border-subtle pb-3">Özellikler</h3>
              
              {selectedQuestion ? (
                <div className="space-y-4 flex-1 mt-4">
                  {/* Label */}
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary mb-1.5">Soru Metni (Label)</label>
                    <input
                      type="text"
                      value={selectedQuestion.label}
                      onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { label: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-bg-base px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-text-primary"
                    />
                  </div>

                  {/* Required check */}
                  <label className="flex items-center gap-2.5 text-xs text-text-secondary font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedQuestion.required}
                      onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { required: e.target.checked })}
                      className="h-4 w-4 text-brand-primary border-border-subtle rounded focus:ring-brand-primary"
                    />
                    <span>Zorunlu Alan</span>
                  </label>

                  {/* Options edit if applicable */}
                  {['select', 'radio', 'checkbox'].includes(selectedQuestion.type) && (
                    <div className="space-y-3 border-t border-border-subtle pt-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-bold text-text-secondary">Seçenekler</label>
                        <button
                          onClick={() => handleAddOption(selectedQuestion.id)}
                          className="text-[10px] font-extrabold text-brand-primary hover:underline"
                        >
                          Seçenek Ekle
                        </button>
                      </div>

                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {selectedQuestion.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateOptionText(selectedQuestion.id, oIdx, e.target.value)}
                              className="flex-1 rounded-lg border border-border-subtle bg-bg-base px-2 py-1.5 text-[11px] focus:outline-none text-text-primary"
                            />
                            <button
                              onClick={() => handleRemoveOption(selectedQuestion.id, oIdx)}
                              className="text-red-500 hover:text-red-700 rounded p-1 hover:bg-bg-base"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-text-muted text-[11px] font-medium py-8">
                  Düzenlemek istediğiniz soruyu seçin.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

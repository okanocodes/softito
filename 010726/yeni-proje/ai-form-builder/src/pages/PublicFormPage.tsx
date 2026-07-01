import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, AlertCircle, CheckCircle, ShieldAlert, Star } from 'lucide-react';

interface FormModel {
  id: string;
  title: string;
  description: string;
  status: string;
  theme: string;
  submitMessage: string;
  passwordProtection?: string;
  shareId: string;
}

interface QuestionModel {
  id: string;
  formId: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export default function PublicFormPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormModel | null>(null);
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password Protection state
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordAuthenticated, setPasswordAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Form entries
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    
    // Fetch form by shareId
    axios.get<FormModel[]>(`http://localhost:5000/forms?shareId=${shareId}`)
      .then((res) => {
        if (res.data.length === 0 || res.data[0].status === 'trash') {
          setErrorMsg('Form bulunamadı veya silinmiş.');
          setLoading(false);
          return;
        }
        
        const fetchedForm = res.data[0];
        setForm(fetchedForm);
        
        // If not password protected, or if empty password, bypass
        if (!fetchedForm.passwordProtection) {
          setPasswordAuthenticated(true);
        }

        // Fetch questions for this form
        return axios.get<QuestionModel[]>(`http://localhost:5000/questions?formId=${fetchedForm.id}`);
      })
      .then((res) => {
        if (res) {
          setQuestions(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Bağlantı kurulurken hata oluştu.');
        setLoading(false);
      });
  }, [shareId]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form && passwordInput === form.passwordProtection) {
      setPasswordAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
    if (validationErrors[questionId]) {
      setValidationErrors({ ...validationErrors, [questionId]: false });
    }
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentValues: string[] = answers[questionId] || [];
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((v) => v !== option);
    }
    handleInputChange(questionId, newValues);
  };

  // Progress computation
  const totalRequired = questions.filter(q => q.required).length;
  const filledRequired = questions
    .filter(q => q.required)
    .filter(q => {
      const val = answers[q.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== '';
    }).length;

  const progressPercent = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate required fields
    const errors: Record<string, boolean> = {};
    let hasError = false;

    questions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        const isEmpty = val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          errors[q.id] = true;
          hasError = true;
        }
      }
    });

    if (hasError) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Gather browser/device info
      const userAgent = navigator.userAgent;
      let browser = 'Chrome';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';

      let device = 'Desktop';
      if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';

      const countries = ['Turkey', 'United States', 'Germany', 'United Kingdom', 'France'];
      const country = countries[Math.floor(Math.random() * countries.length)];

      await axios.post('http://localhost:5000/responses', {
        id: Math.random().toString(36).substr(2, 9),
        formId: form.id,
        answers,
        submittedAt: new Date().toISOString(),
        browser,
        device,
        country,
      });

      setIsSubmitting(false);
      navigate(`/form/${shareId}/success`);
    } catch (err) {
      console.error(err);
      alert('Yanıt gönderilirken hata oluştu. Lütfen tekrar deneyin.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (errorMsg || !form) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-bg-surface border border-border-subtle p-8 rounded-3xl text-center space-y-4 shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="font-bold text-lg m-0">Giriş Başarısız</h3>
          <p className="text-xs text-text-secondary">{errorMsg || 'Ulaşılamıyor.'}</p>
        </div>
      </div>
    );
  }

  // Render Password Screen
  if (!passwordAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-bg-surface border border-border-subtle p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="p-3 bg-brand-primary/10 rounded-2xl w-fit mx-auto text-brand-primary">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg m-0">Şifreli Form</h3>
            <p className="text-xs text-text-secondary">Bu formu görüntülemek için şifre girmeniz gerekmektedir.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Şifreyi yazın..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
              {passwordError && (
                <span className="text-[10px] font-bold text-red-500 mt-1.5 block">Hatalı şifre girdiniz, tekrar deneyin.</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-primary py-3 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Public Form
  return (
    <div className={`min-h-screen py-12 px-4 transition-all ${form.theme === 'dark' ? 'dark bg-neutral-bg-dark text-neutral-text-dark-primary' : 'bg-bg-base'}`}>
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Progress header */}
        {totalRequired > 0 && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex-1 bg-bg-base h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand-secondary h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-text-secondary shrink-0">% {progressPercent} Tamamlandı</span>
          </div>
        )}

        {/* Form Meta */}
        <div className="bg-bg-surface border border-border-subtle p-8 rounded-3xl shadow-sm space-y-3">
          <h2 className="text-2xl font-extrabold m-0 text-text-primary">{form.title}</h2>
          <p className="text-xs text-text-secondary leading-relaxed">{form.description}</p>
        </div>

        {/* Form submission fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => {
            const hasError = validationErrors[q.id];
            return (
              <div
                key={q.id}
                id={`field-${q.id}`}
                className={`bg-bg-surface border p-6 rounded-3xl shadow-sm space-y-3 transition-all ${
                  hasError ? 'border-red-500 bg-red-500/5' : 'border-border-subtle'
                }`}
              >
                <div className="flex items-center gap-1">
                  <label className="text-xs font-bold text-text-primary leading-tight">{q.label}</label>
                  {q.required && <span className="text-red-500 font-bold text-xs">*</span>}
                </div>

                {/* Question inputs */}
                {q.type === 'text' && (
                  <input
                    type="text"
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary"
                  />
                )}

                {q.type === 'email' && (
                  <input
                    type="email"
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary"
                  />
                )}

                {q.type === 'number' && (
                  <input
                    type="number"
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary"
                  />
                )}

                {q.type === 'textarea' && (
                  <textarea
                    rows={4}
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base p-4 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary resize-none"
                  />
                )}

                {q.type === 'date' && (
                  <input
                    type="date"
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs focus:outline-none focus:border-brand-primary transition-all text-text-primary"
                  />
                )}

                {q.type === 'select' && (
                  <select
                    required={q.required}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base p-3 text-xs focus:outline-none focus:border-brand-primary text-text-secondary transition-all"
                  >
                    <option value="">Seçim yapın...</option>
                    {q.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {q.type === 'radio' && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 text-xs text-text-secondary font-medium cursor-pointer">
                        <input
                          type="radio"
                          name={`radio-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => handleInputChange(q.id, opt)}
                          className="h-4 w-4 text-brand-primary border-border-subtle focus:ring-brand-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => {
                      const list = answers[q.id] || [];
                      const isChecked = list.includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-3 text-xs text-text-secondary font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                            className="h-4 w-4 text-brand-primary border-border-subtle rounded focus:ring-brand-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = answers[q.id] >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange(q.id, star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                              active ? 'text-amber-400 fill-amber-400' : 'text-text-muted hover:text-amber-300'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-brand-primary px-8 py-4 text-xs font-bold text-white shadow-lg hover:bg-brand-primary-dark transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

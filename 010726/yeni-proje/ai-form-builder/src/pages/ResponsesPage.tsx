import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Eye, Trash2, Calendar, Smartphone, Globe, MessageSquare } from 'lucide-react';

interface FormModel {
  id: string;
  title: string;
}

interface QuestionModel {
  id: string;
  label: string;
}

interface ResponseModel {
  id: string;
  answers: Record<string, any>;
  submittedAt: string;
  browser: string;
  device: string;
  country: string;
}

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  
  const [form, setForm] = useState<FormModel | null>(null);
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [responses, setResponses] = useState<ResponseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<ResponseModel | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // Fetch form details
    const fetchFormDetails = axios.get<FormModel>(`http://localhost:5000/forms/${id}`);
    const fetchFormQuestions = axios.get<QuestionModel[]>(`http://localhost:5000/questions?formId=${id}`);
    const fetchFormResponses = axios.get<ResponseModel[]>(`http://localhost:5000/responses?formId=${id}`);

    Promise.all([fetchFormDetails, fetchFormQuestions, fetchFormResponses])
      .then(([formRes, questionsRes, responsesRes]) => {
        setForm(formRes.data);
        setQuestions(questionsRes.data);
        setResponses(responsesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleDeleteResponse = async (responseId: string) => {
    if (window.confirm('Bu yanıtı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:5000/responses/${responseId}`);
        setResponses(responses.filter(r => r.id !== responseId));
        if (selectedResponse?.id === responseId) {
          setSelectedResponse(null);
        }
      } catch (err) {
        console.error(err);
        alert('Yanıt silinirken hata oluştu.');
      }
    }
  };

  const handleExportCSV = () => {
    if (responses.length === 0 || questions.length === 0) return;

    // Header: Tarih, Tarayıcı, Cihaz, Ülke, Soru 1, Soru 2...
    const headers = ['Tarih', 'Tarayıcı', 'Cihaz', 'Ülke', ...questions.map(q => q.label)];
    
    // Rows
    const rows = responses.map(r => {
      const rowAnswers = questions.map(q => {
        const val = r.answers[q.id];
        if (Array.isArray(val)) return `"${val.join(', ')}"`;
        return `"${val || ''}"`;
      });
      return [
        new Date(r.submittedAt).toLocaleString('tr-TR'),
        r.browser,
        r.device,
        r.country,
        ...rowAnswers
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // Adding BOM for Turkish characters in Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form?.title || 'form'}-yanitlar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/forms" className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold m-0">Gelen Yanıtlar</h2>
            <p className="text-xs text-text-secondary">"{form?.title}" formuna ait toplanan yanıt listesi.</p>
          </div>
        </div>

        {responses.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
          >
            <Download className="h-4.5 w-4.5" /> CSV Dışa Aktar
          </button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-3xl space-y-4">
          <MessageSquare className="h-12 w-12 text-text-muted mx-auto stroke-1" />
          <h3 className="font-bold text-lg m-0">Henüz Yanıt Yok</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Bu form henüz herhangi bir kullanıcı tarafından doldurulmadı. Paylaşım linkini göndererek yanıt toplamaya başlayın.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Responses Table */}
          <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-3xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary font-bold">
                    <th className="py-3">Tarih</th>
                    <th className="py-3">Cihaz</th>
                    <th className="py-3">Ülke</th>
                    <th className="py-3 text-right">Eylemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-text-secondary font-medium">
                  {responses.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedResponse(r)}
                      className={`hover:bg-bg-base/50 transition-colors cursor-pointer ${
                        selectedResponse?.id === r.id ? 'bg-brand-primary/5 text-brand-primary' : ''
                      }`}
                    >
                      <td className="py-4 font-bold text-text-primary">
                        {new Date(r.submittedAt).toLocaleDateString('tr-TR')} {new Date(r.submittedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 capitalize">{r.device} &bull; {r.browser}</td>
                      <td className="py-4">{r.country}</td>
                      <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedResponse(r)}
                            className="rounded-lg p-1.5 hover:bg-bg-base text-brand-secondary transition-colors"
                            title="İncele"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(r.id)}
                            className="rounded-lg p-1.5 hover:bg-bg-base text-red-500 transition-colors"
                            title="Yanıtı Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Drawer Panel */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-6">
            <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Yanıt Detayları</h3>
            
            {selectedResponse ? (
              <div className="space-y-6 animate-fade-in">
                {/* Meta details */}
                <div className="space-y-2 text-xs text-text-secondary bg-bg-base p-4 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    <span>{new Date(selectedResponse.submittedAt).toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-text-muted" />
                    <span className="capitalize">{selectedResponse.device} ({selectedResponse.browser})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-text-muted" />
                    <span>{selectedResponse.country}</span>
                  </div>
                </div>

                {/* Question - Answers List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Verilen Cevaplar</h4>
                  {questions.map((q) => {
                    const ans = selectedResponse.answers[q.id];
                    return (
                      <div key={q.id} className="space-y-1.5">
                        <p className="text-[11px] font-bold text-text-primary leading-tight">{q.label}</p>
                        <div className="bg-bg-base px-3 py-2.5 rounded-xl border border-border-subtle text-xs text-text-secondary">
                          {Array.isArray(ans) ? ans.join(', ') : ans?.toString() || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted text-xs font-medium space-y-2">
                <p>Yanıt detaylarını görüntülemek için tablodan bir satıra tıklayın.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

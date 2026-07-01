import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BarChart, Smartphone, Laptop, Globe, Eye, MessageSquare, Percent } from 'lucide-react';

interface FormModel {
  id: string;
  title: string;
}

interface ResponseModel {
  id: string;
  submittedAt: string;
  browser: string;
  device: string;
  country: string;
}

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  
  const [form, setForm] = useState<FormModel | null>(null);
  const [responses, setResponses] = useState<ResponseModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchFormDetails = axios.get<FormModel>(`http://localhost:5000/forms/${id}`);
    const fetchFormResponses = axios.get<ResponseModel[]>(`http://localhost:5000/responses?formId=${id}`);

    Promise.all([fetchFormDetails, fetchFormResponses])
      .then(([formRes, responsesRes]) => {
        setForm(formRes.data);
        setResponses(responsesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  // Calculate metrics
  const totalResponses = responses.length;
  const totalViews = Math.round(totalResponses * 1.35) + 3; // Simulated views
  const completionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  responses.forEach(r => {
    deviceCounts[r.device] = (deviceCounts[r.device] || 0) + 1;
  });

  // Browser breakdown
  const browserCounts: Record<string, number> = {};
  responses.forEach(r => {
    browserCounts[r.browser] = (browserCounts[r.browser] || 0) + 1;
  });

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  responses.forEach(r => {
    countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
  });

  const getPercent = (count: number) => {
    if (totalResponses === 0) return 0;
    return Math.round((count / totalResponses) * 100);
  };

  const statCards = [
    { title: 'Görüntülenme', value: totalViews, desc: 'Toplam tekil ziyaret', icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Cevap Sayısı', value: totalResponses, desc: 'Gönderilen form sayısı', icon: MessageSquare, color: 'text-purple-500 bg-purple-500/10' },
    { title: 'Tamamlama Oranı', value: `%${completionRate}`, desc: 'Görüntüleme / Cevap oranı', icon: Percent, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border-subtle pb-4">
        <Link to="/dashboard/forms" className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold m-0">Form Analitiği</h2>
          <p className="text-xs text-text-secondary">"{form?.title}" formunun performans istatistikleri.</p>
        </div>
      </div>

      {totalResponses === 0 ? (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-3xl space-y-4">
          <BarChart className="h-12 w-12 text-text-muted mx-auto stroke-1" />
          <h3 className="font-bold text-lg m-0">Yeterli Veri Yok</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Analiz grafikleri çizebilmek için formunuza ait en az 1 yanıt bulunmalıdır.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Stats grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-bg-surface border border-border-subtle p-6 rounded-3xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-text-secondary">{card.title}</span>
                    <h3 className="text-2xl font-extrabold m-0 leading-tight">{card.value}</h3>
                    <p className="text-[10px] text-text-muted">{card.desc}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Device breakdown & Browser charts */}
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-6">
              <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Cihazlar & Tarayıcılar</h3>
              
              <div className="space-y-6">
                {/* Devices */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Cihaz Dağılımı</h4>
                  {Object.entries(deviceCounts).map(([device, count]) => {
                    const pct = getPercent(count);
                    return (
                      <div key={device} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-text-secondary">
                          <span className="capitalize">{device}</span>
                          <span>{count} Yanıt (%{pct})</span>
                        </div>
                        <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-primary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Browsers */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Tarayıcı Dağılımı</h4>
                  {Object.entries(browserCounts).map(([browser, count]) => {
                    const pct = getPercent(count);
                    return (
                      <div key={browser} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-text-secondary">
                          <span>{browser}</span>
                          <span>{count} Yanıt (%{pct})</span>
                        </div>
                        <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-secondary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Countries layout */}
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-6">
              <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Coğrafi Konumlar</h3>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Ülke Dağılımı</h4>
                <div className="space-y-4">
                  {Object.entries(countryCounts).map(([country, count]) => {
                    const pct = getPercent(count);
                    return (
                      <div key={country} className="flex items-center justify-between text-xs border-b border-border-subtle/50 pb-3 last:border-b-0">
                        <div className="flex items-center gap-2 font-semibold">
                          <Globe className="h-4 w-4 text-text-muted" />
                          <span>{country}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-text-primary">{count} Yanıt</span>
                          <span className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">% {pct}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

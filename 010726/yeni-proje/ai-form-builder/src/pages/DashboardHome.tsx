import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  CheckSquare, 
  Activity, 
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';

interface Stats {
  totalClients: number;
  activeDeals: number;
  revenue: number;
  growth: number;
}

interface ActivityItem {
  id: string;
  type: string;
  clientId: string;
  description: string;
  timestamp: string;
}

interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  clientId: string;
}

interface RevenueItem {
  month: string;
  revenue: number;
}

interface DashboardData {
  stats: Stats;
  recentActivity: ActivityItem[];
  upcomingTasks: TaskItem[];
  revenueChart: RevenueItem[];
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/dashboard')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('İstatistik verileri yüklenirken hata oluştu.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl bg-semantic-error-bg border border-semantic-error-base/20 p-6 text-semantic-error-text">
        <p className="font-bold">Hata oluştu</p>
        <p className="text-sm">{error || 'Veri bulunamadı.'}</p>
      </div>
    );
  }

  const { stats, recentActivity, upcomingTasks, revenueChart } = data;

  const cardStats = [
    {
      title: 'Toplam Müşteri',
      value: stats.totalClients,
      growth: `+${stats.growth}%`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Aktif Anlaşmalar',
      value: stats.activeDeals,
      growth: 'Bu Ay',
      icon: Briefcase,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Toplam Gelir',
      value: `$${stats.revenue.toLocaleString()}`,
      growth: '+14.2%',
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none">
          <Sparkles className="h-full w-full stroke-[0.5]" />
        </div>
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            Hoş Geldiniz, Alex Morgan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold m-0 leading-tight">Yapay Zeka ile Müşteri Geri Bildirimini Hızlandırın</h2>
          <p className="text-sm text-white/80">
            Formlarınızı dakikalar içinde hazırlayın, müşteri datasını otomatik olarak toplayıp analiz edin.
          </p>
          <div className="flex gap-4">
            <Link
              to="/dashboard/ai"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-brand-primary shadow-md hover:bg-white/90 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-brand-secondary" /> AI Form Oluştur
            </Link>
            <Link
              to="/dashboard/forms/new"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary-dark/40 px-4 py-2.5 text-xs font-bold hover:bg-brand-primary-dark/60 border border-white/20 transition-all"
            >
              Boş Form Aç <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        {cardStats.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-bg-surface border border-border-subtle p-6 rounded-3xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text-secondary">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold">{card.value}</span>
                <span className="text-xs font-bold text-semantic-success-base inline-flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> {card.growth}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Tasks Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue SVG Chart */}
        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base m-0">Gelir Trendi</h3>
              <p className="text-xs text-text-secondary">Son 3 ayın karşılaştırmalı gelir tablosu</p>
            </div>
            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">USD ($)</span>
          </div>

          {/* SVG Chart Drawing */}
          <div className="relative h-48 w-full flex items-end justify-between px-8 border-b border-border-subtle pb-2">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 bottom-12 border-t border-dashed border-border-subtle/50 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-24 border-t border-dashed border-border-subtle/50 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-36 border-t border-dashed border-border-subtle/50 pointer-events-none"></div>
            
            {/* Bars */}
            {revenueChart.map((item, idx) => {
              const maxVal = 90000;
              const heightPercent = (item.revenue / maxVal) * 100;
              return (
                <div key={item.month} className="flex flex-col items-center gap-2 z-10 w-1/4 group">
                  <div className="text-xs font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity bg-bg-surface border border-border-subtle px-2 py-0.5 rounded shadow-sm -mt-6">
                    ${item.revenue.toLocaleString()}
                  </div>
                  <div
                    className="w-12 bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-xl hover:brightness-110 transition-all duration-500 cursor-pointer"
                    style={{ height: `${heightPercent}%`, minHeight: '40px' }}
                  ></div>
                  <span className="text-xs font-semibold text-text-secondary">{item.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
            <span>Minimum: $60K</span>
            <span>Maksimum: $90K</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base m-0">Yapılacak Görevler</h3>
              <p className="text-xs text-text-secondary">Takip etmeniz gereken müşteri aksiyonları</p>
            </div>
            <CheckSquare className="h-5 w-5 text-brand-secondary" />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-48 pr-2">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-bg-base transition-colors group">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold group-hover:text-brand-primary transition-colors">{task.title}</p>
                  <span className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-5 w-5 text-brand-primary" />
          <h3 className="font-bold text-base m-0">Son Etkinlikler</h3>
        </div>
        <div className="space-y-4">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex items-center gap-4 text-xs p-3 rounded-2xl bg-bg-base border border-border-subtle/50">
              <span className="h-2 w-2 rounded-full bg-brand-secondary shrink-0"></span>
              <p className="flex-1 text-text-secondary font-medium">{act.description}</p>
              <span className="text-[10px] text-text-muted shrink-0">{new Date(act.timestamp).toLocaleDateString('tr-TR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

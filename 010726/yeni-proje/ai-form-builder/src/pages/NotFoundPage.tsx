import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl animate-bounce">
          <AlertCircle className="h-10 w-10" />
        </div>
        
        <h2 className="text-4xl font-extrabold tracking-tight m-0">404</h2>
        <h3 className="text-xl font-bold m-0">Aradığınız Sayfa Bulunamadı</h3>
        
        <p className="text-xs text-text-secondary leading-relaxed">
          Ulaşmaya çalıştığınız bağlantı kaldırılmış, adresi değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

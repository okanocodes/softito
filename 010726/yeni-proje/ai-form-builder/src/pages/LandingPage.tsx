import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Smartphone, Brain, BarChart, Shield, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: 'Yapay Zeka Destekli',
      desc: 'Sadece ihtiyacınızı söyleyin, AI formunuzu saniyeler içinde oluştursun.',
      icon: Brain,
      color: 'text-purple-500'
    },
    {
      title: 'Sürükle-Bırak Kolaylığı',
      desc: 'Soruları özgürce taşıyın, düzenleyin, koşullu alanlar ekleyin.',
      icon: Smartphone,
      color: 'text-blue-500'
    },
    {
      title: 'Gelişmiş Analitik',
      desc: 'Yanıtları gerçek zamanlı izleyin, tarayıcı, cihaz ve ülke analizleri yapın.',
      icon: BarChart,
      color: 'text-emerald-500'
    },
    {
      title: 'Güvenli ve Paylaşılabilir',
      desc: 'Şifre korumalı formlar, özel alan adları ve dinamik QR kodlar.',
      icon: Shield,
      color: 'text-rose-500'
    }
  ];

  const pricing = [
    {
      name: 'Başlangıç',
      price: 'Ücretsiz',
      features: ['Aylık 100 Yanıt', '3 Aktif Form', 'AI Form Oluşturucu', 'Temel Analitik'],
      button: 'Hemen Başla',
      popular: false,
    },
    {
      name: 'Profesyonel',
      price: '$19 / ay',
      features: ['Sınırsız Yanıt', 'Sınırsız Form', 'Özel Tema & Renkler', 'Detaylı Analiz & CSV', 'Şifre Koruması'],
      button: 'Ücretsiz Deneyin',
      popular: true,
    },
    {
      name: 'Kurumsal',
      price: '$49 / ay',
      features: ['Profesyonel +', 'Özel Alan Adı (CName)', 'Takım Çalışma Alanı (5 Üye)', 'Öncelikli Destek API'],
      button: 'Satışla Görüşün',
      popular: false,
    }
  ];

  const faqs = [
    { q: 'AI Form Oluşturucu nasıl çalışır?', a: 'Sadece "Bir iş başvuru formu oluştur" gibi doğal dilde bir talep girmeniz yeterlidir. Yapay zekamız bunu anlar ve gerekli tüm soruları otomatik hazırlar.' },
    { q: 'Formları kendi web siteme gömebilir miyim?', a: 'Evet, her form için sağladığımız iframe kodunu kopyalayarak saniyeler içinde sitenize entegre edebilirsiniz.' },
    { q: 'Kendi logomu ve renklerimi ekleyebilir miyim?', a: 'Evet, form ayarları sayfasından logonuzu ekleyebilir, marka kimliğinize uygun renk paletlerini seçebilirsiniz.' }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden">
      {/* Header */}
      <nav className="glass-panel sticky top-0 border-b border-border-subtle flex h-20 items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-brand-primary">
          <Sparkles className="h-6 w-6 text-brand-secondary" />
          <span className="font-extrabold tracking-tight">AI Form Builder</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-brand-primary transition-colors">
            Giriş Yap
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-brand-primary-dark transition-all"
          >
            Ücretsiz Kaydol
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center max-w-5xl mx-auto md:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-4 py-1.5 text-xs font-bold text-brand-secondary mb-6">
          <Sparkles className="h-3.5 w-3.5 animate-spin" /> Yapay Zekanın Gücünü Keşfedin
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-8">
          Saniyeler İçinde <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">AI ile Form</span> Oluşturun
        </h1>
        
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Form tasarlamakla vakit kaybetmeyin. İstediğiniz şablonu tarif edin, AI sizin için en uygun soruları ve seçenekleri anında üretsin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-primary-dark hover:scale-105 active:scale-95 transition-all"
          >
            Hemen Deneyin <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-8 py-4 text-base font-bold hover:bg-border-subtle transition-all"
          >
            Özellikleri İncele
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-bg-surface border-y border-border-subtle md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">Form Geliştirmenin En Akıllı Yolu</h2>
            <p className="text-text-secondary">AI Form Builder, geleneksel form oluşturucuların karmaşasını ortadan kaldırarak size tam kontrol sağlar.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-bg-base border border-border-subtle p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group">
                  <div className={`p-4 bg-bg-surface w-fit rounded-2xl border border-border-subtle mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${feat.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{feat.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">Her İhtiyaca Uygun Planlar</h2>
          <p className="text-text-secondary">İster bireysel, ister büyük ekipler için esnek fiyatlandırma modelleri.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={`bg-bg-surface border p-8 rounded-3xl flex flex-col relative transition-all duration-300 ${
                tier.popular ? 'border-brand-primary shadow-xl scale-105 z-10' : 'border-border-subtle hover:scale-[1.02]'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-4 py-1 text-xs font-bold text-white uppercase">
                  En Popüler
                </span>
              )}
              <h3 className="font-bold text-xl mb-2">{tier.name}</h3>
              <p className="text-3xl font-extrabold mb-6 text-brand-primary">{tier.price}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <CheckCircle className="h-4.5 w-4.5 text-brand-secondary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/dashboard"
                className={`w-full rounded-2xl py-3.5 text-center text-sm font-bold transition-all ${
                  tier.popular
                    ? 'bg-brand-primary text-white shadow-lg hover:bg-brand-primary-dark'
                    : 'border border-border-subtle hover:bg-border-subtle'
                }`}
              >
                {tier.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-bg-surface border-t border-border-subtle md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">Sıkça Sorulan Sorular</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-bg-base border border-border-subtle p-6 rounded-2xl flex gap-4">
                <HelpCircle className="h-6 w-6 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base mb-2 text-text-primary">{faq.q}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 text-center text-sm text-text-muted">
        <p>&copy; 2026 AI Form Builder. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

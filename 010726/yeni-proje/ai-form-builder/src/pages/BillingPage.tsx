import React from 'react';
import { CreditCard, CheckCircle, ArrowUpRight, Check } from 'lucide-react';

export default function BillingPage() {
  const currentPlan = {
    name: 'Pro Plan',
    price: '$19/aylık',
    renewDate: '24 Temmuz 2026',
    status: 'Aktif',
  };

  const invoices = [
    { id: 'INV-02948', date: '24 Haziran 2026', amount: '$19.00', status: 'Ödendi' },
    { id: 'INV-02812', date: '24 Mayıs 2026', amount: '$19.00', status: 'Ödendi' },
    { id: 'INV-02685', date: '24 Nisan 2026', amount: '$19.00', status: 'Ödendi' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold m-0">Abonelik ve Ödeme</h2>
        <p className="text-xs text-text-secondary">Paket detaylarınızı, fatura geçmişinizi ve kart bilgilerinizi yönetin.</p>
      </div>

      {/* Plan Info Card */}
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl grid sm:grid-cols-3 gap-6 items-center">
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-semantic-success-text bg-semantic-success-bg border border-semantic-success-base/20 px-2.5 py-0.5 rounded-full uppercase">
              {currentPlan.status}
            </span>
            <h3 className="font-extrabold text-lg m-0">{currentPlan.name}</h3>
          </div>
          <p className="text-xs text-text-secondary">
            Bir sonraki yenileme tarihi: <span className="font-semibold text-text-primary">{currentPlan.renewDate}</span>. 
            Tanımlı kartınızdan <span className="font-semibold text-text-primary">{currentPlan.price}</span> çekilecektir.
          </p>
        </div>
        
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-base py-3 text-xs font-bold hover:bg-border-subtle transition-all active:scale-[0.98]">
          Planı Değiştir <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Credit Card Detail */}
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-brand-primary" /> Kayıtlı Ödeme Yöntemi
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-bg-base border border-border-subtle rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-14 rounded-lg bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center tracking-widest shadow-sm">
              VISA
            </div>
            <div>
              <p className="text-xs font-bold">Visa Professional &bull;&bull;&bull;&bull; 4242</p>
              <p className="text-[10px] text-text-muted">Son Kullanma: 12/28</p>
            </div>
          </div>
          <button className="text-xs font-bold text-brand-primary hover:underline">
            Düzenle
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3">Fatura Geçmişi</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary font-bold">
                <th className="py-3">Fatura Kodu</th>
                <th className="py-3">Tarih</th>
                <th className="py-3">Tutar</th>
                <th className="py-3">Durum</th>
                <th className="py-3 text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-text-secondary font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-bg-base/30 transition-colors">
                  <td className="py-3 font-bold text-text-primary">{inv.id}</td>
                  <td className="py-3">{inv.date}</td>
                  <td className="py-3 font-bold text-text-primary">{inv.amount}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-semantic-success-base">
                      <Check className="h-3 w-3" /> {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-brand-primary hover:underline font-bold text-[11px]">
                      PDF İndir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

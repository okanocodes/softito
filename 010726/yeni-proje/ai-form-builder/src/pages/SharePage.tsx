import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchForm } from '../store/slices/formsSlice';
import { ArrowLeft, Copy, Check, QrCode, Globe, Send, Share2 } from 'lucide-react';

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentForm, status } = useAppSelector((state) => state.forms);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchForm(id));
    }
  }, [id, dispatch]);

  if (status === 'loading' && !currentForm) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div className="text-center py-12">
        <p>Form bulunamadı.</p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/form/${currentForm.shareId}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Yükleniyor...</iframe>`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border-subtle pb-4">
        <Link to="/dashboard/forms" className="rounded-xl border border-border-subtle p-2.5 hover:bg-bg-surface transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold m-0">Formu Paylaş</h2>
          <p className="text-xs text-text-secondary">"{currentForm.title}" formunu yayınlayın ve yanıtları toplayın.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Share Link & Embed */}
        <div className="md:col-span-2 space-y-6">
          {/* Link box */}
          <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm m-0 flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-brand-primary" /> Paylaşım Bağlantısı
            </h3>
            
            <p className="text-xs text-text-secondary leading-relaxed">
              Formunuzu doğrudan paylaşmak için aşağıdaki URL'yi kopyalayabilir veya yeni sekmede açabilirsiniz.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-xs font-semibold focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] ${
                  copiedLink 
                    ? 'bg-semantic-success-base text-white shadow-md' 
                    : 'bg-brand-primary text-white hover:bg-brand-primary-dark shadow-md'
                }`}
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            
            <div className="pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:underline"
              >
                Formu Canlı Görüntüle <Send className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Embed box */}
          <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm m-0 flex items-center gap-2">
              <Share2 className="h-4.5 w-4.5 text-brand-primary" /> Web Sitesine Göm (Embed)
            </h3>
            
            <p className="text-xs text-text-secondary leading-relaxed">
              Formu kendi web sitenizin içine entegre etmek için aşağıdaki iframe kodunu gömebilirsiniz.
            </p>

            <div className="flex gap-2">
              <textarea
                readOnly
                rows={2}
                value={embedCode}
                className="flex-1 rounded-xl border border-border-subtle bg-bg-base p-4 text-xs font-mono focus:outline-none select-all resize-none"
              />
              <button
                onClick={handleCopyEmbed}
                className={`px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all self-stretch justify-center active:scale-[0.98] ${
                  copiedEmbed 
                    ? 'bg-semantic-success-base text-white shadow-md' 
                    : 'bg-brand-primary text-white hover:bg-brand-primary-dark shadow-md'
                }`}
              >
                {copiedEmbed ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedEmbed ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Column */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col items-center justify-between text-center gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm m-0 flex items-center justify-center gap-2">
              <QrCode className="h-4.5 w-4.5 text-brand-primary" /> QR Kod
            </h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Mobil kullanıcıların formu doldurması için QR kodu indirebilir veya basabilirsiniz.
            </p>
          </div>

          {/* QR Code image loaded from public server */}
          <div className="p-4 bg-white border border-border-subtle rounded-2xl">
            <img src={qrUrl} alt="Form QR Kodu" className="h-36 w-36 object-contain" />
          </div>

          <a
            href={qrUrl}
            target="_blank"
            download={`${currentForm.title}-qr.png`}
            rel="noreferrer"
            className="w-full text-center rounded-xl border border-border-subtle bg-bg-base py-3 text-xs font-bold hover:bg-border-subtle transition-all"
          >
            QR Kodu İndir
          </a>
        </div>
      </div>
    </div>
  );
}

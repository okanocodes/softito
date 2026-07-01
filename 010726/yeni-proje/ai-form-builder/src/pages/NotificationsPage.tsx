import React, { useState } from 'react';
import { Bell, Check, Trash2, Mail, MessageSquare, PlusCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'response' | 'system' | 'form';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      title: 'Yeni Bir Yanıt Alındı',
      message: 'Müşteri Geri Bildirim Formu için Jane Doe tarafından yeni bir yanıt gönderildi.',
      time: '5 dakika önce',
      read: false,
      type: 'response'
    },
    {
      id: 'n2',
      title: 'Formunuz Yayında',
      message: 'İş Başvuru Formu başarıyla yayınlandı ve paylaşıma hazır.',
      time: '2 saat önce',
      read: false,
      type: 'form'
    },
    {
      id: 'n3',
      title: 'Hesap Güncellemesi',
      message: 'Profil resminiz başarıyla güncellendi.',
      time: '1 gün önce',
      read: true,
      type: 'system'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'response': return MessageSquare;
      case 'form': return PlusCircle;
      default: return Bell;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold m-0">Bildirimler</h2>
          <p className="text-xs text-text-secondary">Sisteminizde ve formlarınızda oluşan en son aktiviteler.</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Check className="h-4 w-4" /> Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-text-muted space-y-3">
            <Bell className="h-10 w-10 mx-auto stroke-1" />
            <p className="text-xs font-medium">Herhangi bir bildirim bulunmuyor.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle/50">
            {notifications.map((notif) => {
              const Icon = getIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between py-4 first:pt-0 last:pb-0 gap-4 group ${
                    !notif.read ? 'font-semibold' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border mt-0.5 ${
                      !notif.read 
                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                        : 'bg-bg-base border-border-subtle text-text-muted'
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-tight flex items-center gap-2">
                        {notif.title}
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary"></span>
                        )}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">{notif.message}</p>
                      <span className="text-[10px] text-text-muted font-medium mt-1.5 block">{notif.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 hover:bg-bg-base text-red-500 transition-all self-center shrink-0"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

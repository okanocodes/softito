import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, Shield, ShieldAlert, Mail } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/settings')
      .then((res) => {
        setTeam(res.data.team || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    // Simulate inviting member
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
    };
    
    setTeam([...team, newMember]);
    setInviteEmail('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold m-0">Takım Yönetimi</h2>
        <p className="text-xs text-text-secondary">Çalışma alanınızdaki formları birlikte yönetmek için ekip üyelerini davet edin.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="md:col-span-2 bg-bg-surface border border-border-subtle rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-primary" /> Ekip Üyeleri ({team.length})
          </h3>
          
          <div className="divide-y divide-border-subtle/50">
            {team.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-xs font-bold text-text-primary capitalize">{member.name}</p>
                  <p className="text-[10px] text-text-muted">{member.email}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                  member.role === 'admin'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-950/40'
                    : member.role === 'editor'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200 dark:border-purple-950/40'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-950/20 dark:text-slate-400 border border-slate-200 dark:border-slate-950/40'
                }`}>
                  {member.role === 'admin' ? 'Yönetici' : member.role === 'editor' ? 'Editör' : 'İzleyici'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Member form */}
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl h-fit space-y-4">
          <h3 className="font-bold text-base m-0 border-b border-border-subtle pb-3 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand-secondary" /> Üye Davet Et
          </h3>

          {successMsg && (
            <div className="text-xs p-3 rounded-xl bg-semantic-success-bg border border-semantic-success-base/20 text-semantic-success-text font-medium">
              Davetiye başarıyla gönderildi!
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary mb-1.5">E-posta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="ekip@sirket.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-subtle bg-bg-base text-xs focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-secondary mb-1.5">Rol Yetkisi</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full rounded-xl border border-border-subtle bg-bg-base p-2.5 text-xs focus:outline-none focus:border-brand-primary text-text-secondary transition-all"
              >
                <option value="viewer">İzleyici (Formları görüntüler)</option>
                <option value="editor">Editör (Formları düzenler/yaratır)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-primary py-3 text-xs font-bold text-white hover:bg-brand-primary-dark transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
            >
              Davet Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

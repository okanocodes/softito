import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchForms, updateForm } from '../store/slices/formsSlice';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Settings, 
  Share2, 
  BarChart, 
  Trash2,
  Globe,
  FileEdit,
  Eye,
  MessageSquare
} from 'lucide-react';

export default function FormsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: forms, status, error } = useAppSelector((state) => state.forms);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const handleMoveToTrash = (id: string) => {
    dispatch(updateForm({ id, data: { status: 'trash' } }));
    setActiveMenuId(null);
  };

  const filteredForms = forms
    .filter(form => form.status !== 'trash')
    .filter(form => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            form.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold m-0">Formlarım</h2>
          <p className="text-xs text-text-secondary">Oluşturduğunuz tüm formları buradan yönetebilirsiniz.</p>
        </div>
        <Link
          to="/dashboard/forms/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-primary-dark transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" /> Yeni Form Oluştur
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-surface border border-border-subtle p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            type="text"
            placeholder="Form adı veya açıklaması ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border-subtle rounded-xl bg-bg-base text-sm focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {(['all', 'published', 'draft'] as const).map((statusType) => (
            <button
              key={statusType}
              onClick={() => setStatusFilter(statusType)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === statusType
                  ? 'bg-brand-primary text-white'
                  : 'border border-border-subtle bg-bg-surface hover:bg-bg-base text-text-secondary'
              }`}
            >
              {statusType === 'all' ? 'Tümü' : statusType === 'published' ? 'Yayınlanmış' : 'Taslak'}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-semantic-error-bg text-semantic-error-text border border-semantic-error-base/20 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Grid of Forms */}
      {status === 'loading' ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-3xl space-y-4">
          <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto text-brand-primary text-xl">✍</div>
          <h3 className="font-bold text-lg m-0">Form Bulunamadı</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Arama kriterlerinize uyan veya oluşturulmuş bir form yok. Hemen yeni bir tane oluşturun.
          </p>
          <Link
            to="/dashboard/forms/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-primary-dark transition-all"
          >
            Yeni Form Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => {
            const isMenuOpen = activeMenuId === form.id;
            return (
              <div 
                key={form.id} 
                className="bg-bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col justify-between relative hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Card Header Status & Dropdown menu */}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        form.status === 'published'
                          ? 'bg-semantic-success-bg text-semantic-success-text border border-semantic-success-base/20'
                          : 'bg-semantic-warning-bg text-semantic-warning-text border border-semantic-warning-base/20'
                      }`}
                    >
                      {form.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>

                    {/* Action dropdown button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : form.id);
                        }}
                        className="rounded-full p-1.5 hover:bg-bg-base text-text-muted transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-bg-surface border border-border-subtle p-1.5 shadow-xl z-20">
                          <Link
                            to={`/dashboard/forms/${form.id}/editor`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-bg-base transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" /> Düzenle
                          </Link>
                          <Link
                            to={`/dashboard/forms/${form.id}/settings`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-bg-base transition-colors"
                          >
                            <Settings className="h-3.5 w-3.5" /> Ayarlar
                          </Link>
                          <Link
                            to={`/dashboard/forms/${form.id}/share`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-bg-base transition-colors"
                          >
                            <Share2 className="h-3.5 w-3.5" /> Paylaş
                          </Link>
                          <Link
                            to={`/dashboard/forms/${form.id}/analytics`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-bg-base transition-colors"
                          >
                            <BarChart className="h-3.5 w-3.5" /> Analiz
                          </Link>
                          <button
                            onClick={() => handleMoveToTrash(form.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Çöpe At
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-lg m-0 mb-2 truncate group-hover:text-brand-primary transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-6">
                    {form.description}
                  </p>
                </div>

                {/* Footer links / stats */}
                <div className="border-t border-border-subtle pt-4 mt-2 flex items-center justify-between text-xs text-text-muted font-medium">
                  <div className="flex gap-3">
                    <Link
                      to={`/dashboard/forms/${form.id}/responses`}
                      className="flex items-center gap-1 hover:text-brand-primary"
                      title="Cevaplar"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Cevaplar</span>
                    </Link>
                    {form.status === 'published' && (
                      <a
                        href={`/form/${form.shareId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-brand-secondary"
                        title="Canlı Önizleme"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Canlı</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px]">
                    {new Date(form.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

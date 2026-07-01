import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchForms, updateForm, deleteForm } from '../store/slices/formsSlice';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function TrashPage() {
  const dispatch = useAppDispatch();
  const { items: forms, status } = useAppSelector((state) => state.forms);

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const trashedForms = forms.filter(form => form.status === 'trash');

  const handleRestore = (id: string) => {
    dispatch(updateForm({ id, data: { status: 'draft' } }));
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Bu formu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      dispatch(deleteForm(id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold m-0">Çöp Kutusu</h2>
        <p className="text-xs text-text-secondary">Silinen formlarınızı buradan geri yükleyebilir veya kalıcı olarak temizleyebilirsiniz.</p>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        </div>
      ) : trashedForms.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-3xl space-y-4">
          <div className="h-12 w-12 rounded-full bg-border-subtle flex items-center justify-center mx-auto text-text-muted text-xl">🗑</div>
          <h3 className="font-bold text-lg m-0">Çöp Kutusu Boş</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Çöp kutusunda herhangi bir silinmiş form bulunmamaktadır.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trashedForms.map((form) => (
            <div 
              key={form.id} 
              className="bg-bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col justify-between hover:shadow-sm transition-shadow relative"
            >
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-950/40 mb-4 inline-block">
                  Silindi
                </span>
                <h3 className="font-bold text-lg m-0 mb-2 truncate">{form.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-6">
                  {form.description}
                </p>
              </div>

              <div className="border-t border-border-subtle pt-4 mt-2 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleRestore(form.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-border-subtle bg-bg-base px-3 py-2 text-xs font-bold hover:bg-border-subtle text-brand-primary transition-all active:scale-[0.98]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Geri Yükle
                </button>
                <button
                  onClick={() => handlePermanentDelete(form.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 hover:border-red-500 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 px-3 py-2 text-xs font-bold text-red-500 transition-all active:scale-[0.98]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Kalıcı Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

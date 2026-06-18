export default function ProductCart({ cart, isOpen, onClose, onUpdateAmount }) {
    if (!isOpen) return null;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const drawerClass = `sepet-drawer ${isOpen ? "sepet-drawer-visible" : "sepet-drawer-hidden"}`;

    return (
        <>
            <div onClick={onClose} className="drawer-arka-plan"></div>

            <div className={`${drawerClass} bg-white shadow-2xl`}>
                <div>
                    <div className="drawer-ust">
                        <h3 className="app-card-title">
                            Sepetim ({cart.reduce((sum, item) => sum + item.quantity, 0)} Ürün)
                        </h3>
                        <button onClick={onClose} className="drawer-kapat-btn">✕</button>
                    </div>

                    {cart.length === 0 ? (
                        <div className="sepet-bos-etiket py-10 text-center text-slate-500">
                            <span>Sepetiniz şu anda boş.</span>
                        </div>
                    ) : (
                        <div className="sepet-liste-alani space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="sepet-urun-satir flex items-start gap-4 p-4 rounded-3xl border border-slate-200 bg-slate-50">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <span className="sepet-urun-ad block text-sm font-semibold text-slate-900">
                                                    {item.title}
                                                </span>
                                                <span className="sepet-urun-fiyat block mt-1 text-sm text-slate-500">
                                                    {item.price} TL
                                                </span>
                                            </div>
                                            <div className="text-right text-slate-500">
                                                <span className="sepet-satir-toplam-fiyat text-base font-bold text-slate-900 block">
                                                    {(item.price * item.quantity)} TL
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <div className="sepet-adet-kontrolleri flex items-center gap-2 bg-white rounded-full border border-slate-200 p-1">
                                                <button
                                                    onClick={() => onUpdateAmount(item.id, item.quantity - 1)}
                                                    className="sepet-adet-btn h-8 w-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                >
                                                    -
                                                </button>
                                                <span className="sepet-adet-yazi min-w-[24px] text-center text-sm font-semibold text-slate-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateAmount(item.id, item.quantity + 1)}
                                                    className="sepet-adet-btn h-8 w-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => onUpdateAmount(item.id, 0)}
                                                className="sepet-satir-sil-btn text-[11px] font-bold text-rose-500 hover:text-rose-700"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sepet-alt-odeme-paneli border-t border-slate-200 pt-4 mt-4">
                    <div className="odeme-detay-satiri flex items-center justify-between text-sm text-slate-600">
                        <span className="detail-meta-label">Toplam</span>
                        <span className="odeme-genel-toplam text-lg font-black text-orange-500">
                            {totalPrice} TL
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

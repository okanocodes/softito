import { useState, useRef, useEffect } from "react";

const ArrayState = () => {
    const [gorevler, setGorevler] = useState([
        { id: 1, baslik: "UseState çalışma mantığını öğren", tamamlandi: true },
        { id: 2, baslik: "Dizi State Yapısı Öpren", tamamlandi: false },
        {
            id: 3,
            baslik: "Form Event Handling yapılarını incele",
            tamamlandi: false,
        },
    ]);

    const [yeniGorev, setYeniGorev] = useState("");

    // const todoListRef = useRef(null)

    const gorevRef = useRef(null)

    // const itemRefs = useRef(new Map());



    const gorevEkle = (e) => {
        e.preventDefault();
        if (yeniGorev.trim() === "") return;
        const yeni = {
            id: Date.now(),
            baslik: yeniGorev,
            tamamlandi: false,
        };
        setGorevler([...gorevler, yeni]);


        setYeniGorev("");


        // gorevRef.current.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'nearest',
        //     inline: 'nearest'
        // }, 500);

        // itemRefs.current.get(yeni.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        // setTimeout(() => {
        //     gorevRef.current.scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'nearest',
        //         inline: 'nearest'
        //     });
        // }, 500)



    };

    const gorevTamamlaToggle = (id) => {
        setGorevler(
            gorevler.map((g) =>
                g.id === id ? { ...g, tamamlandi: !g.tamamlandi } : g,
            ),
        );
    };

    const gorevSil = (id) => {
        setGorevler(gorevler.filter((g) => g.id !== id));
    };

    const tamamlananlarSayisi = gorevler.filter((g) => g.tamamlandi).length;


    useEffect(() => {
        gorevRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }, [gorevler]);

    return (
        <div className="p-4">
            <h3 className="demo-title">Demo 5: Dizi (Array) State Yönetimi</h3>
            <div className="demo-card demo-card-xl space-y-4">
                <div className="card-header-list">
                    <h4 className="demo-section-title">Yapılacaklar Listesi</h4>
                    <span className="demo-count-span">
                        {tamamlananlarSayisi} / {gorevler.length} Tamamlandı
                    </span>
                </div>
                <form onSubmit={gorevEkle} className="flex gap-2">
                    <input
                        type="text"
                        value={yeniGorev}
                        onChange={(e) => setYeniGorev(e.target.value)}
                        placeholder="Yeni bir görev ekleyin..."
                        className="demo-input"
                    />
                    <button className="btn-blue-submit " type="submit">
                        Ekle
                    </button>
                </form>

                {gorevler.length === 0 ? (
                    <p className="empty-list-text">Henüz görev eklenmemiş.</p>
                ) : (
                    <div className="todo-list-container">
                        {gorevler.map((g) => (
                            <div
                                key={g.id}
                                className={` todo-item ${g.tamamlandi ? "todo-item-completed" : ""}`}

                            // ref={(node) => {
                            //     if (node) {
                            //         itemRefs.current.set(g.id, node);
                            //     } else {
                            //         itemRefs.current.delete(g.id);
                            //     }
                            // }}
                            >
                                <div className="todo-item-left">
                                    <input type="checkbox" checked={g.tamamlandi}
                                        onChange={() => gorevTamamlaToggle(g.id)}
                                        className="todo-checkbox"
                                    />

                                    <span className="todo-item-text">{g.baslik}</span>
                                </div>

                                <button
                                    className="btn-delete-todo"
                                    onClick={() => gorevSil(g.id)}
                                >Sil</button>
                            </div>
                        ))}
                        <div ref={gorevRef} className="h-13"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArrayState;

const Demo7EventHandling = () => {
    const butonaTiklandi = (mesaj) => {
        alert(mesaj)
    }

    const formGonder = (event) => {
        event.preventDefault();
        alert('Form gönderildi, Sayfa Yenilenmedi')
        console.log('input', event.target[0].value)
    }

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold">Demo 7: Olay Yönetimi</h3>
            <div className="mt-4 ">
                <h4 className="font-bold">
                    Buton tıklama olayı
                </h4>
                <div className="flex flex-col">
                    <button onClick={() => butonaTiklandi('Basit tıklama')} className="p-2 bg-blue-500">
                        Tıkla-Mesaj ver
                    </button>
                    <button onClick={() => butonaTiklandi('parametreli tıklama')} className="p-2 bg-green-950">
                        Parametreli tıklama
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="font-bold">Form Olayı</h4>
                <form onSubmit={formGonder} className="p-2 border ">
                    <input type="text" placeholder="Metin girin" className="p-2 border" />
                    <button type="submit" className="p-2 bg-purple-800">Formu gönder</button>
                </form>
            </div>
        </div>
    )
}

export default Demo7EventHandling
const Why = () => {
    const reasons = [
        {
            title: "Kurumsal Yaklaşım",
            description: "Ajans disipliniyle, birebir iletişim avantajı"
        },
        {
            title: "Net Süreç & Teslim",
            description: "Kapsam, süre ve çıktı baştan bellidir"
        },
        {
            title: "Ölçeklenebilir Sistemler",
            description: "Büyüyen işletmelere uyum sağlayan altyapı"
        },
        {
            title: "Şeffaf Fiyatlandırma",
            description: "Sürpriz maliyetler olmadan net teklifler"
        }
    ];

    return (
        <section id="why" className="value-section">
            <div className="container">
                <h2 className="section-title">
                    Neden Algorixa?
                </h2>

                <p className="text-center text-muted mb-5">
                    Algorixa, web sitesi yaptırmak isteyen işletmeler için
                    sadece tasarım değil, sonuç üreten dijital sistemler sunar.
                </p>

                <div className="row g-4">
                    {reasons.map((reason, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="value-card">
                                <h3>{reason.title}</h3>
                                <p>{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Why;

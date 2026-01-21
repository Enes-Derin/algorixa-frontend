const Why = () => {
    const reasons = [
        {

            title: "Hızlı Başlama",
            description: "Uzun planlamalar yerine, hemen harekete geçelim"
        },
        {

            title: "Net Kapsam",
            description: "Başlangıçtan bitiş satırına kadar her şey belli"
        },
        {

            title: "Dayanıklı Sistem",
            description: "Geçici çözümler değil, uzun vadeli sistemler"
        },
        {

            title: "Şeffaf Fiyatlandırma",
            description: "Sürpriz ek maliyetler yok, tamamı net"
        }
    ];

    return (
        <section id="why" className="value-section">
            <div className="container">
                <h2 className="section-title"> Neden Algorixa?</h2>

                <div className="row g-4">
                    {reasons.map((reason, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="value-card">

                                <h5>{reason.title}</h5>
                                <p>{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "40px", padding: "32px", backgroundColor: "#f3f4f6", borderRadius: "14px", textAlign: "center" }}>
                    <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text-muted)", margin: 0 }}>
                        Ajans karmaşası olmadan, net kapsamlı ve kontrollü projeler.
                        <br />
                        Abartı yok, belirsizlik yok. <strong>Sadece çözümler.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Why;

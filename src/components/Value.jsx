const Value = () => {
    return (
        <section className="value-section">
            <div className="container">
                <h2 className="section-title">💎 Neden Algorixa?</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="value-card">
                            <div style={{ fontSize: "32px", marginBottom: "16px" }}>📋</div>
                            <h5>Net Kapsam</h5>
                            <p>Başlangıçtan teslimata kadar sınırları belli projeler.</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="value-card">
                            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🏗️</div>
                            <h5>Sürdürülebilir Yapı</h5>
                            <p>Geçici değil, uzun vadeli kullanılabilir sistemler.</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="value-card">
                            <div style={{ fontSize: "32px", marginBottom: "16px" }}>💬</div>
                            <h5>Şeffaf Süreç</h5>
                            <p>Sürpriz yok. Net iletişim, planlı ilerleme.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Value;

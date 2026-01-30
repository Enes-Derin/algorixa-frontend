const Services = () => {
    return (
        <section id="services" className="section-soft">
            <div className="container">
                <h2 className="section-title">Hizmetler</h2>

                <div className="services-modern-grid">

                    <div className="service-modern">
                        <span className="service-badge">Web</span>
                        <h3>Kurumsal Web Sitesi</h3>
                        <p>
                            Güven veren, hızlı ve SEO uyumlu
                            kurumsal web siteleri.
                        </p>
                    </div>

                    <div className="service-modern highlight">
                        <span className="service-badge">Sistem</span>
                        <h3>Admin Panelli Yazılımlar</h3>
                        <p>
                            İş süreçlerinizi tek panelden
                            yönetin, büyümeye hazır olun.
                        </p>
                    </div>

                    <div className="service-modern">
                        <span className="service-badge">Dönüşüm</span>
                        <h3>Landing Page</h3>
                        <p>
                            Reklamdan maksimum dönüşüm
                            alan satış sayfaları.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Services;

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-grid">
                <div>
                    <span className="hero-badge">
                        Kurumsal Dijital Çözüm Ortağı
                    </span>

                    <h1>
                        İşinizi Büyüten<br />
                        Kurumsal Web & Yazılım Sistemleri
                    </h1>

                    <p>
                        Algorixa, işletmeler için sadece web sitesi değil;
                        satış, güven ve ölçeklenebilirlik sunar.
                    </p>

                    <div className="hero-actions">
                        <a href="#contact" className="btn-primary">
                            Ücretsiz Teklif Al
                        </a>
                        <a href="#projects" className="btn-outline">
                            Referansları İncele
                        </a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card">Kurumsal UI</div>
                    <div className="hero-card">Admin Panel</div>
                </div>
            </div>

        </section>
    );
};

export default Hero;

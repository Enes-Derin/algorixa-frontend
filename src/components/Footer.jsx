const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="container footer-grid">

                {/* BRAND */}
                <div className="footer-brand">
                    <h4>Algorixa</h4>
                    <p>
                        İşletmeler için güven veren, satış odaklı
                        kurumsal web ve yazılım çözümleri.
                    </p>
                </div>

                {/* LINKS */}
                <div className="footer-links">
                    <h6>Hizmetler</h6>
                    <a href="#services">Kurumsal Web</a>
                    <a href="#services">Admin Panel</a>
                    <a href="#services">Landing Page</a>
                </div>

                {/* CONTACT */}
                <div className="footer-links">
                    <h6>İletişim</h6>
                    <a href="mailto:enesderin.contact@gmail.com">
                        enesderin.contact@gmail.com
                    </a>
                    <a href="tel:+905469705451">
                        +90 546 970 54 51
                    </a>

                    {/* INSTAGRAM */}
                    <a
                        href="https://instagram.com/algorixa_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social"
                    >
                        Instagram
                    </a>
                </div>

                {/* CTA */}
                <div className="footer-cta">
                    <h6>Teklif Al</h6>
                    <p>Projenizi 24 saat içinde değerlendirelim.</p>
                    <a href="#contact" className="footer-btn">
                        Ücretsiz Teklif
                    </a>
                </div>

            </div>

            <div className="footer-bottom-modern">
                © 2026 Algorixa — Tüm hakları saklıdır.
            </div>
        </footer>
    );
};

export default Footer;

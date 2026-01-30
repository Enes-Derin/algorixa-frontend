const SeoContent = () => {
    return (
        <section className="seo-section">
            <div className="seo-container seo-grid">

                {/* LEFT – LOGO */}
                <div className="seo-brand">
                    <h2 className="seo-text-logo">ALGORIXA</h2>
                    <span className="seo-tagline">
                        Dijital Hizmet & Çözüm Ortağınız
                    </span>
                </div>

                {/* RIGHT – CONTENT */}
                <div className="seo-content-text">
                    <h3>Kurumsal Dijital Çözümler</h3>
                    <p>
                        Algorixa; İstanbul merkezli olarak hizmet veren,
                        küçük ve orta ölçekli işletmeler için
                        kurumsal web sitesi, admin panelli web uygulamaları
                        ve özel yazılım çözümleri sunan
                        bir dijital çözüm ortağıdır.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default SeoContent;

import Algorixa from "../assets/Algorixa.png";

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <span className="hero-label">
                            Dijital Hizmet & Çözüm Ortağınız
                        </span>

                        <h1 className="hero-title">
                            Kurumsal Web Sitesi ve<br />
                            Admin Panelli Dijital Sistemler
                        </h1>

                        <p className="hero-text">
                            Küçük ve orta ölçekli işletmeler için
                            kurumsal web sitesi, admin panelli web uygulamaları
                            ve sürdürülebilir dijital çözümler geliştiriyorum.
                        </p>

                        <div className="hero-actions">
                            <a href="#contact" className="btn btn-primary-hero text-white">
                                Teklif Al
                            </a>
                            <a href="#services" className="btn btn-secondary-hero">
                                Hizmetler
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-6 mt-5 mt-lg-0">
                        <div className="hero-mockup">
                            <img src={Algorixa} alt="Softra Digital Solutions" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

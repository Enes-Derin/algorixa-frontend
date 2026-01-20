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
                            Net kapsamlı,<br />
                            sürdürülebilir dijital sistemler
                        </h1>

                        <p className="hero-text">
                            Plansız projeler ve yarım teslimatlar yerine;
                            uzun vadeli, yönetilebilir ve sorunsuz
                            dijital çözümler sunuyorum.
                        </p>

                        <div className="hero-actions">
                            <a href="#contact" className="btn btn-dark btn-lg">
                                Teklif Al
                            </a>
                            <a href="#services" className="btn btn-outline-dark btn-lg">
                                Hizmetler
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-6 mt-5 mt-lg-0">
                        <img src={Algorixa} alt="Softra Digital Solutions" style={{ width: '100%', maxWidth: '500px' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

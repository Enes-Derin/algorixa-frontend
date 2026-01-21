const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h5>Algorixa</h5>
                        <p style={{ color: "#d1d5db", fontSize: "14px" }}>
                            Dijital hizmet ve çözüm ortağınız
                        </p>
                    </div>

                    <div className="col-md-4">
                        <h5>İletişim</h5>
                        <a href="mailto:enesderin.contact@gmail.com">
                            enesderin.contact@gmail.com
                        </a>
                        <br />
                        <a href="tel:+905469705451">
                            +90 546 970 54 51
                        </a>

                    </div>

                    <div className="col-md-4">
                        <h5>Sayfalar</h5>
                        <a href="#services">Hizmetler</a><br />
                        <a href="#projects">Projeler</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 Algorixa. Tüm hakları saklıdır.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import { motion } from "framer-motion";

const SeoContent = () => {
    return (
        <section className="seo-section">
            <div className="seo-container seo-grid">
                {/* LEFT – LOGO */}
                <motion.div
                    className="seo-brand"
                    initial={{ opacity: 0, x: -80, rotateY: -20 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    <h2 className="seo-text-logo">ALGORIXA</h2>
                    <span className="seo-tagline text-white">
                        Dijital Hizmet & Çözüm Ortağınız
                    </span>
                </motion.div>

                {/* RIGHT – CONTENT */}
                <motion.div
                    className="seo-content-text"
                    initial={{ opacity: 0, x: 80, rotateY: 20 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    <h3>Kurumsal Dijital Çözümler</h3>
                    <p>
                        Algorixa; İstanbul merkezli olarak hizmet veren,
                        küçük ve orta ölçekli işletmeler için
                        kurumsal web sitesi, admin panelli web uygulamaları
                        ve özel yazılım çözümleri sunan
                        bir dijital çözüm ortağıdır. Ajans karmaşası olmadan doğrudan geliştirici ile çalışarak,
                        hızlı, güvenilir ve ölçeklenebilir dijital sistemlere
                        sahip olmanızı sağlar.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default SeoContent;
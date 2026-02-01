import { motion } from "framer-motion";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const itemVariants = {
        hidden: { opacity: 0, y: 60, rotateX: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.9,
                delay: i * 0.15,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        })
    };

    return (
        <footer className="footer-modern">
            <div className="container footer-grid">
                {/* BRAND */}
                <motion.div
                    className="footer-brand"
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                >
                    <h4>Algorixa</h4>
                    <p>
                        İşletmeler için güven veren, satış odaklı
                        kurumsal web ve yazılım çözümleri. Modern teknolojilerle
                        dijital dönüşümünüzde yanınızdayız.
                    </p>
                </motion.div>

                {/* LINKS */}
                <motion.div
                    className="footer-links"
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                >
                    <h6>Hizmetler</h6>
                    <a href="#services">Kurumsal Web Sitesi</a>
                    <a href="#services">Admin Panel Sistemleri</a>
                    <a href="#services">Landing Page Tasarımı</a>
                    <a href="#services">Özel Yazılım Geliştirme</a>
                </motion.div>

                {/* CONTACT */}
                <motion.div
                    className="footer-links"
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                >
                    <h6>İletişim</h6>
                    <a href="mailto:enesderin.contact@gmail.com">
                        <FaEnvelope />enesderin.contact@gmail.com
                    </a>
                    <a href="tel:+905469705451">
                        <FiPhone /> +90 546 970 54 51
                    </a>
                    <a
                        href="https://instagram.com/algorixa_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social"
                    >
                        <FaInstagram /> Instagram
                    </a>
                    <a
                        href="https://wa.me/905469705451"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social"
                    >
                        <FaWhatsapp /> WhatsApp
                    </a>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="footer-cta"
                    custom={3}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                >
                    <h6>Teklif Al</h6>
                    <p>Projenizi 24 saat içinde değerlendirelim.</p>
                    <motion.a
                        href="#contact"
                        className="footer-btn"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Ücretsiz Teklif
                    </motion.a>
                </motion.div>
            </div>

            <motion.div
                className="footer-bottom-modern"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                © {currentYear} Algorixa — Tüm hakları saklıdır. | İstanbul, Türkiye
            </motion.div>
        </footer>
    );
};

export default Footer;
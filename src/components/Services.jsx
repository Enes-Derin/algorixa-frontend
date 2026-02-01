import { motion } from "framer-motion";

const Services = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 80, rotateX: 25, scale: 0.9 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                duration: 0.9,
                delay: i * 0.2,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        })
    };

    return (
        <section id="services" className="section-soft">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 70, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    Hizmetler
                </motion.h2>

                <div className="services-modern-grid">
                    <motion.div
                        className="service-modern"
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariants}
                        whileHover={{ y: -20, scale: 1.03 }}
                    >
                        <span className="service-badge">Web</span>
                        <h3>Kurumsal Web Sitesi</h3>
                        <p>
                            Güven veren, hızlı ve SEO uyumlu
                            kurumsal web siteleri.
                        </p>
                    </motion.div>

                    <motion.div
                        className="service-modern highlight"
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariants}
                        whileHover={{ y: -20, scale: 1.03 }}
                    >
                        <span className="service-badge">Sistem</span>
                        <h3>Admin Panelli Yazılımlar</h3>
                        <p>
                            İş süreçlerinizi tek panelden
                            yönetin, büyümeye hazır olun.
                        </p>
                    </motion.div>

                    <motion.div
                        className="service-modern"
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariants}
                        whileHover={{ y: -20, scale: 1.03 }}
                    >
                        <span className="service-badge">Dönüşüm</span>
                        <h3>Landing Page</h3>
                        <p>
                            Reklamdan maksimum dönüşüm
                            alan satış sayfaları.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Services;
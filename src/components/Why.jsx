import { motion } from "framer-motion";

const Why = () => {
    const reasons = [
        {
            title: "Kurumsal Yaklaşım",
            description: "Ajans disipliniyle, birebir iletişim avantajı"
        },
        {
            title: "Net Süreç & Teslim",
            description: "Kapsam, süre ve çıktı baştan bellidir"
        },
        {
            title: "Ölçeklenebilir Sistemler",
            description: "Büyüyen işletmelere uyum sağlayan altyapı"
        },
        {
            title: "Şeffaf Fiyatlandırma",
            description: "Sürpriz maliyetler olmadan net teklifler"
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, x: -100, rotateY: -35 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            rotateY: 0,
            transition: {
                duration: 0.9,
                delay: i * 0.15,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        })
    };

    return (
        <section id="why" className="value-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 70, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    Neden Algorixa?
                </motion.h2>

                <motion.p
                    className="text-center text-white mb-5"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                >
                    Algorixa, web sitesi yaptırmak isteyen işletmeler için
                    sadece tasarım değil, sonuç üreten dijital sistemler sunar.
                </motion.p>

                <div className="row g-4">
                    {reasons.map((reason, index) => (
                        <div className="col-md-6" key={index}>
                            <motion.div
                                className="value-card"
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={cardVariants}
                                whileHover={{ y: -12, scale: 1.02 }}
                            >
                                <h3>{reason.title}</h3>
                                <p>{reason.description}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Why;
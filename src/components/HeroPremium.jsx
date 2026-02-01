import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaShieldAlt, FaClock, FaTrophy } from "react-icons/fa";

const HeroPremium = () => {
    const [particles, setParticles] = useState([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Particle system - reduced to 20 particles
    useEffect(() => {
        const particleArray = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 2,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 3
        }));
        setParticles(particleArray);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.05);
        mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.05);
    };

    // const stats = [
    //     { value: "50+", label: "Proje", icon: "🚀" },
    //     { value: "%98", label: "Memnuniyet", icon: "⭐" },
    //     { value: "24h", label: "Destek", icon: "⚡" }
    // ];

    const trustBadges = [
        { icon: FaShieldAlt, label: "SSL Güvenli" },
        { icon: FaClock, label: "Hızlı Çözüm" },
        { icon: FaTrophy, label: "Firmaya Özel Tasarım" }
    ];

    return (
        <section className="hero-premium" onMouseMove={handleMouseMove}>
            {/* Animated particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        initial={{
                            x: `${particle.x}vw`,
                            y: `${particle.y}vh`,
                            opacity: 0
                        }}
                        animate={{
                            x: [`${particle.x}vw`, `${particle.x + 15}vw`, `${particle.x}vw`],
                            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: particle.size,
                            height: particle.size
                        }}
                    />
                ))}
            </div>

            {/* Gradient background animation */}
            <motion.div
                className="hero-premium-gradient"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(212, 182, 118, 0.12) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(212, 182, 118, 0.12) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(212, 182, 118, 0.12) 0%, transparent 50%)"
                    ]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container hero-premium-content">
                <div className="hero-premium-grid">
                    {/* Left content */}
                    <div className="hero-premium-left">
                        <motion.span
                            className="hero-premium-badge"
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Kurumsal Dijital Çözüm Ortağı
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-white"
                        >
                            İşinizi Büyüten<br />
                            <span className="gradient-text">Kurumsal Web & Yazılım</span>
                        </motion.h1>

                        <motion.p
                            className="hero-premium-desc"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            Algorixa ile sadece web sitesi değil; ölçülebilir sonuçlar,
                            artan satışlar ve profesyonel dijital varlık kazanın.
                        </motion.p>

                        {/* Stats bar - Single Row */}
                        <motion.div
                            className="hero-stats-inline"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            {/* {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="stat-inline-item"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="stat-icon">{stat.icon}</span>
                                    <div className="stat-text">
                                        <div className="stat-value">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))} */}
                        </motion.div>

                        <motion.div
                            className="hero-premium-actions"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            <motion.a
                                href="#contact"
                                className="btn-premium-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Ücretsiz Analiz Al
                            </motion.a>
                            <motion.a
                                href="#portfolio"
                                className="btn-premium-outline"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Portföyü İncele
                            </motion.a>
                        </motion.div>

                        {/* Trust badges - Compact */}
                        <motion.div
                            className="trust-badges-compact"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            {trustBadges.map((badge, index) => (
                                <div key={index} className="trust-badge-compact">
                                    <badge.icon className="trust-icon-compact" />
                                    <span>{badge.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right - Compact 3D cards */}
                    <motion.div
                        className="hero-premium-visual-compact"
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.5 }}
                    >
                        <motion.div
                            className="hero-3d-card-compact card-top"
                            style={{
                                rotateY: x,
                                rotateX: y
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="card-glow"></div>
                            <h4>Kurumsal Arayüz</h4>
                            <p>Müşteri odaklı tasarımlar</p>
                        </motion.div>

                        <motion.div
                            className="hero-3d-card-compact card-middle"
                            style={{
                                rotateY: x.get() * -0.5,
                                rotateX: y.get() * 0.5
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="card-glow"></div>
                            <h4>Hızlı & SEO</h4>
                            <p>Yüksek dönüşüm garantisi</p>
                        </motion.div>

                        <motion.div
                            className="hero-3d-card-compact card-bottom"
                            style={{
                                rotateY: x.get() * 0.3,
                                rotateX: y.get() * -0.3
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="card-glow"></div>
                            <h4>Admin Panel</h4>
                            <p>Kolay yönetim sistemi</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroPremium;
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Testimonials = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.3
    });

    const testimonials = [
        {
            name: "Mehmet Bey",
            role: "Servis Müdürü",
            avatar: "MB",
            message: "FixTrack ile servis süreçlerimiz tamamen dijitalleşti. Manuel hataları %90 azalttık.",
            time: ""
        },
        {
            name: "Ayşe Hanım",
            role: "Cafe Sahibi",
            avatar: "AH",
            message: "Dijitalde var olmak bizim için çok önemliydi. Algorixa sayesinde harika bir web sitemiz oldu.",
            time: ""
        },
        {
            name: "Enes Bey",
            role: "Yazılım Geliştirme Uzmanı",
            avatar: "EB",
            message: "Portfolyo sitesi sayesinde aldığım iş teklifleri 4 katına çıktı. Çok daha profesyonel görünüyorum.",
            time: ""
        },
        {
            name: "Ahmet Bey",
            role: "Deep Building",
            avatar: "AB",
            message: "Web sitesi sayesinde çok daha profesyonel görünüyoruz. Müşteriler bize daha fazla güveniyor.",
            time: ""
        },

    ];

    // 2 kez tekrarla - daha hızlı scroll için
    const doubleTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="testimonials-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Müşteri Yorumları
                </motion.h2>

                <motion.p
                    className="text-center mb-5"
                    style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 50px', color: 'var(--text-secondary)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Algorixa ile çalışan işletmelerin gerçek deneyimleri
                </motion.p>
            </div>

            <motion.div
                ref={ref}
                className="testimonials-container"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="testimonials-scroll-fast">
                    {doubleTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card-minimal"
                        >
                            <div className="testimonial-header-minimal">
                                <div className="testimonial-avatar-minimal">
                                    {testimonial.avatar}
                                </div>
                                <div className="testimonial-info-minimal">
                                    <div className="testimonial-name-minimal">
                                        {testimonial.name}
                                    </div>
                                    <div className="testimonial-role-minimal">
                                        {testimonial.role}
                                    </div>
                                </div>
                                <span className="testimonial-verified-minimal">✓</span>
                            </div>

                            <div className="testimonial-message-minimal">
                                <p>{testimonial.message}</p>
                            </div>

                            <div className="testimonial-time-minimal">
                                {testimonial.time}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Testimonials;
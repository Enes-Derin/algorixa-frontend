import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes, FaQuoteLeft, FaExternalLinkAlt } from "react-icons/fa";

const PortfolioShowcase = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProject, setSelectedProject] = useState(null);
    const [sliderPosition, setSliderPosition] = useState(50);

    const categories = [
        { id: "all", name: "Tümü", icon: "" },
        { id: "custom", name: "Özel Yazılım", icon: "" },
        { id: "corporate", name: "Kurumsal", icon: "" },
        { id: "personal", name: "Kişisel", icon: "" }
    ];

    const projects = [
        {
            id: 1,
            title: "FixTrack | Servis Yönetim Sistemi",
            category: "custom",
            before: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            stats: {
                "Verimlilik": "+85%",
                "Hata Azalma": "%94"
            },
            description: "Servis işlemlerinin günlük operasyonlarını daha düzenli, daha güvenilir ve daha kontrol edilebilir hale getirmek amacıyla geliştirilen özel kurumsal servis yönetim yazılımı.",
            testimonial: {
                text: "FixTrack sayesinde tüm servis süreçlerimiz dijitalleşti. Manuel hataları %90 azalttık ve müşteri memnuniyeti rekor seviyeye ulaştı.",
                author: "Mehmet Bey",
                role: "Servis Müdürü"
            },
            features: [
                "Merkezi Servis Yönetimi",
                "Dijital İmza Altyapısı",
                "Otomatik PDF Oluşturma",
                "Müşteri & Teknisyen Portalı",
                "Kağıtsız Operasyon"
            ]
        },
        {
            id: 2,
            title: "Cafe Modern | Admin Panelli Cafe Sitesi",
            category: "corporate",
            before: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
            link: "https://cafe-modern-frontend.vercel.app/",
            stats: {
                "Marka Değeri": "+180%",
                "Sosyal Etkileşim": "+320%"
            },
            description: "Kafe ve restoran markalarının dijitalde daha çekici, daha profesyonel ve daha akılda kalıcı görünmesini sağlamak amacıyla geliştirilmiş admin panelli modern cafe web sitesi.",
            testimonial: {
                text: "Web sitesi açıldığından beri rezervasyonlarımız 3 katına çıktı. Müşteriler artık sosyal medyada paylaşım yapıyor!",
                author: "Ayşe Hanım",
                role: "Cafe Sahibi"
            },
            features: [
                "Modern Estetik Tasarım",
                "Menü Yönetim Paneli",
                "Mobil Uyumlu Yapı",
                "Rezervasyon Sistemi",
                "Galeri Yönetimi"
            ]
        },
        {
            id: 3,
            title: "Kişisel Portfolyo | Modern Web Sitesi",
            category: "personal",
            before: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
            link: "https://www.enesderin.com.tr",
            stats: {
                "İş Teklifi": "+420%",
                "Profesyonel İmaj": "+300%",
                "İletişim": "+280%"
            },
            description: "Bireysel yetkinlikleri ve yapılan çalışmaları dijitalde net, sade ve profesyonel bir şekilde sunmak amacıyla tasarlanmış kişisel portfolyo web sitesi.",
            testimonial: {
                text: "Portfolyo sitesi açıldıktan sonra aldığım iş teklifleri 4 katına çıktı. Artık çok daha profesyonel görünüyorum.",
                author: "Enes Bey",
                role: "Full Stack Developer"
            },
            features: [
                "Minimal Modern Tasarım",
                "Proje Vitrini",
                "Hızlı & SEO Uyumlu",
                "İletişim Sistemi",
                "Mobil Optimizasyon"
            ]
        },
        {
            id: 4,
            title: "Deep Building | Kurumsal İnşaat Web Sitesi",
            category: "corporate",
            before: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
            link: "https://deep-building.vercel.app/",
            stats: {
                "Teklif Talepleri": "+380%",
                "Marka Güvenilirliği": "+250%",
                "Proje Görünürlüğü": "+340%"
            },
            description: "İnşaat sektöründe faaliyet gösteren firmaların dijitalde daha güvenilir, daha prestijli ve daha profesyonel görünmesi amacıyla geliştirilmiş admin panelli kurumsal web sitesi.",
            testimonial: {
                text: "Web sitesi sayesinde çok daha profesyonel görünüyoruz. Müşteriler artık bize daha fazla güveniyor ve teklif talepleri arttı.",
                author: "Ahmet Bey",
                role: "Genel Müdür, Deep Building"
            },
            features: [
                "Kurumsal Tasarım Dili",
                "Proje Galerisi",
                "Admin Panel",
                "İletişim Yönetimi",
                "SEO Optimizasyonu"
            ]
        }
    ];

    const filteredProjects = selectedCategory === "all"
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    return (
        <section id="portfolio" className="portfolio-showcase-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                >
                    🏆 Başarı Hikayeleri
                </motion.h2>

                <motion.p
                    className="text-center text-white mb-5"
                    style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 60px' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Gerçek projeler, gerçek sonuçlar. İşletmelerin dijital dönüşüm yolculuğuna tanık olun.
                </motion.p>

                {/* Category Filter */}
                <motion.div
                    className="portfolio-filters"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="filter-icon">{cat.icon}</span>
                            <span>{cat.name}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <div className="portfolio-grid">
                    <AnimatePresence mode="wait">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="portfolio-item"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => setSelectedProject(project)}
                                whileHover={{ y: -10 }}
                            >
                                {/* Before/After Preview */}
                                <div className="portfolio-preview">
                                    <div className="before-after-wrapper">
                                        <img src={project.before} alt="Before" className="before-img" />
                                        <img
                                            src={project.after}
                                            alt="After"
                                            className="after-img"
                                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                        />
                                        <div className="ba-slider-line" style={{ left: `${sliderPosition}%` }}>
                                            <div className="ba-slider-handle">
                                                <FaArrowRight />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="portfolio-overlay">
                                        <button className="view-details-btn">
                                            Detayları Gör <FaArrowRight />
                                        </button>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="portfolio-info">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>

                                    {/* Stats */}
                                    <div className="portfolio-stats">
                                        {Object.entries(project.stats).map(([key, value]) => (
                                            <div key={key} className="stat">
                                                <div className="stat-value">{value}</div>
                                                <div className="stat-key">{key}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="portfolio-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className="portfolio-modal"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close"
                                onClick={() => setSelectedProject(null)}
                            >
                                <FaTimes />
                            </button>

                            <div className="modal-content">
                                {/* Interactive Before/After Slider */}
                                <div className="modal-slider">
                                    <div className="before-after-container">
                                        <img src={selectedProject.before} alt="Before" />
                                        <img
                                            src={selectedProject.after}
                                            alt="After"
                                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sliderPosition}
                                            onChange={(e) => setSliderPosition(e.target.value)}
                                            className="ba-slider"
                                        />
                                        <div className="ba-labels">
                                            <span className="before-label">ÖNCE</span>
                                            <span className="after-label">SONRA</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="modal-details">
                                    <h2>{selectedProject.title}</h2>
                                    <p className="project-desc">{selectedProject.description}</p>

                                    {/* Big Stats */}
                                    <div className="modal-stats">
                                        {Object.entries(selectedProject.stats).map(([key, value]) => (
                                            <div key={key} className="modal-stat">
                                                <div className="stat-value-big">{value}</div>
                                                <div className="stat-label">{key}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Features */}
                                    <div className="modal-features">
                                        <h4>✨ Özellikler</h4>
                                        <div className="features-list">
                                            {selectedProject.features.map((feature, i) => (
                                                <span key={i} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <div className="modal-testimonial">
                                        <FaQuoteLeft className="quote-icon" />
                                        <p className="testimonial-text">{selectedProject.testimonial.text}</p>
                                        <div className="testimonial-author">
                                            <strong>{selectedProject.testimonial.author}</strong>
                                            <span>{selectedProject.testimonial.role}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        {selectedProject.link && (
                                            <motion.a
                                                href={selectedProject.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-start-project"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ flex: 1 }}
                                            >
                                                <FaExternalLinkAlt /> Siteyi Ziyaret Et
                                            </motion.a>
                                        )}
                                        <motion.a
                                            href="#contact"
                                            className="btn-start-project"
                                            onClick={() => setSelectedProject(null)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{ flex: 1, background: 'rgba(212, 182, 118, 0.12)', border: '1.5px solid var(--border-medium)', color: 'var(--brand-main)' }}
                                        >
                                            Benzer Proje İste
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioShowcase;
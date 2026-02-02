import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes, FaExternalLinkAlt, FaCheckCircle, FaLightbulb } from "react-icons/fa";

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
            type: "Örnek Çalışma",
            before: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            impactInfo: {
                "Hedef": "Kağıtsız İşletme",
                "Etki": "Tam Otomasyon",
                "Değer": "Yüksek Verimlilik"
            },
            problem: "Servis firmalarında kağıt iş emirleri, kayıp formlar, teknisyen takibi zorluğu ve müşteri iletişiminde kopukluk",
            solution: "Tüm servis sürecinizi dijitalleştiren merkezi yönetim sistemi. Formdan raporlamaya her şey tek platformda.",
            description: "Servis sektörü için geliştirilmiş tam entegre yönetim platformu. Servis kabul formundan, teknisyen atamasına, dijital imzalı teslimat belgelerine kadar tüm süreç dijital ortamda yönetiliyor.",
            businessValue: "Kağıt form maliyetlerini sıfırlayın, kayıp belge sorununu ortadan kaldırın, müşterilerinize anında bilgilendirme yapın ve tüm iş geçmişinizi raporlayabilin.",
            features: [
                "📋 Dijital Servis Kabul Formu",
                "👨‍🔧 Teknisyen Görev Yönetimi",
                "✍️ Tablet Üzerinden Dijital İmza",
                "📄 Otomatik PDF Belge Oluşturma",
            ],
            results: [
                "Kağıt maliyet tasarrufu",
                "Müşteri memnuniyeti artışı",
                "Hızlı belge erişimi",
                "Profesyonel görünüm",
                "Veriye dayalı karar alma"
            ],
            targetAudience: "Elektronik servisi, beyaz eşya servisi, telefon tamir, bilgisayar servisi işletmeleri için ideal"
        },
        {
            id: 2,
            title: "Cafe Modern | Dinamik Restoran Sitesi",
            category: "corporate",
            type: "Örnek Çalışma",
            before: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
            link: "https://cafe-modern-frontend.vercel.app/",
            impactInfo: {
                "Hedef": "Bağımsız Yönetim",
                "Etki": "Sınırsız Güncelleme",
                "Değer": "Maliyet Tasarrufu"
            },
            problem: "Restoranlar menülerini güncelleyemiyor, fotoğrafları değiştirmek için tasarımcıya bağımlı, rezervasyonlar telefonda karışıyor",
            solution: "Kendiniz yönetebileceğiniz admin panelli dinamik web sitesi. Menü, fiyat, fotoğraf değişikliklerini 2 dakikada yapın.",
            description: "Yemek sektörü için geliştirilmiş, tamamen yönetilebilir web sitesi. Menünüzü, fiyatlarınızı, görselerinizi ve etkinliklerinizi admin panelinden kolayca güncelleyin.",
            businessValue: "Her değişiklik için ödeme yapmayın, menü güncellemelerini anında yapın, müşterileriniz online rezervasyon yapabilsin, sosyal medyada paylaşılabilir modern tasarım.",
            features: [
                "🍽️ Dinamik Menü Yönetimi",
                "💰 Kolay Fiyat Güncelleme",
                "📸 Galeri & Görsel Yönetimi",
                "✏️ Kullanımı Kolay Admin Panel",
            ],
            results: [
                "Tasarımcı bağımlılığı sıfır",
                "Anında menü güncellemeleri",
                "Profesyonel marka imajı",
                "Sosyal medya entegrasyonu"
            ],
            targetAudience: "Kafe, restoran, pastane, fast food zincirleri için ideal"
        },
        {
            id: 3,
            title: "Kişisel Portfolyo | Profesyonel Vitrin",
            category: "personal",
            type: "Canlı Proje",
            before: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
            link: "https://www.enesderin.com.tr",
            impactInfo: {
                "Hedef": "Dijital Kimlik",
                "Etki": "Güçlü İlk İzlenim",
                "Değer": "Marka Değeri"
            },
            problem: "Freelancer ve profesyoneller CV gönderiyor ama işlerini gösteremiyor, referansları karışık, iletişim bilgileri güncel değil",
            solution: "Çalışmalarınızı sergileyen, referanslarınızı düzenli gösteren, iletişim kolaylığı sağlayan dijital kartvizit.",
            description: "Profesyoneller için tasarlanmış kişisel marka sitesi. Projelerinizi, yeteneklerinizi ve referanslarınızı düzenli ve etkileyici şekilde sergileyin.",
            businessValue: "CV yerine portfolyo sitesi gönderin, potansiyel müşteriler çalışmalarınızı görsün, Google'da adınızla çıkın, profesyonel imaj oluşturun.",
            features: [
                "💼 Proje Galerisi & Vitrin",
                "📝 Hakkımda & Yetenekler",
                "💬 Referans & Tavsiyeler",
                "📧 Direkt İletişim Formu",
                "🔍 SEO Optimizasyonu",
                "📱 Tam Mobil Uyumluluk"
            ],
            results: [
                "Profesyonel ilk izlenim",
                "İş teklifleri artışı",
                "Google görünürlüğü",
                "Kolay referans paylaşımı",
                "7/24 ulaşılabilirlik"
            ],
            targetAudience: "Freelancer, danışman, mimar, fotoğrafçı, tasarımcı, yazılımcı için ideal"
        },
        {
            id: 4,
            title: "Deep Building | İnşaat Kurumsal Sitesi",
            category: "corporate",
            type: "Örnek Çalışma",
            before: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
            after: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
            link: "https://deep-building.vercel.app/",
            impactInfo: {
                "Hedef": "Güven & Prestij",
                "Etki": "Online Portföy",
                "Değer": "Nitelikli Müşteri"
            },
            problem: "İnşaat firmaları projelerini gösteremiyor, referanslar eski, WhatsApp'tan görsel gönderiliyor, ciddiyet eksik",
            solution: "Projelerinizi profesyonelce sergileyen, referanslarınızı düzenli gösteren, teklif talepleri alan kurumsal site.",
            description: "İnşaat ve gayrimenkul sektörü için geliştirilmiş, tam yönetilebilir kurumsal platform. Tamamlanan projelerinizi, devam eden işlerinizi ve referanslarınızı etkileyici şekilde sergileyin.",
            businessValue: "Müşteri güveni kazanın, projelerinizi katalog gibi gösterin, online teklif alın, rakiplerinizden daha profesyonel görünün.",
            features: [
                "🏗️ Proje Portföyü Galerisi",
                "📐 Hizmet & Uzmanlık Alanları",
                "⭐ Referans & Müşteri Yorumları",
                "📋 Online Teklif Talep Formu",
                "🖼️ Önce/Sonra Görselleri",
                "✏️ Kolay İçerik Yönetimi"
            ],
            results: [
                "Kurumsal güvenilirlik",
                "Nitelikli teklif talepleri",
                "Profesyonel sunum",
                "Dijital referans portföyü",
                "7/24 erişilebilir katalog"
            ],
            targetAudience: "İnşaat firması, müteahhit, tadilat, dekorasyon, peyzaj işletmeleri için ideal"
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
                    💼 Referans Projeler
                </motion.h2>

                <motion.p
                    className="text-center text-white mb-5"
                    style={{ fontSize: '16px', maxWidth: '750px', margin: '0 auto 30px' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Gerçek iş problemlerine ürettiğimiz dijital çözümler. Her proje, bir işletmenin hangi sorununu nasıl çözdüğümüzü gösteriyor.
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
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            background: 'rgba(0,0,0,0.7)',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            color: 'rgba(255,255,255,0.8)'
                                        }}>
                                            {project.type}
                                        </div>
                                        <button className="view-details-btn">
                                            Hangi Sorunu Çözüyor? <FaArrowRight />
                                        </button>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="portfolio-info">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>

                                    {/* Impact Info */}
                                    <div className="portfolio-stats">
                                        {Object.entries(project.impactInfo).map(([key, value]) => (
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
                                            <span className="before-label">SORUN</span>
                                            <span className="after-label">ÇÖZÜM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="modal-details">
                                    <div style={{
                                        display: 'inline-block',
                                        background: 'rgba(212, 182, 118, 0.12)',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        color: 'var(--brand-main)',
                                        marginBottom: '16px',
                                        border: '1px solid rgba(212, 182, 118, 0.2)'
                                    }}>
                                        {selectedProject.type}
                                    </div>

                                    <h2>{selectedProject.title}</h2>

                                    {/* Problem */}
                                    <div style={{
                                        background: 'rgba(255, 82, 82, 0.08)',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        borderLeft: '3px solid #ff5252',
                                        marginTop: '20px',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{ fontSize: '13px', color: '#ff8a80', marginBottom: '6px', fontWeight: '600' }}>
                                            ❌ Sorun
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                                            {selectedProject.problem}
                                        </div>
                                    </div>

                                    {/* Solution */}
                                    <div style={{
                                        background: 'rgba(76, 175, 80, 0.08)',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        borderLeft: '3px solid #4caf50',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{ fontSize: '13px', color: '#81c784', marginBottom: '6px', fontWeight: '600' }}>
                                            ✅ Çözüm
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                                            {selectedProject.solution}
                                        </div>
                                    </div>

                                    {/* Impact Info Cards */}
                                    <div className="modal-stats">
                                        {Object.entries(selectedProject.impactInfo).map(([key, value]) => (
                                            <div key={key} className="modal-stat">
                                                <div className="stat-value-big">{value}</div>
                                                <div className="stat-label">{key}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Features */}
                                    <div className="modal-features">
                                        <h4>⚙️ Özellikler & İşlevler</h4>
                                        <div className="features-list">
                                            {selectedProject.features.map((feature, i) => (
                                                <span key={i} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Results */}
                                    <div className="modal-features" style={{ marginTop: '24px' }}>
                                        <h4><FaCheckCircle style={{ marginRight: '8px' }} />Kazanımlar</h4>
                                        <div className="features-list">
                                            {selectedProject.results.map((result, i) => (
                                                <span
                                                    key={i}
                                                    className="feature-tag"
                                                    style={{
                                                        background: 'rgba(76, 175, 80, 0.1)',
                                                        borderColor: 'rgba(76, 175, 80, 0.3)',
                                                        color: '#81c784'
                                                    }}
                                                >
                                                    {result}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Target Audience */}
                                    <div style={{
                                        background: 'rgba(212, 182, 118, 0.05)',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        marginTop: '24px',
                                        borderLeft: '3px solid var(--brand-main)'
                                    }}>
                                        <div style={{ fontSize: '13px', color: 'var(--brand-main)', marginBottom: '6px', fontWeight: '600' }}>
                                            <FaLightbulb style={{ marginRight: '6px' }} />
                                            Kimin İçin?
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                                            {selectedProject.targetAudience}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '32px' }}>
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
                                                <FaExternalLinkAlt /> Canlı Demo
                                            </motion.a>
                                        )}
                                        <motion.a
                                            href="#contact"
                                            className="btn-start-project"
                                            onClick={() => setSelectedProject(null)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                flex: 1,
                                                background: 'rgba(212, 182, 118, 0.12)',
                                                border: '1.5px solid var(--border-medium)',
                                                color: 'var(--brand-main)'
                                            }}
                                        >
                                            Benzer Çözüm İstiyorum
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
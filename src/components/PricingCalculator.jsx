import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaInfoCircle, FaRocket } from "react-icons/fa";

const PricingCalculator = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [showPages, setShowPages] = useState(null);

    /* ======================= PAKETLER (Satış Odaklı) ======================= */
    const packages = [
        {
            id: "landing",
            name: "Landing Page",
            price: 6000,
            badge: "Hızlı Başlangıç",
            color: "#10b981",
            icon: "",
            description: "Tek sayfalık tanıtım sitesi",
            ideal: "Yeni başlayanlar, kampanya ve etkinlik siteleri",
            pages: [
                "Hero Bölümü (Ana Görsel + Başlık)",
                "Hizmetler/Ürünler Tanıtımı",
                "Referanslar/Galeri Bölümü",
                "İletişim Formu",
                "Sosyal Medya Linkleri"
            ],
            features: [
                "Özel Tasarım",
                "Mobil Uyumlu & Responsive",
                "Temel SEO Optimizasyonu",
                "İletişim Formu Entegrasyonu",
                "WhatsApp Direkt Bağlantı",
                "Google Analytics Kurulumu",
                "SSL Sertifikası Dahil"
            ],
            deliveryTime: "5-7 İş Günü",
            support: "Teslim Sonrası Teknik Destek",
            extraPagePrice: "Ek sayfa ihtiyacı için görüşme gerekir"
        },
        {
            id: "corporate-basic",
            name: "Kurumsal Web (Statik)",
            price: 11900,
            badge: "Ekonomik",
            color: "#3b82f6",
            icon: "",
            description: "Admin panelsiz, profesyonel kurumsal site",
            ideal: "Sabit içerikli, küçük-orta ölçekli firmalar",
            pages: [
                "Ana Sayfa",
                "Hakkımızda",
                "Hizmetlerimiz/Ürünlerimiz",
                "Referanslar/Projeler",
                "Blog (Statik - 5 Yazı)",
                "İletişim",
                "KVKK & Gizlilik Politikası"
            ],
            features: [
                "Profesyonel Tasarım",
                "❌ Admin Panel Yok (Statik İçerik)",
                "Gelişmiş SEO Optimizasyonu",
                "Hızlı Yükleme Garantisi",
                "E-posta Entegrasyonu",
                "Google Maps Entegrasyonu"
            ],
            deliveryTime: "10-12 İş Günü",
            support: "Teslim Sonrası Teknik Destek",
            extraPagePrice: "Ek sayfa: ₺1.500/sayfa",
            note: "İçerik güncellemeleri için bize ulaşabilirsiniz"
        },
        {
            id: "corporate-admin",
            name: "Kurumsal Web (Dinamik)",
            price: 21900,
            badge: "En Popüler",
            color: "#f59e0b",
            icon: "",
            description: "Admin panelli, tam yönetilebilir site",
            ideal: "İçerik yönetimi isteyen aktif firmalar",
            pages: [
                "Ana Sayfa",
                "Hakkımızda",
                "Hizmetler/Ürünler (Dinamik)",
                "Referanslar/Portfolyo (Dinamik)",
                "Blog Sistemi (Sınırsız Yazı)",
                "Galeri Yönetimi",
                "İletişim & Teklif Formu",
                "KVKK & Yasal Sayfalar",
                "Duyurular Modülü",
                "SSS (Sık Sorulan Sorular)"
            ],
            features: [
                "Profesyonel Tasarım",
                "✅ Tam Özellikli Admin Panel",
                "İçerik Yönetim Sistemi (CMS)",
                "Dinamik Blog & Haber Modülü",
                "Galeri & Medya Yönetimi",
                "Gelişmiş SEO Araçları",
                "Form Yönetimi & Mail Bildirimleri",
                "Güvenli Panel Girişi"
            ],
            deliveryTime: "15-20 İş Günü",
            support: "Teslim Sonrası Teknik Destek + Panel Eğitimi",
            extraPagePrice: "Ek sayfa: ₺2.000/sayfa",
            note: "Tüm içerikleri kendiniz yönetebilirsiniz"
        },
        {
            id: "professional",
            name: "Özel Yazılım Çözümü",
            price: 49900,
            badge: "Premium",
            color: "#8b5cf6",
            icon: "",
            description: "İhtiyacınıza özel yazılım geliştirme",
            ideal: "Özel ihtiyaçları olan işletmeler ve kurumlar",
            pages: [
                "Özel UI/UX Tasarımı",
                "İhtiyaca Özel Modüller",
                "Entegrasyon Gerektiren Sistemler",
                "API Geliştirme"
            ],
            features: [
                "Tamamen Özel Yazılım Geliştirme",
                "Üçüncü Parti API Entegrasyonları",
                "Özel CRM/ERP Sistemleri",
                "Mobil Uyumlu Tasarım",
                "Gelişmiş Güvenlik Özellikleri",
                "Öncelikli 7/24 Teknik Destek"
            ],
            deliveryTime: "Proje Bazlı (1-3 Ay)",
            support: "12 Ay Premium Destek + Bakım Sözleşmesi",
            extraPagePrice: "Tüm özelleştirmeler proje kapsamında değerlendirilir",
            note: "Fiyat proje kapsamına göre belirlenir. Bu başlangıç fiyatıdır."
        }
    ];

    /* ======================= CONTACT FORM ENTEGRASYON ======================= */
    const handleGetQuote = () => {
        const pkg = packages.find(p => p.id === selectedPackage);

        if (!pkg) {
            alert("Lütfen bir paket seçin!");
            return;
        }

        const quoteData = {
            package: pkg.name,
            price: pkg.price,
            pages: pkg.pages,
            features: pkg.features,
            deliveryTime: pkg.deliveryTime,
            support: pkg.support,
            description: pkg.description,
            extraPagePrice: pkg.extraPagePrice,
            note: pkg.note
        };

        localStorage.setItem("quoteData", JSON.stringify(quoteData));
        window.dispatchEvent(new Event("quoteDataUpdated"));

        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section id="pricing" className="pricing-calculator-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                >
                    Paket & Fiyatlandırma
                </motion.h2>

                <motion.p
                    className="text-center mb-5"
                    style={{ fontSize: '17px', maxWidth: '800px', margin: '0 auto 50px', color: 'var(--text-primary)', lineHeight: '1.8' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <strong style={{ color: 'var(--brand-main)' }}>Şeffaf Fiyatlandırma.</strong> Tahmini bütçenizi görün, ihtiyacınıza göre özelleştirin.
                    <br />
                    <span style={{ fontSize: '14px' }} className="text-warning">
                        *Fiyatlar başlangıç fiyatlarıdır ve projenize özel görüşmede netleştirilir.
                    </span>
                </motion.p>

                {/* PAKET KARŞILAŞTIRMA BUTONU */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        style={{
                            padding: '12px 28px',
                            background: 'rgba(212, 182, 118, 0.12)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '999px',
                            color: 'var(--brand-main)',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {showComparison ? '✕ Karşılaştırmayı Kapat' : 'Paketleri Detaylı Karşılaştır'}
                    </button>
                </div>

                {/* PAKET KARŞILAŞTIRMA TABLOSU */}
                <AnimatePresence>
                    {showComparison && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginBottom: '60px', overflow: 'hidden' }}
                        >
                            <div style={{
                                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-tertiary))',
                                border: '1px solid var(--border-medium)',
                                borderRadius: '20px',
                                padding: '32px',
                                overflowX: 'auto'
                            }}>
                                <h3 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-primary)' }}>
                                    Detaylı Paket Karşılaştırması
                                </h3>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>Özellik</th>
                                            {packages.map(pkg => (
                                                <th key={pkg.id} style={{ padding: '12px', textAlign: 'center', color: pkg.color, fontSize: '13px' }}>
                                                    {pkg.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Başlangıç Fiyatı</td>
                                            {packages.map(pkg => (
                                                <td key={pkg.id} style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: 'var(--brand-main)', fontSize: '16px' }}>
                                                    {formatPrice(pkg.price)}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>📄 Standart Sayfa Sayısı</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>1 Sayfa</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>7 Sayfa</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>10 Sayfa</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>Özel</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>🎨 Özel Tasarım</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                        </tr>
                                        <tr style={{ background: 'rgba(212, 182, 118, 0.05)' }}>
                                            <td style={{ padding: '12px', color: 'var(--brand-main)', fontWeight: '600' }}>🔧 Admin Panel</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>📝 Dinamik Blog</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>Statik</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>💼 CRM & Özel Sistemler</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>❌</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '20px' }}>✅</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>⏱️ Teslimat Süresi</td>
                                            {packages.map(pkg => (
                                                <td key={pkg.id} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                    {pkg.deliveryTime}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PAKET KARTLARI */}
                <div className="packages-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '60px'
                }}>
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            className={`package-card-modern ${selectedPackage === pkg.id ? 'selected' : ''}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            style={{
                                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-tertiary))',
                                border: `2px solid ${selectedPackage === pkg.id ? pkg.color : 'var(--border-subtle)'}`,
                                borderRadius: '24px',
                                padding: '36px 28px',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                boxShadow: selectedPackage === pkg.id ? `0 20px 60px ${pkg.color}40` : 'none'
                            }}
                        >
                            {/* Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '20px',
                                background: pkg.color,
                                color: '#fff',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {pkg.badge}
                            </div>

                            {/* Icon */}
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                                {pkg.icon}
                            </div>

                            {/* Name */}
                            <h3 style={{ fontSize: '26px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                {pkg.name}
                            </h3>

                            {/* Description */}
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                {pkg.description}
                            </p>

                            {/* Price */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    Başlangıç fiyatı*
                                </div>
                                <span style={{ fontSize: '38px', fontWeight: '700', color: pkg.color }}>
                                    {formatPrice(pkg.price)}
                                </span>
                            </div>

                            {/* Ideal */}
                            <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', padding: '12px', background: 'rgba(212, 182, 118, 0.08)', borderRadius: '10px', lineHeight: '1.6' }}>
                                💡 {pkg.ideal}
                            </p>

                            {/* Features */}
                            <div style={{ marginBottom: '20px' }}>
                                <h5 style={{ fontSize: '13px', color: 'var(--brand-main)', marginBottom: '12px', fontWeight: '600' }}>
                                    ✨ Özellikler:
                                </h5>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '0' }}>
                                    {pkg.features.slice(0, 5).map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '7px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                            <FaCheck style={{ color: pkg.color, fontSize: '12px', marginTop: '2px', flexShrink: 0 }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sayfaları Göster Butonu */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPages(showPages === pkg.id ? null : pkg.id);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'rgba(212, 182, 118, 0.12)',
                                    border: '1px solid var(--border-medium)',
                                    borderRadius: '12px',
                                    color: 'var(--brand-main)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {showPages === pkg.id ? '▲ Sayfaları Gizle' : '▼ Hangi Sayfalar Dahil?'}
                            </button>

                            {/* Sayfalar Listesi */}
                            <AnimatePresence>
                                {showPages === pkg.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            marginBottom: '16px',
                                            padding: '16px',
                                            background: 'rgba(10, 10, 10, 0.6)',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-subtle)'
                                        }}
                                    >
                                        <h5 style={{ fontSize: '12px', color: 'var(--brand-main)', marginBottom: '12px', fontWeight: '600' }}>
                                            📄 Paket İçeriği ({pkg.pages.length} Sayfa):
                                        </h5>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {pkg.pages.map((page, i) => (
                                                <li key={i} style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px 0', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
                                                    <span style={{ color: pkg.color, marginTop: '2px', fontSize: '10px' }}>●</span>
                                                    {page}
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(212, 182, 118, 0.08)', borderRadius: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                            {pkg.extraPagePrice}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Note */}
                            {pkg.note && (
                                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '16px' }}>
                                    <p style={{ fontSize: '11px', color: '#3b82f6', margin: 0, lineHeight: '1.5' }}>
                                        ℹ️ {pkg.note}
                                    </p>
                                </div>
                            )}

                            {/* SEÇ BUTONU - YENİ! */}
                            <motion.button
                                onClick={() => setSelectedPackage(pkg.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: selectedPackage === pkg.id
                                        ? `linear-gradient(135deg, ${pkg.color}, ${pkg.color}dd)`
                                        : 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                                    color: selectedPackage === pkg.id ? '#fff' : '#000',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    boxShadow: selectedPackage === pkg.id
                                        ? `0 8px 24px ${pkg.color}60`
                                        : '0 4px 16px rgba(212, 182, 118, 0.3)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {selectedPackage === pkg.id ? (
                                    <>
                                        <FaCheck /> SEÇİLDİ
                                    </>
                                ) : (
                                    <>
                                        Bu Paketi Seç
                                    </>
                                )}
                            </motion.button>

                            {/* Delivery & Support */}
                            <div style={{ fontSize: '11px', color: 'var(--text-primary)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', lineHeight: '1.6' }}>
                                <div>⏱️ {pkg.deliveryTime}</div>
                                <div style={{ marginTop: '4px' }}>🛡️ {pkg.support}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA BUTON */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <motion.button
                        onClick={handleGetQuote}
                        disabled={!selectedPackage}
                        whileHover={{ scale: selectedPackage ? 1.05 : 1 }}
                        whileTap={{ scale: selectedPackage ? 0.98 : 1 }}
                        style={{
                            padding: '20px 50px',
                            background: selectedPackage
                                ? 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))'
                                : 'rgba(100, 100, 100, 0.3)',
                            color: selectedPackage ? '#000' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '999px',
                            fontSize: '17px',
                            fontWeight: '700',
                            cursor: selectedPackage ? 'pointer' : 'not-allowed',
                            boxShadow: selectedPackage ? '0 8px 32px rgba(212, 182, 118, 0.5)' : 'none',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {selectedPackage ? (
                            <>
                                <FaRocket /> Hemen Teklif Al
                            </>
                        ) : (
                            '👆 Önce Bir Paket Seçin'
                        )}
                    </motion.button>

                    {selectedPackage && (
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '16px', lineHeight: '1.6' }}>
                            ✅ 24 saat içinde detaylı görüşme ve teklif
                            <br />
                            <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                                Bağlayıcı değildir. Projenize özel fiyat görüşmede netleştirilir.
                            </span>
                        </p>
                    )}
                </div>

                {/* Bilgilendirme Kutusu */}
                <div style={{
                    padding: '28px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '20px',
                    maxWidth: '800px',
                    margin: '0 auto 50px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <FaInfoCircle style={{ color: '#3b82f6', fontSize: '32px' }} />
                    </div>
                    <h4 style={{ color: '#3b82f6', fontSize: '18px', marginBottom: '12px', textAlign: 'center', fontWeight: '600' }}>
                        Şeffaf Fiyatlandırma Politikamız
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: '8px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            • Yukarıdaki fiyatlar <strong style={{ color: 'var(--text-primary)' }}>başlangıç/temel fiyatlardır</strong>
                        </li>
                        <li style={{ padding: '8px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            • Projenize özel ihtiyaçlar görüşmede <strong style={{ color: 'var(--text-primary)' }}>net olarak belirlenir</strong>
                        </li>
                        <li style={{ padding: '8px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            • Ek sayfalar, özel entegrasyonlar ve modüller <strong style={{ color: 'var(--text-primary)' }}>ayrıca ücretlendirilir</strong>
                        </li>
                        <li style={{ padding: '8px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            • Teklif görüşmesinde <strong style={{ color: 'var(--text-primary)' }}>kesin fiyat</strong> ve ödeme planı belirlenir
                        </li>
                    </ul>
                </div>

                {/* Profesyonel Yaklaşım */}
                <div style={{ textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h4 style={{ color: '#10b981', fontSize: '20px', marginBottom: '16px', fontWeight: '700' }}>
                        Satış Sonrası Profesyonel Destek
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
                        Teslim sonrası teknik destek, hata düzeltmeleri ve sistem güncellemeleri ile yanınızdayız.
                        <br />
                        <strong style={{ color: '#10b981' }}>Başarınız bizim başarımızdır.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingCalculator;
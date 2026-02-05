import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaRocket, FaClock, FaStar, FaArrowRight, FaShieldAlt, FaFire, FaCode, FaTrophy } from "react-icons/fa";

const PricingCalculator = () => {
    const [selectedPackage, setSelectedPackage] = useState("corporate-admin");
    const [showPages, setShowPages] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPromoActive, setIsPromoActive] = useState(true);

    /* ======================= KAMPANYA TARİHİ ======================= */
    const PROMO_END_DATE = new Date('2026-03-01T23:59:59').getTime();
    const INFO_PERIOD_DAYS = 14;
    const INFO_END_DATE = PROMO_END_DATE + (INFO_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    const [showPromoEndedInfo, setShowPromoEndedInfo] = useState(false);

    /* ======================= COUNTDOWN TIMER ======================= */
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = PROMO_END_DATE - now;
            const infoEndDifference = INFO_END_DATE - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
                setIsPromoActive(true);
                setShowPromoEndedInfo(false);
            } else if (infoEndDifference > 0) {
                setIsPromoActive(false);
                setShowPromoEndedInfo(true);
            } else {
                setIsPromoActive(false);
                setShowPromoEndedInfo(false);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    /* ======================= PAKET RENK PALETLERİ - PREMIUM & SOFT ======================= */
    const colorSchemes = {
        landing: {
            primary: '#06b6d4',      // Cyan - Hızlı & Dijital
            secondary: '#0891b2',
            light: 'rgba(6, 182, 212, 0.12)',
            border: 'rgba(6, 182, 212, 0.25)',
            shadow: 'rgba(6, 182, 212, 0.2)'
        },
        corporateBasic: {
            primary: '#6366f1',      // Indigo - Kurumsal & Güvenilir
            secondary: '#4f46e5',
            light: 'rgba(99, 102, 241, 0.12)',
            border: 'rgba(99, 102, 241, 0.25)',
            shadow: 'rgba(99, 102, 241, 0.2)'
        },
        corporateAdmin: {
            primary: '#f59e0b',      // Amber - Premium & Popüler
            secondary: '#d97706',
            light: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.3)',
            shadow: 'rgba(245, 158, 11, 0.25)'
        },
        professional: {
            primary: '#8b5cf6',      // Purple - Lüks & Özel
            secondary: '#7c3aed',
            light: 'rgba(139, 92, 246, 0.12)',
            border: 'rgba(139, 92, 246, 0.25)',
            shadow: 'rgba(139, 92, 246, 0.2)'
        }
    };

    /* ======================= PAKETLER ======================= */
    const packages = [
        {
            id: "landing",
            name: "Landing Page",
            originalPrice: 12500,
            discountedPrice: 7900,
            discountPercent: 37,
            badge: "Hızlı Başlangıç",
            tagline: "Dijital dünyada hızlıca yer almak isteyenler için mükemmel başlangıç.",
            colorScheme: colorSchemes.landing,
            icon: "",
            description: "Tek sayfa. Net mesaj. Hızlı dönüşüm.",
            ideal: "Yeni işletmeler, kampanyalar ve tek bir hizmeti öne çıkarmak isteyenler.",
            pages: [
                "Hero Alanı: Güçlü başlık, değer önerisi ve aksiyon butonu",
                "Hizmet / Ürün Tanıtımı: Ne sunduğunuzu sade ve ikna edici şekilde anlatır",
                "Güven Alanı: Referans, yorum veya görsel galeri",
                "İletişim Bölümü: Form + WhatsApp + Google Harita",
                "Footer: İletişim bilgileri ve yasal bağlantılar"
            ],
            features: [
                "Markanıza özel modern tasarım",
                "Mobil, tablet ve masaüstü uyumlu yapı",
                "SEO uyumlu altyapı (Google görünürlüğü)",
                "WhatsApp hızlı iletişim butonu",
                "Google Analytics kurulum",
                "SSL güvenlik sertifikası"
            ],
            deliveryTime: "5-7 İş Günü",
            support: "30 Gün Teknik Destek",
            extraPagePrice: "Ek sayfa: ₺1.800/sayfa"
        },
        {
            id: "corporate-basic",
            name: "Kurumsal Web – Statik",
            originalPrice: 19900,
            discountedPrice: 11900,
            discountPercent: 40,
            badge: "Bakım Derdi Yok",
            tagline: "İçeriği sık değişmeyen işletmeler için sade, hızlı ve profesyonel çözüm.",
            colorScheme: colorSchemes.corporateBasic,
            icon: "",
            description: "Kurumsal görünüm. Bakım derdi yok.",
            ideal: "Sabit hizmetleri olan, içerik güncellemesini nadiren yapan firmalar.",
            pages: [
                "Ana Sayfa: Kurumsal kimliği yansıtan, güven odaklı yapı",
                "Hakkımızda: Firma hikayesi ve güven veren anlatım",
                "Hizmetler / Ürünler: Net açıklamalar, sade sunum",
                "Referanslar / Projeler: Güven artırıcı örnek çalışmalar",
                "Blog (Statik): 5 adet SEO uyumlu içerik",
                "İletişim: Form, harita ve iletişim bilgileri",
                "KVKK & Gizlilik: Yasal uyumluluk sayfaları"
            ],
            features: [
                "Kurumsal ve sade tasarım",
                "Hızlı açılan sayfalar",
                "SEO uyumlu yapı",
                "Kurumsal e-posta & harita entegrasyonu",
                "SSL güvenlik sertifikası"
            ],
            deliveryTime: "8-10 İş Günü",
            support: "60 Gün Teknik Destek",
            extraPagePrice: "Ek sayfa: ₺2.000/sayfa",
            note: "⚠️ İçerik güncellemeleri için geliştirici desteği gerekir (admin panel yok)."
        },
        {
            id: "corporate-admin",
            name: "Kurumsal Web – Dinamik",
            originalPrice: 29900,
            discountedPrice: 16900,
            discountPercent: 43,
            badge: "En Çok Tercih Edilen",
            tagline: "İçeriğini kendin yönetmek isteyen, büyümeyi hedefleyen işletmeler için.",
            colorScheme: colorSchemes.corporateAdmin,
            icon: "",
            description: "Tam kontrol. Özgür içerik yönetimi.",
            ideal: "Blog yazan, kampanya yapan, sürekli güncelleme ihtiyacı olan firmalar.",
            recommended: true,
            pages: [
                "Ana Sayfa: Dinamik banner, kampanya ve duyuru alanları",
                "Hakkımızda: Kolayca güncellenebilir içerik",
                "Hizmetler / Ürünler: Sınırsız ekle-çıkar özelliği",
                "Referanslar / Portfolyo: Projeleri panelden yönet",
                "Blog Sistemi: Sınırsız yazı, kategori ve SEO alanları",
                "Galeri: Fotoğraf & video yönetimi",
                "İletişim & Teklif Formu: Otomatik e-posta bildirimleri",
                "SSS & Duyurular: Müşteri sorularını azaltan yapı",
                "KVKK & Yasal Sayfalar"
            ],
            features: [
                "Kullanımı kolay admin panel",
                "Tüm içerikleri bağımsız yönetme",
                "Gelişmiş SEO araçları",
                "Form & bildirim yönetimi",
                "Güvenli yönetici girişi",
                "Panel kullanım eğitimi"
            ],
            deliveryTime: "12-15 İş Günü",
            support: "90 Gün Teknik Destek + Panel Eğitimi",
            extraPagePrice: "Ek sayfa: ₺2.500/sayfa",
            note: "✅ Güncelleme için kimseye bağlı kalmazsınız. Uzun vadede en ekonomik çözümdür."
        },
        {
            id: "professional",
            name: "Özel Yazılım Çözümü",
            originalPrice: null,
            discountedPrice: null,
            discountPercent: 0,
            badge: "Bana Özel",
            tagline: "İş modelinize özel, sıfırdan planlanan yazılım çözümleri.",
            colorScheme: colorSchemes.professional,
            icon: "🎯",
            description: "Standart paketler yetmiyorsa.",
            ideal: "Özel süreçleri olan, entegrasyon ihtiyacı bulunan işletmeler.",
            pages: [
                "Özel UI/UX tasarımı",
                "İhtiyaca özel modüller",
                "API & üçüncü parti entegrasyonlar",
                "Özel yönetim panelleri",
                "Raporlama & otomasyon sistemleri"
            ],
            features: [
                "Tamamen size özel yazılım",
                "API entegrasyonları (Ödeme, SMS vb.)",
                "Özel CRM/ERP sistemleri",
                "Tüm cihazlarda mükemmel performans",
                "Kurumsal seviye güvenlik",
                "7/24 öncelikli destek",
                "Özel eğitim ve dokümantasyon"
            ],
            deliveryTime: "Proje Bazlı (1-3 Ay)",
            support: "Süresiz Premium Destek",
            extraPagePrice: "Tüm özellikler proje kapsamında değerlendirilir",
            note: "Detaylı analiz sonrası net teklif hazırlanır.",
            isCustomQuote: true
        }
    ];

    /* ======================= CONTACT FORM ENTEGRASYON ======================= */
    const handleGetQuote = () => {
        const pkg = packages.find(p => p.id === selectedPackage);

        if (!pkg) {
            alert("Lütfen bir paket seçin!");
            return;
        }

        if (pkg.isCustomQuote) {
            const quoteData = {
                package: pkg.name,
                price: "Özel Teklif Gereklidir (40.000₺'den başlar)",
                pages: pkg.pages,
                features: pkg.features,
                deliveryTime: pkg.deliveryTime,
                support: pkg.support,
                description: pkg.description,
                extraPagePrice: pkg.extraPagePrice,
                note: pkg.note,
                isCustomQuote: true
            };

            localStorage.setItem("quoteData", JSON.stringify(quoteData));
            window.dispatchEvent(new Event("quoteDataUpdated"));
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        const quoteData = {
            package: pkg.name,
            price: isPromoActive ? pkg.discountedPrice : pkg.originalPrice,
            originalPrice: pkg.originalPrice,
            discountedPrice: pkg.discountedPrice,
            discount: pkg.discountPercent,
            isPromoActive: isPromoActive,
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
        if (!price) return "Teklif Al";
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getCurrentPrice = (pkg) => {
        if (pkg.isCustomQuote) return null;
        return isPromoActive ? pkg.discountedPrice : pkg.originalPrice;
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
                    Paketler & Şeffaf Fiyatlandırma
                </motion.h2>

                <motion.p
                    className="text-center mb-5"
                    style={{
                        fontSize: '17px',
                        maxWidth: '800px',
                        margin: '0 auto 15px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.8'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Ajans karmaşası olmadan, doğrudan geliştiriciyle çalışın.
                    <br />
                    İhtiyacınıza göre net paketler, sürpriz maliyet olmadan.
                    <br />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        Tüm fiyatlar KDV hariçtir. Paket içerikleri nettir, gizli ücret yoktur.
                    </span>
                </motion.p>

                {/* KAMPANYA BANNER - FULL RESPONSIVE PREMIUM */}
                {isPromoActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="promo-banner"
                    >
                        {/* Animated Glow */}
                        <div className="promo-glow" />

                        {/* Accent Line */}
                        <div className="promo-accent-line" />

                        <div className="promo-inner">
                            <div className="promo-content">

                                {/* Sol: Kampanya Bilgisi */}
                                <div className="promo-left">
                                    <div className="promo-title-row">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.15, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <FaFire className="promo-fire-icon" />
                                        </motion.div>

                                        <div>
                                            <h4 className="promo-title">
                                                Sınırlı Süreli Kampanya
                                            </h4>
                                        </div>
                                    </div>

                                    <p className="promo-desc-main">
                                        Algorixa'da fiyatlar; proje kapsamı, uzun vadeli sürdürülebilirlik ve karşılıklı memnuniyet esas alınarak belirlenir.
                                    </p>

                                    <p className="promo-desc-sub">
                                        Bazı dönemlerde, yeni iş birlikleri için{" "}
                                        <strong style={{ color: "#f59e0b" }}>
                                            sınırlı süreli avantajlı fiyatlandırmalar
                                        </strong>{" "}
                                        sunulur. Bu iş birliklerinde, projenin referans olarak gösterilmesine ve deneyim paylaşımına önem veririz.
                                    </p>

                                    <div className="promo-highlight">
                                        <FaTrophy className="promo-trophy-icon" />
                                        <span className="promo-highlight-text">
                                            Karşılıklı kazanım odaklı, şeffaf çalışma modeli
                                        </span>
                                    </div>
                                </div>

                                {/* Sağ: Countdown */}
                                <div className="promo-right">
                                    <div className="promo-countdown-label">
                                        ⚡ Kampanya Bitiyor
                                    </div>

                                    <div className="promo-countdown-row">
                                        {[
                                            { value: timeLeft.days, label: "GÜN" },
                                            { value: timeLeft.hours, label: "SAAT" },
                                            { value: timeLeft.minutes, label: "DAK" },
                                            { value: timeLeft.seconds, label: "SN" }
                                        ].map((item, i) => (
                                            <div key={i} className="promo-countdown-item">
                                                <div className="promo-countdown-box-wrap">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.05, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="promo-countdown-box"
                                                    >
                                                        {String(item.value).padStart(2, "0")}
                                                    </motion.div>

                                                    <div className="promo-countdown-text">
                                                        {item.label}
                                                    </div>
                                                </div>

                                                {i < 3 && <span className="promo-colon">:</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <style>{`
      .promo-banner {
        max-width: 1100px;
        margin: 0 auto 70px;
        padding: 48px 52px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.08));
        border: 2px solid rgba(245, 158, 11, 0.35);
        border-radius: 28px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .promo-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: radial-gradient(circle at 30% 50%, rgba(245, 158, 11, 0.15), transparent 60%);
        animation: softGlow 8s ease-in-out infinite;
        pointer-events: none;
      }

      .promo-accent-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #f59e0b, transparent);
        animation: shimmer 3s ease-in-out infinite;
      }

      .promo-inner {
        position: relative;
        z-index: 2;
      }

      .promo-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        flex-wrap: wrap;
      }

      .promo-left {
        flex: 1;
        min-width: 340px;
      }

      .promo-title-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .promo-fire-icon {
        font-size: 36px;
        color: #f59e0b;
        filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.6));
      }

      .promo-title {
        font-size: 22px;
        font-weight: 900;
        background: linear-gradient(135deg, #f59e0b, #fbbf24);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        letter-spacing: 0.3px;
      }

      .promo-desc-main {
        font-size: 15px;
        color: var(--text-primary);
        margin: 0 0 20px 0;
        line-height: 1.8;
        font-weight: 500;
      }

      .promo-desc-sub {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0 0 20px 0;
        line-height: 1.7;
        font-weight: 500;
      }

      .promo-highlight {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        background: rgba(16, 185, 129, 0.15);
        border: 1.5px solid rgba(16, 185, 129, 0.3);
        border-radius: 14px;
        backdrop-filter: blur(10px);
      }

      .promo-trophy-icon {
        font-size: 16px;
        color: #10b981;
      }

      .promo-highlight-text {
        font-size: 14px;
        color: #10b981;
        font-weight: 700;
        letter-spacing: 0.3px;
      }

      .promo-right {
        background: linear-gradient(135deg, rgba(15, 15, 15, 0.6), rgba(20, 20, 20, 0.4));
        padding: 32px 36px;
        border-radius: 20px;
        border: 2px solid rgba(245, 158, 11, 0.3);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
      }

      .promo-countdown-label {
        font-size: 13px;
        color: #f59e0b;
        margin-bottom: 16px;
        text-align: center;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      .promo-countdown-row {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        font-family: "SF Mono", "Monaco", monospace;
      }

      .promo-countdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .promo-countdown-box-wrap {
        text-align: center;
      }

      .promo-countdown-box {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
        padding: 14px 16px;
        border-radius: 12px;
        font-size: 28px;
        font-weight: 900;
        min-width: 70px;
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .promo-countdown-text {
        font-size: 10px;
        color: #9ca3af;
        margin-top: 6px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .promo-colon {
        color: rgba(245, 158, 11, 0.5);
        font-size: 24px;
        font-weight: 300;
      }

      /* ========================= RESPONSIVE ========================= */

      @media (max-width: 1024px) {
        .promo-banner {
          padding: 38px 38px;
        }

        .promo-right {
          width: 100%;
          padding: 26px 24px;
        }
      }

      @media (max-width: 768px) {
        .promo-banner {
          padding: 30px 22px;
          margin-bottom: 50px;
        }

        .promo-content {
          flex-direction: column;
          align-items: stretch;
          gap: 30px;
        }

        .promo-left {
          min-width: 100%;
        }

        .promo-title {
          font-size: 20px;
        }

        .promo-desc-main {
          font-size: 14px;
        }

        .promo-desc-sub {
          font-size: 13px;
        }

        .promo-highlight {
          width: 100%;
          justify-content: center;
          text-align: center;
        }

        .promo-right {
          width: 100%;
          text-align: center;
        }

        .promo-countdown-row {
          justify-content: center;
          gap: 10px;
        }

        .promo-countdown-box {
          min-width: 60px;
          font-size: 24px;
          padding: 12px 14px;
        }
      }

      @media (max-width: 480px) {
        .promo-banner {
          padding: 22px 16px;
          border-radius: 22px;
        }

        .promo-fire-icon {
          font-size: 30px;
        }

        .promo-title {
          font-size: 18px;
        }

        .promo-desc-main {
          font-size: 13px;
          line-height: 1.7;
        }

        .promo-desc-sub {
          font-size: 12px;
          line-height: 1.6;
        }

        .promo-highlight-text {
          font-size: 12px;
        }

        .promo-right {
          padding: 20px 16px;
          border-radius: 18px;
        }

        .promo-countdown-box {
          min-width: 54px;
          font-size: 20px;
          padding: 10px 12px;
        }

        .promo-colon {
          display: none;
        }
      }

      /* ========================= ANIMATIONS ========================= */

      @keyframes softGlow {
        0%, 100% {
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.08);
        }
      }

      @keyframes shimmer {
        0%, 100% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
      }
    `}</style>
                    </motion.div>
                )}

                {/* Kampanya Bitti Bildirimi */}
                {!isPromoActive && showPromoEndedInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="promo-ended"
                    >
                        <p className="promo-ended-title">
                            Kampanya dönemi sona erdi. Normal fiyatlar geçerlidir.
                        </p>
                        <p className="promo-ended-desc">
                            Toplu proje veya uzun vadeli işbirliği için özel fırsatlar sunabiliriz.
                        </p>

                        <style>{`
      .promo-ended {
        max-width: 700px;
        margin: 0 auto 60px;
        padding: 24px 32px;
        background: rgba(245, 158, 11, 0.08);
        border: 1px solid rgba(245, 158, 11, 0.25);
        border-radius: 18px;
        text-align: center;
      }

      .promo-ended-title {
        font-size: 15px;
        color: #f59e0b;
        margin: 0 0 10px;
        font-weight: 700;
      }

      .promo-ended-desc {
        font-size: 13px;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .promo-ended {
          padding: 20px 18px;
          margin-bottom: 40px;
        }

        .promo-ended-title {
          font-size: 14px;
        }

        .promo-ended-desc {
          font-size: 12px;
        }
      }
    `}</style>
                    </motion.div>
                )}


                {/* PAKET KARTLARI - HER BİRİ KENDI RENGİYLE */}
                <div className="packages-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '36px',
                    marginBottom: '70px'
                }}>
                    {packages.map((pkg, index) => {
                        const isSelected = selectedPackage === pkg.id;
                        const isRecommended = pkg.recommended;
                        const colors = pkg.colorScheme;

                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onClick={() => setSelectedPackage(pkg.id)}
                                style={{
                                    background: isRecommended
                                        ? `linear-gradient(135deg, ${colors.light}, rgba(139, 92, 246, 0.03))`
                                        : `linear-gradient(135deg, var(--bg-card), ${colors.light})`,
                                    border: isSelected
                                        ? `2px solid ${colors.primary}`
                                        : isRecommended
                                            ? `2px solid ${colors.border}`
                                            : '2px solid var(--border-subtle)',
                                    borderRadius: '26px',
                                    padding: '40px 32px',
                                    position: 'relative',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isSelected
                                        ? `0 24px 60px ${colors.shadow}`
                                        : '0 4px 16px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer'
                                }}
                                whileHover={{
                                    y: -12,
                                    boxShadow: `0 28px 70px ${colors.shadow}`
                                }}
                            >
                                {/* Subtle Accent Gradient */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                                    borderRadius: '26px 26px 0 0',
                                    opacity: isSelected ? 1 : 0.5
                                }} />

                                {/* Recommended Badge */}
                                {isRecommended && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-14px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        color: '#fff',
                                        padding: '8px 24px',
                                        borderRadius: '999px',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: `0 6px 20px ${colors.shadow}`
                                    }}>
                                        <FaStar style={{ fontSize: '11px' }} />
                                        {pkg.badge}
                                    </div>
                                )}

                                {/* Badge (non-recommended packages) */}
                                {!isRecommended && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-14px',
                                        right: '24px',
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        color: '#fff',
                                        padding: '7px 18px',
                                        borderRadius: '999px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.7px',
                                        boxShadow: `0 4px 16px ${colors.shadow}`
                                    }}>
                                        {pkg.badge}
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {isPromoActive && !pkg.isCustomQuote && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '24px',
                                        right: '24px',
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        border: '1.5px solid rgba(16, 185, 129, 0.35)',
                                        color: '#10b981',
                                        padding: '6px 14px',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        letterSpacing: '0.5px',
                                        backdropFilter: 'blur(10px)',
                                    }}>
                                        %{pkg.discountPercent}
                                    </div>
                                )}

                                {/* Icon & Name */}
                                <div style={{ marginBottom: '24px', marginTop: isRecommended ? '12px' : '0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '14px' }}>{pkg.icon}</div>
                                    <h3 style={{
                                        fontSize: '26px',
                                        fontWeight: '800',
                                        color: 'var(--text-primary)',
                                        marginBottom: '10px',
                                        letterSpacing: '-0.3px',
                                        marginTop: 30
                                    }}>
                                        {pkg.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: colors.primary,
                                        marginBottom: '18px',
                                        fontWeight: '600'
                                    }}>
                                        {pkg.description}
                                    </p>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--text-secondary)',
                                        fontStyle: 'italic',
                                        lineHeight: '1.6',
                                        padding: '14px',
                                        background: colors.light,
                                        borderRadius: '12px',
                                        borderLeft: `3px solid ${colors.primary}`
                                    }}>
                                        {pkg.tagline}
                                    </p>
                                </div>

                                {/* Price */}
                                <div style={{ marginBottom: '28px' }}>
                                    {!pkg.isCustomQuote ? (
                                        <>
                                            {isPromoActive && (
                                                <div style={{
                                                    fontSize: '19px',
                                                    color: 'var(--text-secondary)',
                                                    textDecoration: 'line-through',
                                                    marginBottom: '8px',
                                                    fontWeight: '500'
                                                }}>
                                                    {formatPrice(pkg.originalPrice)}
                                                </div>
                                            )}
                                            <div style={{
                                                fontSize: '46px',
                                                fontWeight: '900',
                                                color: isPromoActive ? '#10b981' : colors.primary,
                                                lineHeight: '1',
                                                marginBottom: '10px',
                                                letterSpacing: '-1px'
                                            }}>
                                                {formatPrice(getCurrentPrice(pkg))}
                                            </div>
                                            {isPromoActive && (
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#10b981',
                                                    fontWeight: '700'
                                                }}>
                                                    ✓ {formatPrice(pkg.originalPrice - pkg.discountedPrice)} tasarruf
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{
                                            fontSize: '26px',
                                            fontWeight: '800',
                                            color: colors.primary
                                        }}>
                                            Özel Teklif
                                        </div>
                                    )}
                                </div>

                                {/* Features Preview */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: colors.primary,
                                        marginBottom: '14px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px'
                                    }}>
                                        ✨ Öne Çıkan Özellikler
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {pkg.features.slice(0, 4).map((feature, i) => (
                                            <li key={i} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                padding: '8px 0',
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                lineHeight: '1.6'
                                            }}>
                                                <FaCheck style={{
                                                    color: colors.primary,
                                                    fontSize: '12px',
                                                    marginTop: '4px',
                                                    flexShrink: 0
                                                }} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Expand Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPages(showPages === pkg.id ? null : pkg.id);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: colors.light,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: '14px',
                                        color: colors.primary,
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        marginBottom: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {showPages === pkg.id ? '▲ Detayları Gizle' : '▼ Tüm Detayları Gör'}
                                </button>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {showPages === pkg.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{
                                                marginBottom: '24px',
                                                padding: '20px',
                                                background: 'rgba(10, 10, 10, 0.5)',
                                                borderRadius: '14px',
                                                border: `1px solid ${colors.border}`
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '12px',
                                                color: colors.primary,
                                                marginBottom: '10px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.7px'
                                            }}>
                                                📋 Paket İçeriği ({pkg.pages.length} {pkg.isCustomQuote ? 'Özellik' : 'Bölüm'})
                                            </div>
                                            <p style={{
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                marginBottom: '14px',
                                                fontStyle: 'italic',
                                                lineHeight: '1.6'
                                            }}>
                                                ✓ {pkg.ideal}
                                            </p>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px 0' }}>
                                                {pkg.pages.map((page, i) => (
                                                    <li key={i} style={{
                                                        fontSize: '12px',
                                                        color: 'var(--text-secondary)',
                                                        padding: '6px 0',
                                                        display: 'flex',
                                                        gap: '10px',
                                                        alignItems: 'flex-start',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        <span style={{
                                                            color: colors.primary,
                                                            fontSize: '10px',
                                                            marginTop: '5px'
                                                        }}>●</span>
                                                        {page}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div style={{
                                                fontSize: '11px',
                                                color: 'var(--text-muted)',
                                                padding: '10px',
                                                background: colors.light,
                                                borderRadius: '8px',
                                                borderLeft: `2px solid ${colors.primary}`
                                            }}>
                                                💡 {pkg.extraPagePrice}
                                            </div>

                                            {/* Tüm Özellikler Listesi */}
                                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: colors.primary,
                                                    marginBottom: '10px',
                                                    fontWeight: '700'
                                                }}>
                                                    ✨ Tüm Teknik Özellikler:
                                                </div>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {pkg.features.map((feature, i) => (
                                                        <li key={i} style={{
                                                            fontSize: '11px',
                                                            color: 'var(--text-secondary)',
                                                            padding: '5px 0',
                                                            display: 'flex',
                                                            gap: '8px',
                                                            alignItems: 'flex-start',
                                                            lineHeight: '1.5'
                                                        }}>
                                                            <FaCheck style={{
                                                                color: colors.primary,
                                                                fontSize: '9px',
                                                                marginTop: '3px',
                                                                flexShrink: 0
                                                            }} />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Note */}
                                {pkg.note && (
                                    <div style={{
                                        padding: '12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                    }}>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#3b82f6',
                                            margin: 0,
                                            lineHeight: '1.6',
                                            fontWeight: '500'
                                        }}>
                                            💡 {pkg.note}
                                        </p>
                                    </div>
                                )}

                                {/* Select Button */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: isSelected
                                            ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                            : `linear-gradient(135deg, ${colors.light}, ${colors.light})`,
                                        color: isSelected ? '#fff' : colors.primary,
                                        border: isSelected ? 'none' : `2px solid ${colors.border}`,
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        marginBottom: '18px',
                                        boxShadow: isSelected
                                            ? `0 10px 30px ${colors.shadow}`
                                            : 'none',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        letterSpacing: '0.3px'
                                    }}
                                >
                                    {isSelected ? (
                                        <>
                                            <FaCheck /> SEÇİLDİ
                                        </>
                                    ) : (
                                        'Bu Paketi Seç'
                                    )}
                                </motion.button>

                                {/* Delivery & Support */}
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    textAlign: 'center',
                                    borderTop: '1px solid var(--border-subtle)',
                                    paddingTop: '16px',
                                    lineHeight: '1.7'
                                }}>
                                    <div>⏱️ Teslimat: <strong style={{ color: 'var(--text-primary)' }}>{pkg.deliveryTime}</strong></div>
                                    <div style={{ marginTop: '6px' }}>🛡️ Destek: <strong style={{ color: 'var(--text-primary)' }}>{pkg.support}</strong></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div style={{ textAlign: 'center', marginBottom: '90px' }}>
                    <motion.button
                        onClick={handleGetQuote}
                        disabled={!selectedPackage}
                        whileHover={{ scale: selectedPackage ? 1.04 : 1 }}
                        whileTap={{ scale: selectedPackage ? 0.96 : 1 }}
                        style={{
                            padding: '20px 56px',
                            background: selectedPackage
                                ? 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))'
                                : 'rgba(100, 100, 100, 0.3)',
                            color: selectedPackage ? '#000' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '999px',
                            fontSize: '18px',
                            fontWeight: '800',
                            cursor: selectedPackage ? 'pointer' : 'not-allowed',
                            boxShadow: selectedPackage
                                ? '0 10px 40px rgba(212, 182, 118, 0.5)'
                                : 'none',
                            transition: 'all 0.4s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            letterSpacing: '0.3px'
                        }}
                    >
                        {selectedPackage ? (
                            <>
                                Detaylı Görüşelim <FaArrowRight style={{ fontSize: '16px' }} />
                            </>
                        ) : (
                            'Önce Bir Paket Seçin'
                        )}
                    </motion.button>

                    {selectedPackage && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                marginTop: '18px',
                                lineHeight: '1.7',
                                maxWidth: '600px',
                                margin: '18px auto 0'
                            }}
                        >
                            ✓ 24 saat içinde detaylı görüşme ve net teklif
                            <br />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                Bağlayıcı değildir. Ek özellik talepleri görüşmede netleştirilir.
                            </span>
                        </motion.p>
                    )}
                </div>

                {/* Trust Indicators - Revize */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '28px',
                    marginBottom: '70px'
                }}>
                    {[
                        {
                            icon: <FaCode />,
                            title: 'Doğrudan Geliştiriciyle Çalışın',
                            desc: 'Tek muhatap, hızlı iletişim ve net süreç yönetimi'
                        },
                        {
                            icon: <FaClock />,
                            title: 'Planlı & Zamanında Teslim',
                            desc: 'Kapsamı baştan belirlenen, takvimli proje yönetimi'
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: 'Şeffaf Fiyatlandırma',
                            desc: 'Başından belli kapsam, sürpriz maliyet yok'
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            style={{
                                padding: '28px',
                                background: 'linear-gradient(135deg, rgba(212, 182, 118, 0.08), rgba(212, 182, 118, 0.03))',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '18px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            whileHover={{
                                boxShadow: '0 8px 24px rgba(212, 182, 118, 0.15)'
                            }}
                        >
                            <div style={{
                                fontSize: '36px',
                                color: 'var(--brand-main)',
                                marginBottom: '14px'
                            }}>
                                {item.icon}
                            </div>
                            <h4 style={{
                                fontSize: '17px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                marginBottom: '10px',
                                letterSpacing: '-0.2px'
                            }}>
                                {item.title}
                            </h4>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                margin: 0,
                                lineHeight: '1.6'
                            }}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Şeffaf Fiyatlandırma Politikası - Revize */}
                <div style={{
                    padding: '36px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1.5px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '22px',
                    maxWidth: '900px',
                    margin: '0 auto 60px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <FaShieldAlt style={{ color: '#3b82f6', fontSize: '40px' }} />
                    </div>
                    <h4 style={{
                        color: '#3b82f6',
                        fontSize: '22px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontWeight: '800',
                        letterSpacing: '-0.3px'
                    }}>
                        Şeffaf Fiyatlandırma Politikamız
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: '12px 0', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            • Paket fiyatları, tanımlı kapsamlar için belirlenmiştir
                        </li>
                        <li style={{ padding: '12px 0', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            • Projenize özel ihtiyaçlar görüşmede netleştirilir
                        </li>
                        <li style={{ padding: '12px 0', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            • Ek sayfa, özel entegrasyon ve modüller ayrıca planlanır
                        </li>
                        <li style={{ padding: '12px 0', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            • Nihai fiyat ve ödeme planı teklif görüşmesinde belirlenir
                        </li>
                    </ul>
                    <div style={{
                        marginTop: '20px',
                        padding: '14px',
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '15px',
                            color: '#3b82f6',
                            margin: 0,
                            fontWeight: '700'
                        }}>
                            ✓ Net kapsam, net fiyat. Sonradan sürpriz yok.
                        </p>
                    </div>
                </div>

                {/* Birebir Çalışma Avantajı - Revize */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: 'center',
                        padding: '40px 32px',
                        background: 'linear-gradient(135deg, rgba(212, 182, 118, 0.12), rgba(212, 182, 118, 0.05))',
                        borderRadius: '22px',
                        border: '1.5px solid rgba(212, 182, 118, 0.25)',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}
                >
                    <h4 style={{
                        color: 'var(--brand-main)',
                        fontSize: '22px',
                        marginBottom: '20px',
                        fontWeight: '800',
                        letterSpacing: '-0.3px'
                    }}>
                        Birebir Çalışma Avantajı
                    </h4>
                    <p style={{
                        fontSize: '15px',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto 24px',
                        lineHeight: '1.9'
                    }}>
                        Ajans süreçlerinin karmaşıklığı olmadan, projeyi geliştiren kişiyle doğrudan iletişim kurarsınız.
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                        marginBottom: '20px'
                    }}>
                        {['Daha hızlı geri dönüş', 'Daha net karar alma süreci', 'İhtiyaca göre esnek çözümler'].map((text, i) => (
                            <div key={i} style={{
                                padding: '10px 20px',
                                background: 'rgba(212, 182, 118, 0.15)',
                                borderRadius: '12px',
                                fontSize: '14px',
                                color: 'var(--brand-main)',
                                fontWeight: '600'
                            }}>
                                ✓ {text}
                            </div>
                        ))}
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        margin: 0
                    }}>
                        Teslim sonrası teknik destek ve güncellemelerle süreç devam eder.
                    </p>
                </motion.div>
            </div>

            <style>{`
                @keyframes softGlow {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1) rotate(180deg);
                    }
                }

                @keyframes shimmer {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `}</style>
        </section>
    );
};

export default PricingCalculator;
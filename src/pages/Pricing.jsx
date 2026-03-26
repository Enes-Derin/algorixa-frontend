import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePackages } from "../redux/pricingSlice";
import { fetchActiveCampaign } from "../redux/campaignSlice";
import { fetchPublicPlans } from "../redux/maintenanceSlice";
import {
    Check, ChevronDown, ChevronUp, Zap, Clock, Shield,
    Timer, BarChart3, RefreshCw, AlertCircle,
} from "lucide-react";
import SEO from "../components/Seo";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const inlineStyles = `
  @keyframes spin { to { transform: rotate(360deg); } }

  .prc-plans {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 48px;
  }
  @media (max-width: 1024px) {
    .prc-plans { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .prc-plans { grid-template-columns: 1fr; }
  }

  .prc-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: var(--bg-1);
    border: 1px solid var(--b-faint);
    border-radius: 14px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .prc-card:hover {
    border-color: rgba(200,168,75,0.35);
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  }
  .prc-card--selected {
    border-color: rgba(200,168,75,0.55);
    box-shadow: 0 0 0 1px rgba(200,168,75,0.25), 0 6px 32px rgba(0,0,0,0.22);
  }

  .prc-card__discount {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 3px 8px;
    border-radius: 100px;
    background: rgba(200,168,75,0.15);
    border: 1px solid rgba(200,168,75,0.3);
    font-size: 11px;
    font-weight: 600;
    color: var(--gold);
    font-family: var(--f-mono);
  }

  .prc-card__badge {
    display: inline-block;
    font-size: 10px;
    font-family: var(--f-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }

  .prc-card__name {
    font-size: 18px;
    font-weight: 700;
    color: var(--t-1);
    margin: 0 0 6px;
    font-family: var(--f-display);
    line-height: 1.3;
  }

  .prc-card__tagline {
    font-size: 13px;
    color: var(--t-3);
    margin: 0 0 18px;
    line-height: 1.5;
  }

  .prc-card__price-area {
    margin-bottom: 18px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--b-faint);
  }

  .prc-card__orig {
    font-size: 13px;
    color: var(--t-4);
    text-decoration: line-through;
    margin-bottom: 2px;
    font-family: var(--f-mono);
  }

  .prc-card__price {
    font-size: 26px;
    font-weight: 800;
    color: var(--t-1);
    font-family: var(--f-display);
    line-height: 1.1;
    margin-bottom: 4px;
  }

  .prc-card__note {
    font-size: 11px;
    color: var(--t-4);
    font-family: var(--f-mono);
    letter-spacing: 0.03em;
  }

  .prc-card__savings {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    padding: 3px 8px;
    background: rgba(200,168,75,0.1);
    border-radius: 100px;
    font-size: 11px;
    color: var(--gold);
    font-family: var(--f-mono);
  }

  .prc-card__features {
    list-style: none;
    padding: 0;
    margin: 0 0 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .prc-card__feature {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: var(--t-2);
    line-height: 1.45;
  }

  .prc-card__detail-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: var(--t-4);
    font-family: var(--f-mono);
    letter-spacing: 0.04em;
    padding: 6px 0;
    margin-bottom: 8px;
    transition: color 0.15s;
  }
  .prc-card__detail-toggle:hover { color: var(--gold); }

  .prc-card__expanded {
    padding: 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--b-faint);
    border-radius: 8px;
    margin-bottom: 14px;
  }

  .prc-card__expanded-item {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 12px;
    color: var(--t-2);
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .prc-card__note-box {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 11px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.55;
    margin-bottom: 10px;
  }
  .prc-card__note-box--success {
    background: rgba(34,197,94,0.06);
    border: 1px solid rgba(34,197,94,0.18);
    color: rgba(134,239,172,0.9);
  }
  .prc-card__note-box--warn {
    background: rgba(234,179,8,0.07);
    border: 1px solid rgba(234,179,8,0.2);
    color: rgba(253,224,71,0.9);
  }
  .prc-card__note-box--neutral {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--b-faint);
    color: var(--t-3);
  }

  .prc-card__cta {
    display: block;
    text-align: center;
    margin-top: auto;
    margin-bottom: 0;
  }

  .prc-card__meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--b-faint);
  }

  .prc-card__meta-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--f-mono);
    color: var(--t-4);
    letter-spacing: 0.03em;
  }

  /* ── Promo Bar ── */
  .prc-promo-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    margin-bottom: 36px;
    background: rgba(200,168,75,0.06);
    border: 1px solid rgba(200,168,75,0.25);
    border-radius: 12px;
  }
  .prc-promo-bar__left { flex: 1; min-width: 240px; }
  .prc-promo-bar__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
    color: var(--t-1);
    margin-bottom: 6px;
    font-family: var(--f-display);
  }
  .prc-promo-bar__desc {
    font-size: 13px;
    color: var(--t-3);
    margin: 0 0 10px;
    line-height: 1.6;
  }
  .prc-promo-bar__highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .prc-promo-highlight {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--f-mono);
    color: var(--t-3);
  }

  /* ── Countdown ── */
  .prc-countdown {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .prc-countdown__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  .prc-countdown__box {
    min-width: 42px;
    padding: 6px 8px;
    background: rgba(200,168,75,0.1);
    border: 1px solid rgba(200,168,75,0.25);
    border-radius: 6px;
    font-size: 18px;
    font-weight: 800;
    color: var(--gold);
    font-family: var(--f-mono);
    text-align: center;
    line-height: 1;
  }
  .prc-countdown__label {
    font-size: 9px;
    font-family: var(--f-mono);
    color: var(--t-4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .prc-countdown__sep {
    font-size: 18px;
    font-weight: 800;
    color: var(--gold);
    font-family: var(--f-mono);
    margin-bottom: 14px;
    opacity: 0.6;
  }

  /* ── Policy ── */
  .prc-policy {
    padding: 24px;
    border: 1px solid var(--b-faint);
    border-radius: 12px;
    margin-bottom: 40px;
  }
  .prc-policy__label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-family: var(--f-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t-4);
    margin-bottom: 14px;
  }
  .prc-policy__list {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .prc-policy__item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: var(--t-2);
    line-height: 1.5;
  }
  .prc-policy__foot {
    font-size: 12px;
    color: var(--t-4);
    font-family: var(--f-mono);
    margin: 0;
  }

  /* ── CTA Bar ── */
  .prc-cta-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 28px 32px;
    background: rgba(200,168,75,0.06);
    border: 1px solid rgba(200,168,75,0.2);
    border-radius: 14px;
  }
  .prc-cta-bar__text h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--t-1);
    margin: 0 0 6px;
    font-family: var(--f-display);
  }
  .prc-cta-bar__text p {
    font-size: 13px;
    color: var(--t-3);
    margin: 0;
    line-height: 1.6;
  }

  /* ── Maintenance Grid ── */
  .maint-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
  @media (max-width: 1024px) {
    .maint-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .maint-grid { grid-template-columns: 1fr; }
  }

  .maint-card {
    padding: 22px;
    background: var(--bg-1);
    border: 1px solid var(--b-faint);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
  }
  .maint-card--best {
    border-color: rgba(200,168,75,0.4);
    box-shadow: 0 0 0 1px rgba(200,168,75,0.15);
  }
  .maint-card__badge {
    display: inline-block;
    font-size: 10px;
    font-family: var(--f-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .maint-card h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--t-1);
    margin: 0 0 10px;
    font-family: var(--f-display);
  }
  .maint-card__price {
    font-size: 24px;
    font-weight: 800;
    color: var(--t-1);
    font-family: var(--f-display);
    margin-bottom: 6px;
    line-height: 1.1;
  }
  .maint-card__price span {
    font-size: 14px;
    font-weight: 400;
    color: var(--t-4);
  }
  .maint-card__ideal {
    font-size: 12px;
    color: var(--t-4);
    line-height: 1.55;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--b-faint);
  }
  .maint-card__feature {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: var(--t-2);
    line-height: 1.5;
    margin-bottom: 7px;
  }

  /* ── Maintenance Footer Note ── */
  .maint-footer-note {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 14px 0 0;
    border-top: 1px solid var(--b-faint);
    font-size: 12px;
    color: var(--t-4);
    font-family: var(--f-mono);
  }
`;

// ─── Video Hero ───────────────────────────────────────────────────────────────
function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const handleError = () => { setHasError(true); };
        v.addEventListener("loadeddata", handleLoad);
        v.addEventListener("error", handleError);
        return () => {
            v.removeEventListener("loadeddata", handleLoad);
            v.removeEventListener("error", handleError);
        };
    }, []);

    return (
        <div className="hero-video-wrap" aria-hidden>
            {!isLoaded && (
                <div className="hero-video__poster" style={{
                    backgroundImage: "url(/hero-poster.jpg)", backgroundSize: "cover",
                    backgroundPosition: "center", position: "absolute", inset: 0, zIndex: 1
                }} />
            )}
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline
                preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.8s ease-in-out" }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
                <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="hero-video__overlay" style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
                position: "absolute", inset: 0, zIndex: 2
            }} />
            <div className="hero-video__grain" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.03, position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none"
            }} />
            <div className="hero-video__fade-bottom" style={{
                background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%)",
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", zIndex: 4
            }} />
            {!isLoaded && !hasError && (
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", zIndex: 5,
                    color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 500,
                    textAlign: "center",
                }}>
                    <div style={{
                        width: "40px", height: "40px", margin: "0 auto 12px",
                        border: "3px solid rgba(255,255,255,0.1)",
                        borderTop: "3px solid rgba(200,168,75,0.8)",
                        borderRadius: "50%", animation: "spin 1s linear infinite"
                    }} />
                    Video yükleniyor...
                </div>
            )}
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toNum(val) {
    if (val == null) return null;
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
}

function formatPrice(val) {
    const n = toNum(val);
    if (n == null) return null;
    return "₺" + n.toLocaleString("tr-TR");
}

function resolveNoteType(type) {
    if (!type) return "neutral";
    return type.toString().toLowerCase();
}

function resolveSectionKey(code) {
    if (!code) return null;
    const c = code.toUpperCase();
    if (c.includes("LANDING")) return "LANDING";
    if (c.includes("INSAAT")) return "INSAAT";
    if (c.includes("EMLAK")) return "EMLAK";
    if (c.includes("KAFE")) return "KAFE";
    if (c.includes("STATIK") || c.includes("STATIC")) return "KURUMSAL_STATIK";
    if (c.includes("DINAMIK") || c.includes("DYNAMIC")) return "KURUMSAL_DINAMIK";
    if (c.includes("OZEL") || c.includes("CUSTOM") || c.includes("SPECIAL")) return "OZEL_YAZILIM";
    return null;
}

// ─── Plan Sections ────────────────────────────────────────────────────────────
const PLAN_SECTIONS = {
    LANDING: {
        idealFor: "Yeni işletmeler, kampanyalar ve tek bir hizmeti öne çıkarmak isteyenler.",
        sections: [
            { title: "Hero Alanı", desc: "Güçlü başlık, değer önerisi ve aksiyon butonu" },
            { title: "Hizmet / Ürün Tanıtımı", desc: "Ne sunduğunuzu sade ve ikna edici şekilde anlatır" },
            { title: "Güven Alanı", desc: "Referans, yorum veya görsel galeri" },
            { title: "İletişim Bölümü", desc: "Form + WhatsApp + Google Harita" },
            { title: "Footer", desc: "İletişim bilgileri ve yasal bağlantılar" },
        ],
        extraPageNote: "Ek sayfa ihtiyacı için görüşelim — projeye özel fiyatlandırılır",
    },
    INSAAT: {
        idealFor: "Proje portföyünü dijitale taşımak isteyen inşaat ve yapı firmaları.",
        sections: [
            { title: "Ana Sayfa", desc: "Kurumsal kimlik, öne çıkan projeler, güven veren yapı" },
            { title: "Projeler (Admin Panelli)", desc: "Kategori bazlı portföy — konut, ticari, restorasyon" },
            { title: "Hizmetler", desc: "Sunduğunuz hizmetleri net ve ikna edici şekilde listeler" },
            { title: "Hakkımızda", desc: "Firma hikayesi, ekip, deneyim ve sertifikalar" },
            { title: "İletişim", desc: "Form, harita, WhatsApp ve iletişim bilgileri" },
            { title: "KVKK & Gizlilik", desc: "Yasal uyumluluk sayfaları" },
        ],
        extraPageNote: "Ek modül (blog, referanslar, sertifikalar): projeye özel fiyatlandırılır",
    },
    EMLAK: {
        idealFor: "Kendi ilanlarını yönetmek isteyen emlakçılar ve gayrimenkul firmaları.",
        sections: [
            { title: "Ana Sayfa", desc: "Öne çıkan ilanlar, arama kutusu, istatistikler" },
            { title: "İlan Listesi & Filtreleme", desc: "Fiyat, konum, oda sayısı, tip bazlı filtreleme" },
            { title: "İlan Detay", desc: "Galeri, harita, özellikler, iletişim formu" },
            { title: "Admin Paneli", desc: "İlan ekle / düzenle / sil — tarayıcıdan yönet" },
            { title: "Mesaj Yönetimi", desc: "Gelen iletişim formlarını panelden takip et" },
            { title: "Site Ayarları", desc: "Logo, iletişim bilgileri, sosyal medya — panelden güncelle" },
            { title: "KVKK & Gizlilik", desc: "Yasal uyumluluk sayfaları" },
        ],
        extraPageNote: "Ek modül (blog, çok şubeli yönetim): projeye özel fiyatlandırılır",
    },
    KAFE: {
        idealFor: "Dijital menü ve rezervasyon sistemi kurmak isteyen kafe & restoran işletmeleri.",
        sections: [
            { title: "Ana Sayfa", desc: "Atmosfer fotoğrafları, öne çıkan ürünler, çalışma saatleri" },
            { title: "Dijital Menü (Admin Panelli)", desc: "Kategori bazlı — içecek, yemek, tatlı, özel" },
            { title: "Galeri", desc: "Mekan ve ürün fotoğrafları" },
            { title: "Rezervasyon / İletişim", desc: "Form + WhatsApp + Google Harita" },
            { title: "Duyuru & Kampanya Yönetimi", desc: "Günlük menü, özel gün duyuruları panelden güncelle" },
            { title: "KVKK & Gizlilik", desc: "Yasal uyumluluk sayfaları" },
        ],
        extraPageNote: "Ek modül (online sipariş, sadakat kartı, çok şube): projeye özel",
    },
    OZEL_YAZILIM: {
        idealFor: "Özel süreçleri olan, entegrasyon ihtiyacı bulunan işletmeler.",
        sections: [
            { title: "Özel UI/UX tasarımı", desc: "" },
            { title: "İhtiyaca özel modüller", desc: "" },
            { title: "API & üçüncü parti entegrasyonlar", desc: "" },
            { title: "Özel yönetim panelleri", desc: "" },
            { title: "Raporlama & otomasyon sistemleri", desc: "" },
        ],
        extraPageNote: "Tüm özellikler proje kapsamında değerlendirilir",
    },
};

// ─── Fallback Plans ───────────────────────────────────────────────────────────
const FALLBACK_PLANS = [
    {
        _fallback: true,
        packageCode: "LANDING",
        badgeText: "Hızlı Başlangıç",
        discountPercentage: 0,
        isFeatured: false,
        name: "Landing Page",
        tagline: "Tek sayfa. Net mesaj. Hızlı dönüşüm.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "İletişime geçin → Ücretsiz teklif alın",
        deliveryTime: "5–7 iş günü",
        revisionCount: 1,
        supportDays: 30,
        features: [
            { featureText: "Markanıza özel modern tasarım", isMainFeature: true, displayOrder: 0 },
            { featureText: "Mobil, tablet ve masaüstü uyumlu", isMainFeature: true, displayOrder: 1 },
            { featureText: "SEO uyumlu altyapı (Google görünürlüğü)", isMainFeature: true, displayOrder: 2 },
            { featureText: "WhatsApp hızlı iletişim butonu", isMainFeature: true, displayOrder: 3 },
            { featureText: "İletişim formu entegrasyonu", isMainFeature: true, displayOrder: 4 },
            { featureText: "SSL sertifikası bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 5 },
            { featureText: "Hosting kurulumu bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 6 },
            { featureText: "Google Analytics kurulumu dahil", isMainFeature: true, displayOrder: 7 },
            { featureText: "Hız optimizasyonu (Lighthouse 90+)", isMainFeature: true, displayOrder: 8 },
            { featureText: "KVKK uyumluluk sayfası dahil", isMainFeature: true, displayOrder: 9 },
        ],
        notes: [
            { noteType: "SUCCESS", noteText: "Hosting + SSL + Analytics kurulumu fiyata dahildir. Siz sadece domain alırsınız." },
        ],
    },
    {
        _fallback: true,
        packageCode: "INSAAT",
        badgeText: "İnşaat & Yapı",
        discountPercentage: 0,
        isFeatured: false,
        name: "İnşaat Firması Web Sitesi",
        tagline: "Projelerinizi sergileyin, müşteri güvenini kazanın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "İletişime geçin → Ücretsiz teklif alın",
        deliveryTime: "10–14 iş günü",
        revisionCount: 2,
        supportDays: 60,
        features: [
            { featureText: "Proje portföy yönetimi (admin paneli)", isMainFeature: true, displayOrder: 0 },
            { featureText: "Proje kategori & filtreleme sistemi", isMainFeature: true, displayOrder: 1 },
            { featureText: "Fotoğraf galerisi & lightbox", isMainFeature: true, displayOrder: 2 },
            { featureText: "Hizmetler sayfası yönetimi", isMainFeature: true, displayOrder: 3 },
            { featureText: "İletişim formu + mesaj yönetim paneli", isMainFeature: true, displayOrder: 4 },
            { featureText: "WhatsApp entegrasyonu", isMainFeature: true, displayOrder: 5 },
            { featureText: "SSL sertifikası bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 6 },
            { featureText: "Hosting kurulumu bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 7 },
            { featureText: "Google Analytics kurulumu dahil", isMainFeature: true, displayOrder: 8 },
            { featureText: "Hız optimizasyonu (Lighthouse 90+)", isMainFeature: true, displayOrder: 9 },
            { featureText: "KVKK uyumluluk sayfası dahil", isMainFeature: true, displayOrder: 10 },
            { featureText: "Domain seçimi & kurulum yardımı", isMainFeature: true, displayOrder: 11 },
        ],
        notes: [
            { noteType: "SUCCESS", noteText: "Müşteri; proje ekler, fotoğraf yükler, hizmetleri düzenler — geliştirici aramak yok." },
        ],
    },
    {
        _fallback: true,
        packageCode: "EMLAK",
        badgeText: "Emlak & Gayrimenkul",
        discountPercentage: 0,
        isFeatured: false,
        name: "Emlak & Gayrimenkul Sitesi",
        tagline: "İlanlarınızı yönetin, müşteri kazanın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "İletişime geçin → Ücretsiz teklif alın",
        deliveryTime: "14–18 iş günü",
        revisionCount: 3,
        supportDays: 90,
        features: [
            { featureText: "Tam özellikli ilan yönetim paneli", isMainFeature: true, displayOrder: 0 },
            { featureText: "Satılık / kiralık / kategori filtreleme", isMainFeature: true, displayOrder: 1 },
            { featureText: "Harita üzerinde konum gösterimi", isMainFeature: true, displayOrder: 2 },
            { featureText: "Fotoğraf galerisi & lightbox", isMainFeature: true, displayOrder: 3 },
            { featureText: "İletişim formu + mesaj yönetim paneli", isMainFeature: true, displayOrder: 4 },
            { featureText: "İlan görüntülenme istatistikleri", isMainFeature: true, displayOrder: 5 },
            { featureText: "WhatsApp entegrasyonu", isMainFeature: true, displayOrder: 6 },
            { featureText: "SSL sertifikası bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 7 },
            { featureText: "Hosting kurulumu bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 8 },
            { featureText: "Google Analytics kurulumu dahil", isMainFeature: true, displayOrder: 9 },
            { featureText: "Hız optimizasyonu (Lighthouse 90+)", isMainFeature: true, displayOrder: 10 },
            { featureText: "KVKK uyumluluk sayfası dahil", isMainFeature: true, displayOrder: 11 },
            { featureText: "Domain seçimi & kurulum yardımı", isMainFeature: true, displayOrder: 12 },
        ],
        notes: [
            { noteType: "SUCCESS", noteText: "İlan ekle, düzenle, sil — hepsi admin panelinden. Geliştirici bağımlılığı sıfır." },
        ],
    },
    {
        _fallback: true,
        packageCode: "KAFE",
        badgeText: "Kafe & Restoran",
        discountPercentage: 0,
        isFeatured: false,
        name: "Kafe & Restoran Web Sitesi",
        tagline: "Menünüzü dijitale taşıyın, rezervasyon alın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "İletişime geçin → Ücretsiz teklif alın",
        deliveryTime: "8–12 iş günü",
        revisionCount: 2,
        supportDays: 60,
        features: [
            { featureText: "Dijital menü yönetimi (admin paneli)", isMainFeature: true, displayOrder: 0 },
            { featureText: "Kategori bazlı menü (içecek, yemek, tatlı...)", isMainFeature: true, displayOrder: 1 },
            { featureText: "Fotoğraf galerisi & atmosfer sunumu", isMainFeature: true, displayOrder: 2 },
            { featureText: "Rezervasyon / iletişim formu", isMainFeature: true, displayOrder: 3 },
            { featureText: "Google Harita entegrasyonu", isMainFeature: true, displayOrder: 4 },
            { featureText: "WhatsApp sipariş / rezervasyon butonu", isMainFeature: true, displayOrder: 5 },
            { featureText: "Çalışma saatleri & duyuru yönetimi", isMainFeature: true, displayOrder: 6 },
            { featureText: "SSL sertifikası bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 7 },
            { featureText: "Hosting kurulumu bizden — ekstra ödeme yok", isMainFeature: true, displayOrder: 8 },
            { featureText: "Google Analytics kurulumu dahil", isMainFeature: true, displayOrder: 9 },
            { featureText: "Hız optimizasyonu (Lighthouse 90+)", isMainFeature: true, displayOrder: 10 },
            { featureText: "KVKK uyumluluk sayfası dahil", isMainFeature: true, displayOrder: 11 },
        ],
        notes: [
            { noteType: "SUCCESS", noteText: "Menü fiyatını değiştirmek için geliştirici aramak yok. Admin panelinden saniyeler içinde güncelle." },
        ],
    },
    {
        _fallback: true,
        packageCode: "OZEL_YAZILIM",
        badgeText: "Bana Özel",
        discountPercentage: 0,
        isFeatured: false,
        name: "Özel Yazılım Çözümü",
        tagline: "Standart paketler yetmiyorsa.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "Projeye özel fiyatlandırma",
        deliveryTime: "1–3 ay (proje bazlı)",
        revisionCount: 0,
        supportDays: 0,
        features: [
            { featureText: "Tamamen size özel yazılım mimarisi", isMainFeature: true, displayOrder: 0 },
            { featureText: "API entegrasyonları (ödeme, SMS, ERP...)", isMainFeature: true, displayOrder: 1 },
            { featureText: "Özel CRM / ERP / stok sistemleri", isMainFeature: true, displayOrder: 2 },
            { featureText: "Rol bazlı kullanıcı yönetimi", isMainFeature: true, displayOrder: 3 },
            { featureText: "Raporlama & dashboard sistemleri", isMainFeature: true, displayOrder: 4 },
            { featureText: "SSL + Hosting + Domain yardımı dahil", isMainFeature: true, displayOrder: 5 },
            { featureText: "Google Analytics & izleme kurulumu", isMainFeature: true, displayOrder: 6 },
            { featureText: "Hız & güvenlik optimizasyonu", isMainFeature: true, displayOrder: 7 },
        ],
        notes: [
            { noteType: "NEUTRAL", noteText: "Detaylı analiz sonrası net kapsam ve fiyat belirlenir. Bağlayıcı değildir." },
        ],
    },
];

// ─── Fallback Maintenance Plans ───────────────────────────────────────────────
const FALLBACK_MAINT = [
    {
        _fallback: true,
        planCode: "LITE",
        badgeText: "Başlangıç",
        name: "Bakım Lite",
        monthlyPrice: null,
        idealFor: "Sabit içerikli, az güncelleme gerektiren siteler için ideal",
        isBestSeller: false,
        features: [
            { featureText: "Hosting bizden — siz ödemezsiniz", displayOrder: 0 },
            { featureText: "SSL sertifikası bizden — siz ödemezsiniz", displayOrder: 1 },
            { featureText: "Günlük otomatik yedekleme", displayOrder: 2 },
            { featureText: "7/24 uptime izleme", displayOrder: 3 },
            { featureText: "Aylık 2 içerik güncellemesi", displayOrder: 4 },
            { featureText: "Güvenlik taraması", displayOrder: 5 },
            { featureText: "Aylık teknik durum raporu", displayOrder: 6 },
            { featureText: "WhatsApp destek hattı", displayOrder: 7 },
        ],
    },
    {
        _fallback: true,
        planCode: "PRO",
        badgeText: "En Çok Tercih",
        name: "Bakım Pro",
        monthlyPrice: null,
        idealFor: "Aktif yönetilen, sık güncellenen siteler için ideal",
        isBestSeller: false,
        features: [
            { featureText: "Hosting bizden — siz ödemezsiniz", displayOrder: 0 },
            { featureText: "SSL sertifikası bizden — siz ödemezsiniz", displayOrder: 1 },
            { featureText: "Günlük otomatik yedekleme", displayOrder: 2 },
            { featureText: "7/24 uptime izleme", displayOrder: 3 },
            { featureText: "Aylık 5 içerik güncellemesi", displayOrder: 4 },
            { featureText: "Aylık SEO raporu (detaylı)", displayOrder: 5 },
            { featureText: "Google Analytics raporlama", displayOrder: 6 },
            { featureText: "PageSpeed optimizasyon takibi", displayOrder: 7 },
            { featureText: "Küçük tasarım değişiklikleri", displayOrder: 8 },
            { featureText: "Öncelikli WhatsApp destek (24s yanıt)", displayOrder: 9 },
        ],
    },
    {
        _fallback: true,
        planCode: "PREMIUM",
        badgeText: "Premium",
        name: "Bakım Premium",
        monthlyPrice: null,
        idealFor: "Büyüyen işletmeler — aktif geliştirme + tam destek",
        isBestSeller: false,
        features: [
            { featureText: "Hosting bizden — siz ödemezsiniz", displayOrder: 0 },
            { featureText: "SSL sertifikası bizden — siz ödemezsiniz", displayOrder: 1 },
            { featureText: "Saatlik otomatik yedekleme", displayOrder: 2 },
            { featureText: "7/24 uptime izleme + anlık uyarı", displayOrder: 3 },
            { featureText: "Aylık 10 içerik güncellemesi", displayOrder: 4 },
            { featureText: "Aylık 5 saat geliştirme saati", displayOrder: 5 },
            { featureText: "Detaylı SEO & Analytics raporu", displayOrder: 6 },
            { featureText: "Google Search Console takibi", displayOrder: 7 },
            { featureText: "Yeni özellik & modül eklemeleri", displayOrder: 8 },
            { featureText: "Aylık 30 dk strateji görüşmesi", displayOrder: 9 },
            { featureText: "Öncelikli destek (12s yanıt garantisi)", displayOrder: 10 },
        ],
    },
];

// ─── Policy Items ─────────────────────────────────────────────────────────────
const POLICY_ITEMS = [
    "Fiyat belirtilmeyen paketlerde proje kapsamı görüşmede belirlenir",
    "Hosting ve SSL tüm paketlerde bizden — ekstra ödeme yoktur",
    "Ek modül ve özel entegrasyonlar ayrıca planlanır",
    "Nihai fiyat ve ödeme planı teklif görüşmesinde netleştirilir",
    "Domain ücreti müşteriye aittir — diğer her şey bizden",
];

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ target, onExpire }) {
    const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setT({ d: 0, h: 0, m: 0, s: 0 });
                setExpired(true);
                onExpire?.();
                return;
            }
            setT({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target, onExpire]);

    if (expired) return null;

    const pad = n => String(n).padStart(2, "0");
    return (
        <div className="prc-countdown">
            {[["GÜN", t.d], ["SAAT", t.h], ["DAK", t.m], ["SN", t.s]].map(([l, v], i) => (
                <span key={l} style={{ display: "contents" }}>
                    {i > 0 && <span className="prc-countdown__sep">:</span>}
                    <div className="prc-countdown__item">
                        <div className="prc-countdown__box">{pad(v)}</div>
                        <div className="prc-countdown__label">{l}</div>
                    </div>
                </span>
            ))}
        </div>
    );
}

// ─── Plan Sections Component ──────────────────────────────────────────────────
function PlanSections({ sectionKey }) {
    const data = PLAN_SECTIONS[sectionKey];
    if (!data) return null;
    const { idealFor, sections, extraPageNote } = data;
    return (
        <div style={{ marginBottom: "16px" }}>
            <div style={{
                fontFamily: "var(--f-mono)", fontSize: "10px", letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--t-4)", marginBottom: "10px",
                paddingBottom: "8px", borderBottom: "1px solid var(--b-faint)",
            }}>
                Paket İçeriği ({sections.length} Bölüm)
            </div>
            {idealFor && (
                <p style={{
                    fontSize: "12px", color: "var(--t-3)", lineHeight: 1.6,
                    marginBottom: "10px", padding: "7px 10px",
                    background: "rgba(200,168,75,0.04)",
                    borderLeft: "2px solid var(--gold)", borderRadius: "0 4px 4px 0",
                }}>
                    <Check size={11} strokeWidth={2.5} style={{ color: "var(--gold)", display: "inline", marginRight: 5 }} />
                    {idealFor}
                </p>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {sections.map((s, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--t-2)", lineHeight: 1.5 }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: "6px" }} />
                        <span>
                            <strong>{s.title}</strong>
                            {s.desc && <span style={{ color: "var(--t-4)", fontSize: "12px" }}>: {s.desc}</span>}
                        </span>
                    </li>
                ))}
            </ul>
            {extraPageNote && (
                <div style={{
                    fontSize: "11px", color: "var(--t-4)", padding: "5px 10px",
                    background: "var(--bg-1)", borderRadius: "6px",
                    fontFamily: "var(--f-mono)", letterSpacing: "0.04em",
                }}>
                    {extraPageNote}
                </div>
            )}
        </div>
    );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────
export default function Pricing() {
    const dispatch = useDispatch();
    const { packages: backendPackages, loading: pkgLoading } = useSelector(s => s.pricing);
    const { activeCampaign } = useSelector(s => s.campaign);
    const { plans: backendPlans, loading: maintLoading } = useSelector(s => s.maintenance);

    const [selected, setSelected] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [campaignVisible, setCampaignVisible] = useState(true);

    useEffect(() => {
        dispatch(fetchActivePackages());
        dispatch(fetchActiveCampaign());
        dispatch(fetchPublicPlans());
    }, [dispatch]);

    useEffect(() => {
        setCampaignVisible(true);
    }, [activeCampaign]);

    const packages = (backendPackages && backendPackages.length > 0) ? backendPackages : FALLBACK_PLANS;
    const maintPlans = (backendPlans && backendPlans.length > 0) ? backendPlans : FALLBACK_MAINT;

    const now = new Date();
    const campaignEnd = activeCampaign?.endDate ? new Date(activeCampaign.endDate) : null;
    const hasCampaign =
        campaignVisible &&
        activeCampaign &&
        activeCampaign.isActive === true &&
        campaignEnd &&
        campaignEnd > now;

    const toggle = i => setExpanded(e => ({ ...e, [i]: !e[i] }));

    return (
        <>
            <style>{inlineStyles}</style>

            <SEO
                title="Web Sitesi Fiyatları 2026: İnşaat, Emlak, Kafe & Özel Yazılım | Algorixa"
                description="Sektöre özel web sitesi çözümleri: İnşaat firması, emlak & gayrimenkul, kafe & restoran ve özel yazılım paketleri. Hosting + SSL + Google Analytics bizden. İstanbul'da net kapsam, ücretsiz teklif alın."
                keywords="inşaat firması web sitesi fiyatı, emlak sitesi fiyatı, kafe web sitesi, gayrimenkul web sitesi, admin panelli web sitesi istanbul, hosting dahil web sitesi, ssl dahil web tasarım, web sitesi yaptırma 2026, web tasarım teklif al, kurumsal web sitesi istanbul, özel yazılım geliştirme istanbul"
                url="https://www.algorixa.com.tr/fiyatlandirma"
                canonical="https://www.algorixa.com.tr/fiyatlandirma"
            />

            {/* ── Hero ── */}
            <section className="page-hero">
                <VideoHero />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">Fiyatlandırma</span></div>
                    <h1 className="page-hero__title">
                        Sektörünüze Özel,<br />
                        <em>Her Şey Dahil</em> Çözümler
                    </h1>
                    <p className="page-hero__desc">
                        Hosting, SSL, Google Analytics ve KVKK sayfası tüm paketlerde bizden.
                        Siz sadece domaininizi alırsınız. Gizli ücret yok, sürpriz yok.
                    </p>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">

                    {/* ── Her Şey Dahil Özet Bant ── */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: "8px",
                        padding: "14px 18px", marginBottom: "40px",
                        background: "rgba(200,168,75,0.06)",
                        border: "1px solid rgba(200,168,75,0.2)",
                        borderRadius: "12px", alignItems: "center",
                    }}>
                        <span style={{
                            fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--t-4)",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            marginRight: "4px", whiteSpace: "nowrap",
                        }}>
                            Her pakete dahil →
                        </span>
                        {["SSL Sertifikası", "Hosting", "Google Analytics", "Hız Optimizasyonu",
                            "KVKK Sayfası", "Domain Yardımı", "Mobil Uyumluluk", "WhatsApp Entegrasyonu",
                        ].map(item => (
                            <span key={item} style={{
                                display: "inline-flex", alignItems: "center", gap: "4px",
                                padding: "4px 10px", borderRadius: "100px",
                                background: "rgba(200,168,75,0.1)",
                                border: "1px solid rgba(200,168,75,0.22)",
                                fontSize: "12px", color: "var(--t-2)", whiteSpace: "nowrap",
                            }}>
                                <Check size={10} strokeWidth={2.5} style={{ color: "var(--gold)" }} />
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* ── Kampanya Barı ── */}
                    {hasCampaign && (
                        <div className="prc-promo-bar">
                            <div className="prc-promo-bar__left">
                                <div className="prc-promo-bar__title">
                                    <Zap size={16} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                    {activeCampaign.promoBarTitle || activeCampaign.campaignName || "Sınırlı Süreli Kampanya"}
                                </div>
                                <p className="prc-promo-bar__desc">
                                    {activeCampaign.promoBarDescription || activeCampaign.description ||
                                        "Bu dönemde seçili paketlerde avantajlı fiyatlar, projenin referans olarak gösterilmesi karşılığında sunulmaktadır."}
                                </p>
                                <div className="prc-promo-bar__highlights">
                                    {["Hosting dahil", "SSL dahil", "7 gün içinde başlangıç"].map(h => (
                                        <span key={h} className="prc-promo-highlight">
                                            <Check size={11} strokeWidth={2.5} style={{ color: "var(--gold)" }} />
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Countdown
                                target={campaignEnd.getTime()}
                                onExpire={() => setCampaignVisible(false)}
                            />
                        </div>
                    )}

                    {/* ── Paket Kartları ── */}
                    {pkgLoading ? (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                            <div style={{
                                width: "40px", height: "40px", margin: "0 auto",
                                border: "3px solid rgba(255,255,255,0.1)",
                                borderTop: "3px solid rgba(200,168,75,0.8)",
                                borderRadius: "50%", animation: "spin 1s linear infinite",
                            }} />
                        </div>
                    ) : (
                        <div className="prc-plans">
                            {packages.map((p, i) => {
                                const isOpen = !!expanded[i];
                                const isSelected = selected === i;
                                const sectionKey = resolveSectionKey(p.packageCode);

                                const sortedFeatures = [...(p.features || [])].sort(
                                    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
                                );
                                const mainFeatures = sortedFeatures.filter(f => f.isMainFeature);
                                const displayFeatures = (mainFeatures.length > 0 ? mainFeatures : sortedFeatures).slice(0, 6);
                                const hiddenCount = sortedFeatures.length - 6;

                                const origNum = toNum(p.originalPrice);
                                const currNum = toNum(p.currentPrice);
                                const savingsNum = origNum && currNum ? origNum - currNum : null;
                                const discount = p.discountPercentage > 0 ? `%${p.discountPercentage}` : null;

                                const hasOzel = p.packageCode?.toUpperCase().includes("OZEL");

                                return (
                                    <div
                                        key={p.id || p.packageCode || i}
                                        className={`prc-card${isSelected ? " prc-card--selected" : ""}`}
                                        onClick={() => setSelected(isSelected ? null : i)}
                                    >
                                        {discount && (
                                            <div className="prc-card__discount">
                                                <Timer size={11} strokeWidth={2} />
                                                {discount}
                                            </div>
                                        )}

                                        <div className="prc-card__badge">{p.badgeText}</div>
                                        <h3 className="prc-card__name">{p.name}</h3>
                                        <p className="prc-card__tagline">{p.tagline}</p>

                                        {/* ── Fiyat ── */}
                                        <div className="prc-card__price-area">
                                            {origNum && (
                                                <div className="prc-card__orig">{formatPrice(origNum)}</div>
                                            )}
                                            {currNum ? (
                                                <div className="prc-card__price">{formatPrice(currNum)}</div>
                                            ) : (
                                                <div style={{
                                                    fontSize: "15px", fontWeight: 700,
                                                    color: "var(--gold)", marginBottom: "4px",
                                                    fontFamily: "var(--f-display)",
                                                }}>
                                                    Ücretsiz Teklif Al
                                                </div>
                                            )}
                                            {p.priceNote && (
                                                <div className="prc-card__note">{p.priceNote}</div>
                                            )}
                                            {savingsNum > 0 && (
                                                <div className="prc-card__savings">
                                                    <Zap size={11} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                                    {formatPrice(savingsNum)} tasarruf
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Özellikler ── */}
                                        <ul className="prc-card__features">
                                            {displayFeatures.map((f, fi) => (
                                                <li key={fi} className="prc-card__feature">
                                                    <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                    {f.featureText}
                                                </li>
                                            ))}
                                            {hiddenCount > 0 && !isOpen && (
                                                <li style={{
                                                    fontSize: "11px", color: "var(--t-4)",
                                                    fontFamily: "var(--f-mono)", paddingLeft: "20px",
                                                    letterSpacing: "0.04em",
                                                }}>
                                                    +{hiddenCount} özellik daha →
                                                </li>
                                            )}
                                        </ul>

                                        {/* ── Detayları Gör ── */}
                                        <button
                                            className="prc-card__detail-toggle"
                                            onClick={e => { e.stopPropagation(); toggle(i); }}
                                            aria-expanded={isOpen}
                                        >
                                            {isOpen
                                                ? <><ChevronUp size={13} strokeWidth={2} /> Detayları Gizle</>
                                                : <><ChevronDown size={13} strokeWidth={2} /> Tüm Detayları Gör</>
                                            }
                                        </button>

                                        {/* ── Genişletilmiş İçerik ── */}
                                        {isOpen && (
                                            <div className="prc-card__expanded">
                                                <PlanSections sectionKey={sectionKey} />
                                                {hiddenCount > 0 && (
                                                    <div style={{ marginBottom: "6px" }}>
                                                        <div style={{
                                                            fontFamily: "var(--f-mono)", fontSize: "10px",
                                                            letterSpacing: "0.12em", textTransform: "uppercase",
                                                            color: "var(--t-4)", marginBottom: "8px",
                                                        }}>
                                                            Tüm Özellikler ({sortedFeatures.length})
                                                        </div>
                                                        {sortedFeatures.map((f, fi) => (
                                                            <div key={fi} className="prc-card__expanded-item">
                                                                <Check size={11} strokeWidth={2} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                                {f.featureText}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Notlar ── */}
                                        {(p.notes || [])
                                            .filter(n => {
                                                const t = resolveNoteType(n.noteType);
                                                return t === "success" || t === "warn" || t === "neutral";
                                            })
                                            .map((note, ni) => {
                                                const nType = resolveNoteType(note.noteType);
                                                return (
                                                    <div key={ni} className={`prc-card__note-box prc-card__note-box--${nType}`}>
                                                        {nType === "warn" && <AlertCircle size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                                                        {nType === "success" && <Check size={13} strokeWidth={2} style={{ flexShrink: 0 }} />}
                                                        {note.noteText}
                                                    </div>
                                                );
                                            })}

                                        {/* ── CTA ── */}
                                        <Link
                                            to="/iletisim"
                                            className="prc-card__cta btn btn--outline"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            Fiyat Teklifi İste
                                        </Link>

                                        {/* ── Meta Bilgiler — CTA altında ── */}
                                        {(p.deliveryTime || p.revisionCount > 0 || p.supportDays > 0 || hasOzel) && (
                                            <div className="prc-card__meta-row">
                                                {p.deliveryTime && (
                                                    <span className="prc-card__meta-item">
                                                        <Timer size={10} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                                        Teslim: {p.deliveryTime}
                                                    </span>
                                                )}
                                                {p.revisionCount > 0 && (
                                                    <span className="prc-card__meta-item">
                                                        <Clock size={10} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                                        {p.revisionCount} revizyon hakkı
                                                    </span>
                                                )}
                                                {p.supportDays > 0 && (
                                                    <span className="prc-card__meta-item">
                                                        <Shield size={10} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                                        {p.supportDays} gün teknik destek
                                                    </span>
                                                )}
                                                {hasOzel && (
                                                    <span className="prc-card__meta-item">
                                                        <Check size={10} strokeWidth={2.5} style={{ color: "var(--gold)" }} />
                                                        Süresiz premium destek
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Politika ── */}
                    <div className="prc-policy">
                        <div className="prc-policy__label">
                            <Shield size={13} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                            Şeffaf Fiyatlandırma Politikamız
                        </div>
                        <ul className="prc-policy__list">
                            {POLICY_ITEMS.map(n => (
                                <li key={n} className="prc-policy__item">
                                    <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                    {n}
                                </li>
                            ))}
                        </ul>
                        <p className="prc-policy__foot">Net kapsam, net fiyat. Sonradan sürpriz yok.</p>
                    </div>

                    {/* ── CTA Bant ── */}
                    <div className="prc-cta-bar">
                        <div className="prc-cta-bar__text">
                            <h2>Hangi Paket Size Uygun?</h2>
                            <p>24 saat içinde ücretsiz görüşme ve net teklif. Bağlayıcı değildir, baskı yoktur.</p>
                        </div>
                        <Link to="/iletisim" className="btn btn--primary btn--lg btn--mono">
                            Ücretsiz Görüşme →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Bakım Paketleri ── */}
            <section className="page-section page-section--alt section-border-top">
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Aylık Bakım Paketleri</span></div>
                    <h2 className="t-heading" style={{ marginBottom: "16px" }}>
                        Projeniz Bittikten Sonra da Yanınızdayız
                    </h2>
                    <p style={{ color: "var(--t-2)", marginBottom: "28px", maxWidth: "580px", lineHeight: 1.8 }}>
                        Hosting, SSL, güncelleme, SEO takibi ve teknik destek tek pakette —
                        hepsi bizden. Aylık ödeme, 15 gün önceden iptal bildirimi yeterli.
                    </p>

                    {/* Bakım Dahil Olanlar */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: "8px",
                        marginBottom: "44px", padding: "12px 16px",
                        background: "rgba(200,168,75,0.05)",
                        border: "1px solid rgba(200,168,75,0.15)",
                        borderRadius: "10px", alignItems: "center",
                    }}>
                        <span style={{
                            fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--t-4)",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            marginRight: "4px", whiteSpace: "nowrap",
                        }}>
                            Tüm paketlerde →
                        </span>
                        {["Hosting bizden", "SSL bizden", "Otomatik yedekleme", "7/24 uptime izleme", "WhatsApp destek"].map(item => (
                            <span key={item} style={{
                                padding: "3px 10px", borderRadius: "100px",
                                background: "rgba(200,168,75,0.08)",
                                border: "1px solid rgba(200,168,75,0.2)",
                                fontSize: "12px", color: "var(--t-2)", whiteSpace: "nowrap",
                            }}>
                                {item}
                            </span>
                        ))}
                    </div>

                    {maintLoading ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{
                                width: "36px", height: "36px", margin: "0 auto",
                                border: "3px solid rgba(255,255,255,0.1)",
                                borderTop: "3px solid rgba(200,168,75,0.8)",
                                borderRadius: "50%", animation: "spin 1s linear infinite",
                            }} />
                        </div>
                    ) : (
                        <div className="maint-grid">
                            {maintPlans.map((m, mi) => {
                                const isBest = m.isBestSeller;
                                const priceNum = toNum(m.monthlyPrice);
                                const sortedFeatures = [...(m.features || [])].sort(
                                    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
                                );
                                return (
                                    <div key={m.id || m.planCode || mi} className={`maint-card${isBest ? " maint-card--best" : ""}`}>
                                        <span className="maint-card__badge">{m.badgeText}</span>
                                        <h3>{m.name}</h3>
                                        <div className="maint-card__price">
                                            {priceNum ? (
                                                <>{formatPrice(priceNum)}<span>/ay</span></>
                                            ) : (
                                                <span style={{
                                                    fontSize: "14px", fontWeight: 700,
                                                    color: "var(--gold)", fontFamily: "var(--f-display)",
                                                }}>
                                                    Teklif için iletişime geçin
                                                </span>
                                            )}
                                        </div>
                                        <div className="maint-card__ideal">{m.idealFor}</div>
                                        {sortedFeatures.map((f, fi) => (
                                            <div key={fi} className="maint-card__feature">
                                                <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                {f.featureText}
                                            </div>
                                        ))}
                                        <Link
                                            to="/iletisim"
                                            className={`btn ${isBest ? "btn--primary" : "btn--outline"} btn--full btn--mono btn--sm`}
                                            style={{ marginTop: "20px" }}
                                        >
                                            {isBest ? "Bu Paketi İstiyorum →" : "Teklif Al →"}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="maint-footer-note">
                        {[
                            "Aylık ödeme — taahhüt yok",
                            "15 gün önceden iptal yeterli",
                            "Domain her zaman sizin adınıza",
                            "Hosting & SSL bizden — ekstra ödeme yok",
                        ].map(t => (
                            <span key={t}>
                                <Check size={11} strokeWidth={2.5} style={{ color: "var(--gold)", display: "inline", marginRight: 5 }} />
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePackages } from "../redux/pricingSlice";
import { fetchActiveCampaign } from "../redux/campaignSlice";
import { fetchPublicPlans } from "../redux/maintenanceSlice";
import {
    Check, ChevronDown, ChevronUp, Zap, Clock, Shield,
    Star, Package, Code2, Cpu, Layout, Server, Timer,
    BarChart3, RefreshCw, AlertCircle, MessageCircle,
    Building2, Home, Coffee, Wrench
} from "lucide-react";
import SEO from "../components/Seo";

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
                    color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 500
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

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const ICON_MAP = {
    Layout, Package, Star, Cpu, Code2, Server, BarChart3,
    RefreshCw, Zap, Shield, Clock, Timer, Building2, Home, Coffee, Wrench
};
function resolveIcon(name) {
    return (name && ICON_MAP[name]) || Package;
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
    // 1. LANDING PAGE
    {
        _fallback: true,
        packageCode: "LANDING",
        iconName: "Layout",
        badgeText: "Hızlı Başlangıç",
        discountPercentage: 0,
        isFeatured: false,
        name: "Landing Page",
        tagline: "Tek sayfa. Net mesaj. Hızlı dönüşüm.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "iletişime geçin → ücretsiz teklif alın",
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

    // 2. İNŞAAT FİRMASI
    {
        _fallback: true,
        packageCode: "INSAAT",
        iconName: "Building2",
        badgeText: "İnşaat & Yapı",
        discountPercentage: 0,
        isFeatured: false,
        name: "İnşaat Firması Web Sitesi",
        tagline: "Projelerinizi sergileyin, müşteri güvenini kazanın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "iletişime geçin → ücretsiz teklif alın",
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
            { noteType: "NEUTRAL", noteText: "Hosting + SSL + Analytics dahil. Siz sadece domain alırsınız." },
        ],
    },

    // 3. EMLAK (FEATURED)
    {
        _fallback: true,
        packageCode: "EMLAK",
        iconName: "Home",
        badgeText: "En Çok Tercih Edilen",
        discountPercentage: 0,
        isFeatured: false,
        name: "Emlak & Gayrimenkul Sitesi",
        tagline: "İlanlarınızı yönetin, müşteri kazanın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "iletişime geçin → ücretsiz teklif alın",
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
            { noteType: "NEUTRAL", noteText: "Hosting + SSL + Analytics dahil. Siz sadece domain alırsınız." },
        ],
    },

    // 4. KAFE & RESTORAN
    {
        _fallback: true,
        packageCode: "KAFE",
        iconName: "Coffee",
        badgeText: "Kafe & Restoran",
        discountPercentage: 0,
        isFeatured: false,
        name: "Kafe & Restoran Web Sitesi",
        tagline: "Menünüzü dijitale taşıyın, rezervasyon alın.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "iletişime geçin → ücretsiz teklif alın",
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
            { noteType: "NEUTRAL", noteText: "Hosting + SSL + Analytics dahil. Siz sadece domain alırsınız." },
        ],
    },

    // 5. ÖZEL YAZILIM
    {
        _fallback: true,
        packageCode: "OZEL_YAZILIM",
        iconName: "Cpu",
        badgeText: "Bana Özel",
        discountPercentage: 0,
        isFeatured: false,
        name: "Özel Yazılım Çözümü",
        tagline: "Standart paketler yetmiyorsa.",
        originalPrice: null,
        currentPrice: null,
        priceNote: "projeye özel fiyatlandırma",
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
        iconName: "Server",
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
        iconName: "BarChart3",
        badgeText: "En Çok Tercih",
        name: "Bakım Pro",
        monthlyPrice: null,
        idealFor: "Aktif yönetilen, sık güncellenen siteler için ideal",
        isBestSeller: true,
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
        iconName: "RefreshCw",
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
                display: "flex", alignItems: "center", gap: "6px"
            }}>
                Paket İçeriği ({sections.length} Bölüm)
            </div>
            {idealFor && (
                <p style={{
                    fontSize: "12px", color: "var(--t-3)", lineHeight: 1.6,
                    marginBottom: "10px", padding: "7px 10px",
                    background: "rgba(200,168,75,0.04)",
                    borderLeft: "2px solid var(--gold)", borderRadius: "0 4px 4px 0"
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
                    fontFamily: "var(--f-mono)", letterSpacing: "0.04em"
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

    const [selected, setSelected] = useState(2);
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
                        <em>Her Şey Dahil</em>
                        Çözümler
                    </h1>
                    <p className="page-hero__desc">
                        Hosting, SSL, Google Analytics ve KVKK sayfası tüm paketlerde bizden.
                        Siz sadece domaininizi alırsınız.
                        Gizli ücret yok, sürpriz yok.
                    </p>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">

                    {/* ── Her Şey Dahil Özet Bant ── */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: "10px",
                        padding: "16px 20px", marginBottom: "40px",
                        background: "rgba(200,168,75,0.06)",
                        border: "1px solid rgba(200,168,75,0.2)",
                        borderRadius: "12px",
                    }}>
                        <span style={{ fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--t-4)", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "4px", alignSelf: "center" }}>
                            Her pakete dahil →
                        </span>
                        {[
                            "SSL Sertifikası",
                            "Hosting",
                            "Google Analytics",
                            "Hız Optimizasyonu",
                            "KVKK Sayfası",
                            "Domain Yardımı",
                            "Mobil Uyumluluk",
                            "WhatsApp Entegrasyonu",
                        ].map(item => (
                            <span key={item} style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                padding: "5px 12px", borderRadius: "100px",
                                background: "rgba(200,168,75,0.1)",
                                border: "1px solid rgba(200,168,75,0.25)",
                                fontSize: "12px", color: "var(--t-2)",
                            }}>
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* ── Kampanya barı ── */}
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

                    {/* ── Paket kartları ── */}
                    {pkgLoading ? (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                            <div style={{
                                width: "40px", height: "40px", margin: "0 auto",
                                border: "3px solid rgba(255,255,255,0.1)",
                                borderTop: "3px solid rgba(200,168,75,0.8)",
                                borderRadius: "50%", animation: "spin 1s linear infinite"
                            }} />
                        </div>
                    ) : (
                        <div className="prc-plans">
                            {packages.map((p, i) => {
                                const PIcon = resolveIcon(p.iconName);
                                const isOpen = !!expanded[i];
                                const sectionKey = resolveSectionKey(p.packageCode);

                                const sortedFeatures = [...(p.features || [])].sort(
                                    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
                                );
                                const mainFeatures = sortedFeatures.filter(f => f.isMainFeature);
                                const displayFeatures = mainFeatures.length > 0 ? mainFeatures : sortedFeatures.slice(0, 6);

                                const origNum = toNum(p.originalPrice);
                                const currNum = toNum(p.currentPrice);
                                const savingsNum = origNum && currNum ? origNum - currNum : null;
                                const discount = p.discountPercentage > 0 ? `%${p.discountPercentage}` : null;

                                return (
                                    <div
                                        key={p.id || p.packageCode || i}
                                        className={`prc-card${p.isFeatured ? " prc-card--featured" : ""}${selected === i ? " prc-card--selected" : ""}`}
                                        onClick={() => setSelected(i)}
                                    >
                                        {discount && (
                                            <div className="prc-card__discount">
                                                <Timer size={11} strokeWidth={2} />
                                                {discount}
                                            </div>
                                        )}
                                        {p.isFeatured && <div className="prc-card__featured-bar" />}

                                        <div className="prc-card__icon-wrap">
                                            <PIcon size={22} strokeWidth={1.4} />
                                        </div>

                                        <div className="prc-card__badge">{p.badgeText}</div>
                                        <h3 className="prc-card__name">{p.name}</h3>
                                        <p className="prc-card__tagline">{p.tagline}</p>

                                        {/* Fiyat Alanı */}
                                        <div className="prc-card__price-area">
                                            {origNum && (
                                                <div className="prc-card__orig">{formatPrice(origNum)}</div>
                                            )}
                                            {currNum ? (
                                                <div className={`prc-card__price${p.isFeatured ? " prc-card__price--gold" : ""}`}>
                                                    {formatPrice(currNum)}
                                                </div>
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

                                        {/* Özellikler */}
                                        <ul className="prc-card__features">
                                            {displayFeatures.map((f, fi) => (
                                                <li key={fi} className="prc-card__feature">
                                                    <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                    {f.featureText}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Detayları Gör */}
                                        <button
                                            className="prc-card__detail-toggle"
                                            onClick={e => { e.stopPropagation(); toggle(i); }}
                                            aria-expanded={isOpen}
                                        >
                                            {isOpen
                                                ? <><ChevronUp size={13} strokeWidth={2} /> Detayları Gizle</>
                                                : <><ChevronDown size={13} strokeWidth={2} /> Detayları Gör</>
                                            }
                                        </button>

                                        {/* Genişletilmiş Detay */}
                                        {isOpen && (
                                            <div className="prc-card__expanded">
                                                <PlanSections sectionKey={sectionKey} />

                                                {sortedFeatures.length > displayFeatures.length && (
                                                    <div style={{ marginBottom: "14px" }}>
                                                        <div style={{
                                                            fontFamily: "var(--f-mono)", fontSize: "10px",
                                                            letterSpacing: "0.12em", textTransform: "uppercase",
                                                            color: "var(--t-4)", marginBottom: "8px"
                                                        }}>
                                                            Tüm Özellikler
                                                        </div>
                                                        {sortedFeatures.map((f, fi) => (
                                                            <div key={fi} className="prc-card__expanded-item">
                                                                <Check size={11} strokeWidth={2} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                                {f.featureText}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div style={{ borderTop: "1px solid var(--b-faint)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                                    {p.deliveryTime && (
                                                        <div className="prc-card__expanded-item">
                                                            <Timer size={11} strokeWidth={1.5} style={{ color: "var(--t-4)", flexShrink: 0 }} />
                                                            Teslim: {p.deliveryTime}
                                                        </div>
                                                    )}
                                                    {p.revisionCount > 0 && (
                                                        <div className="prc-card__expanded-item">
                                                            <Clock size={11} strokeWidth={1.5} style={{ color: "var(--t-4)", flexShrink: 0 }} />
                                                            {p.revisionCount} revizyon turu dahil
                                                        </div>
                                                    )}
                                                    {p.supportDays > 0 && (
                                                        <div className="prc-card__expanded-item">
                                                            <Shield size={11} strokeWidth={1.5} style={{ color: "var(--t-4)", flexShrink: 0 }} />
                                                            {p.supportDays} gün teknik destek
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Notlar */}
                                        {(p.notes || []).map((note, ni) => {
                                            const nType = resolveNoteType(note.noteType);
                                            return (
                                                <div key={ni} className={`prc-card__note-box prc-card__note-box--${nType}`}>
                                                    {nType === "warn" && <AlertCircle size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                                                    {nType === "success" && <Check size={13} strokeWidth={2} style={{ flexShrink: 0 }} />}
                                                    {note.noteText}
                                                </div>
                                            );
                                        })}

                                        {/* CTA Butonu */}
                                        <Link
                                            to="/iletisim"
                                            className={`prc-card__cta btn ${p.isFeatured ? "btn--primary" : "btn--outline"}`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {p.isFeatured ? "Ücretsiz Teklif Al" : "Fiyat Teklifi İste"}
                                        </Link>

                                        {/* Kart Footer */}
                                        <div className="prc-card__footer">
                                            {p.deliveryTime && (
                                                <span>
                                                    <Timer size={10} strokeWidth={2} style={{ color: "var(--gold)", display: "inline", marginRight: 4 }} />
                                                    {p.deliveryTime}
                                                </span>
                                            )}
                                            {p.supportDays > 0 && (
                                                <span>
                                                    <Shield size={10} strokeWidth={2} style={{ color: "var(--gold)", display: "inline", marginRight: 4 }} />
                                                    {p.supportDays} Gün Destek
                                                </span>
                                            )}
                                            {p.packageCode?.toUpperCase().includes("OZEL") && (
                                                <span>
                                                    <Check size={10} strokeWidth={2.5} style={{ color: "var(--gold)", display: "inline", marginRight: 3 }} />
                                                    Süresiz Premium Destek
                                                </span>
                                            )}
                                        </div>
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
                        <p className="prc-policy__foot">
                            Net kapsam, net fiyat. Sonradan sürpriz yok.
                        </p>
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

                    {/* Bakım Dahil Olanlar Özet */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: "8px",
                        marginBottom: "44px", padding: "14px 18px",
                        background: "rgba(200,168,75,0.05)",
                        border: "1px solid rgba(200,168,75,0.15)",
                        borderRadius: "10px",
                    }}>
                        <span style={{ fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--t-4)", textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", marginRight: "4px" }}>
                            Tüm paketlerde →
                        </span>
                        {[
                            "Hosting bizden",
                            "SSL bizden",
                            "Otomatik yedekleme",
                            "7/24 uptime izleme",
                            "WhatsApp destek",
                        ].map(item => (
                            <span key={item} style={{
                                padding: "4px 11px", borderRadius: "100px",
                                background: "rgba(200,168,75,0.08)",
                                border: "1px solid rgba(200,168,75,0.2)",
                                fontSize: "12px", color: "var(--t-2)",
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
                                borderRadius: "50%", animation: "spin 1s linear infinite"
                            }} />
                        </div>
                    ) : (
                        <div className="maint-grid">
                            {maintPlans.map((m, mi) => {
                                const MIcon = resolveIcon(m.iconName);
                                const isBest = m.isBestSeller;
                                const priceNum = toNum(m.monthlyPrice);
                                const sortedFeatures = [...(m.features || [])].sort(
                                    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
                                );
                                return (
                                    <div key={m.id || m.planCode || mi} className={`maint-card${isBest ? " maint-card--best" : ""}`}>
                                        <div className="maint-card__icon">
                                            <MIcon size={20} strokeWidth={1.4} />
                                        </div>
                                        <span className="maint-card__badge">{m.badgeText}</span>
                                        <h3>{m.name}</h3>

                                        {/* Fiyat — varsa göster, yoksa teklif al */}
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
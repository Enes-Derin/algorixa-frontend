import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePackages } from "../redux/pricingSlice";
import { fetchActiveCampaign } from "../redux/campaignSlice";
import { fetchPublicPlans } from "../redux/maintenanceSlice";
import {
    Check, ChevronDown, ChevronUp, Zap, Clock, Shield,
    Star, Package, Code2, Cpu, Layout, Server, Timer,
    BarChart3, RefreshCw, AlertCircle
} from "lucide-react";
import SEO from "../components/Seo";

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const handleError = () => { setHasError(true); };
        v.addEventListener('loadeddata', handleLoad);
        v.addEventListener('error', handleError);
        return () => {
            v.removeEventListener('loadeddata', handleLoad);
            v.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <div className="hero-video-wrap" aria-hidden>
            {!isLoaded && (
                <div className="hero-video__poster" style={{
                    backgroundImage: 'url(/hero-poster.jpg)', backgroundSize: 'cover',
                    backgroundPosition: 'center', position: 'absolute', inset: 0, zIndex: 1
                }} />
            )}
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline
                preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
                <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="hero-video__overlay" style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                position: 'absolute', inset: 0, zIndex: 2
            }} />
            <div className="hero-video__grain" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                opacity: 0.03, position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none'
            }} />
            <div className="hero-video__fade-bottom" style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%)',
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 4
            }} />
            {!isLoaded && !hasError && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', zIndex: 5,
                    color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500
                }}>
                    <div className="loading-spinner" style={{
                        width: '40px', height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid rgba(200,168,75,0.8)',
                        borderRadius: '50%', animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }} />
                    Video yükleniyor...
                </div>
            )}
        </div>
    );
}

const ICON_MAP = {
    Layout, Package, Star, Cpu, Code2, Server, BarChart3, RefreshCw, Zap, Shield, Clock, Timer
};
function resolveIcon(name) {
    return (name && ICON_MAP[name]) || Package;
}

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
    if (c.includes("STATIK") || c.includes("STATIC")) return "KURUMSAL_STATIK";
    if (c.includes("DINAMIK") || c.includes("DYNAMIC")) return "KURUMSAL_DINAMIK";
    if (c.includes("OZEL") || c.includes("CUSTOM") || c.includes("SPECIAL")) return "OZEL_YAZILIM";
    return null;
}

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
        extraPageNote: "Ek sayfa: ₺2.000/sayfa",
    },
    KURUMSAL_STATIK: {
        idealFor: "Sabit hizmetleri olan, içerik güncellemesini nadiren yapan firmalar.",
        sections: [
            { title: "Ana Sayfa", desc: "Kurumsal kimliği yansıtan, güven odaklı yapı" },
            { title: "Hakkımızda", desc: "Firma hikayesi ve güven veren anlatım" },
            { title: "Hizmetler / Ürünler", desc: "Net açıklamalar, sade sunum" },
            { title: "Referanslar / Projeler", desc: "Güven artırıcı örnek çalışmalar" },
            { title: "Blog (Statik)", desc: "5 adet SEO uyumlu içerik" },
            { title: "İletişim", desc: "Form, harita ve iletişim bilgileri" },
            { title: "KVKK & Gizlilik", desc: "Yasal uyumluluk sayfaları" },
        ],
        extraPageNote: "Ek sayfa: ₺2.500/sayfa",
    },
    KURUMSAL_DINAMIK: {
        idealFor: "Blog yazan, kampanya yapan, sürekli güncelleme ihtiyacı olan firmalar.",
        sections: [
            { title: "Ana Sayfa", desc: "Dinamik banner, kampanya ve duyuru alanları" },
            { title: "Hakkımızda", desc: "Kolayca güncellenebilir içerik" },
            { title: "Hizmetler / Ürünler", desc: "Sınırsız ekle-çıkar özelliği" },
            { title: "Referanslar / Portfolyo", desc: "Projeleri panelden yönet" },
            { title: "Blog Sistemi", desc: "Sınırsız yazı, kategori ve SEO alanları" },
            { title: "Galeri", desc: "Fotoğraf & video yönetimi" },
            { title: "İletişim & Teklif Formu", desc: "Otomatik e-posta bildirimleri" },
            { title: "SSS & Duyurular", desc: "Müşteri sorularını azaltan yapı" },
            { title: "KVKK & Yasal Sayfalar", desc: "" },
        ],
        extraPageNote: "Ek sayfa: ₺3.000/sayfa",
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

const FALLBACK_PLANS = [
    {
        _fallback: true,
        packageCode: "LANDING",
        iconName: "Layout",
        badgeText: "Hızlı Başlangıç",
        discountPercentage: 27,
        isFeatured: false,
        name: "Landing Page",
        tagline: "Tek sayfa. Net mesaj. Hızlı dönüşüm.",
        originalPrice: "10900",
        currentPrice: "7900",
        priceNote: "başlayan fiyatlarla",
        deliveryTime: "5–7 iş günü",
        revisionCount: 1,
        supportDays: 30,
        features: [
            { featureText: "Markanıza özel modern tasarım", isMainFeature: true, displayOrder: 0 },
            { featureText: "Mobil, tablet ve masaüstü uyumlu yapı", isMainFeature: true, displayOrder: 1 },
            { featureText: "SEO uyumlu altyapı (Google görünürlüğü)", isMainFeature: true, displayOrder: 2 },
            { featureText: "WhatsApp hızlı iletişim butonu", isMainFeature: true, displayOrder: 3 },
            { featureText: "Form entegrasyonu", isMainFeature: true, displayOrder: 4 },
        ],
        notes: [{ noteType: "NEUTRAL", noteText: "Dijitale ilk adımınızı atmak için ideal başlangıç." }],
    },
    {
        _fallback: true,
        packageCode: "KURUMSAL_STATIK",
        iconName: "Package",
        badgeText: "Bakım Derdi Yok",
        discountPercentage: 21,
        isFeatured: false,
        name: "Kurumsal Web – Statik",
        tagline: "Kurumsal görünüm. Bakım derdi yok.",
        originalPrice: "18900",
        currentPrice: "14900",
        priceNote: "başlayan fiyatlarla",
        deliveryTime: "8–10 iş günü",
        revisionCount: 2,
        supportDays: 60,
        features: [
            { featureText: "Kurumsal ve sade tasarım", isMainFeature: true, displayOrder: 0 },
            { featureText: "Hızlı açılan sayfalar", isMainFeature: true, displayOrder: 1 },
            { featureText: "SEO uyumlu yapı", isMainFeature: true, displayOrder: 2 },
            { featureText: "Kurumsal e-posta & harita entegrasyonu", isMainFeature: true, displayOrder: 3 },
            { featureText: "SSL sertifikası", isMainFeature: true, displayOrder: 4 },
        ],
        notes: [{ noteType: "WARN", noteText: "İçerik güncellemeleri için geliştirici desteği gerekir (admin panel yok)." }],
    },
    {
        _fallback: true,
        packageCode: "KURUMSAL_DINAMIK",
        iconName: "Star",
        badgeText: "En Çok Tercih Edilen",
        discountPercentage: 24,
        isFeatured: true,
        name: "Kurumsal Web – Dinamik",
        tagline: "Tam kontrol. Özgür içerik yönetimi.",
        originalPrice: "24900",
        currentPrice: "18900",
        priceNote: "başlayan fiyatlarla",
        deliveryTime: "12–15 iş günü",
        revisionCount: 3,
        supportDays: 90,
        features: [
            { featureText: "Kullanımı kolay admin panel", isMainFeature: true, displayOrder: 0 },
            { featureText: "Tüm içerikleri bağımsız yönetme", isMainFeature: true, displayOrder: 1 },
            { featureText: "Gelişmiş SEO araçları", isMainFeature: true, displayOrder: 2 },
            { featureText: "Form & bildirim yönetimi", isMainFeature: true, displayOrder: 3 },
            { featureText: "Panel kullanım eğitimi", isMainFeature: true, displayOrder: 4 },
        ],
        notes: [{ noteType: "SUCCESS", noteText: "Güncelleme için kimseye bağlı kalmazsınız. Uzun vadede en ekonomik çözümdür." }],
    },
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
            { featureText: "Tamamen size özel yazılım", isMainFeature: true, displayOrder: 0 },
            { featureText: "API entegrasyonları (Ödeme, SMS vb.)", isMainFeature: true, displayOrder: 1 },
            { featureText: "Özel CRM/ERP sistemleri", isMainFeature: true, displayOrder: 2 },
            { featureText: "Tüm cihazlarda mükemmel performans", isMainFeature: true, displayOrder: 3 },
            { featureText: "Süresiz premium destek", isMainFeature: true, displayOrder: 4 },
        ],
        notes: [{ noteType: "NEUTRAL", noteText: "Detaylı analiz sonrası net teklif hazırlanır." }],
    },
];

const FALLBACK_MAINT = [
    {
        _fallback: true,
        planCode: "LITE",
        iconName: "Server",
        badgeText: "Başlangıç",
        name: "Bakım Lite",
        monthlyPrice: "1500",
        idealFor: "Sabit içerikli, bakımı az siteler için",
        isBestSeller: false,
        features: [
            { featureText: "Hosting (bizim sunucumuzda)", displayOrder: 0 },
            { featureText: "SSL yönetimi", displayOrder: 1 },
            { featureText: "Günlük otomatik yedekleme", displayOrder: 2 },
            { featureText: "Uptime takibi (7/24)", displayOrder: 3 },
            { featureText: "Aylık 2 içerik güncellemesi", displayOrder: 4 },
            { featureText: "Aylık durum raporu", displayOrder: 5 },
        ],
    },
    {
        _fallback: true,
        planCode: "PRO",
        iconName: "BarChart3",
        badgeText: "En Çok Tercih",
        name: "Bakım Pro",
        monthlyPrice: "2500",
        idealFor: "Aktif, sık güncellenen siteler için",
        isBestSeller: true,
        features: [
            { featureText: "Başlangıç paketindeki her şey", displayOrder: 0 },
            { featureText: "Aylık 5 içerik güncellemesi", displayOrder: 1 },
            { featureText: "Aylık SEO raporu (detaylı)", displayOrder: 2 },
            { featureText: "PageSpeed optimizasyon takibi", displayOrder: 3 },
            { featureText: "Öncelikli destek (24 saat yanıt)", displayOrder: 4 },
            { featureText: "Küçük tasarım değişiklikleri", displayOrder: 5 },
        ],
    },
    {
        _fallback: true,
        planCode: "COMMERCE",
        iconName: "RefreshCw",
        badgeText: "Pro",
        name: "Bakım Commerce",
        monthlyPrice: "4000",
        idealFor: "Büyüyen işletmeler, aktif geliştirme",
        isBestSeller: false,
        features: [
            { featureText: "Büyüme paketindeki her şey", displayOrder: 0 },
            { featureText: "Aylık 10 içerik güncellemesi", displayOrder: 1 },
            { featureText: "Aylık 5 saat geliştirme saati", displayOrder: 2 },
            { featureText: "Google Search Console takibi", displayOrder: 3 },
            { featureText: "Aylık 30 dk strateji görüşmesi", displayOrder: 4 },
            { featureText: "Öncelikli destek (12 saat yanıt)", displayOrder: 5 },
        ],
    },
];

const POLICY_ITEMS = [
    "Paket fiyatları, tanımlı kapsamlar için belirlenmiştir",
    "Projenize özel ihtiyaçlar görüşmede netleştirilir",
    "Ek sayfa, özel entegrasyon ve modüller ayrıca planlanır",
    "Nihai fiyat ve ödeme planı teklif görüşmesinde belirlenir",
];

// ── Countdown — süre dolunca null döner, onExpire callback'i tetikler ──
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
                📋 Paket İçeriği ({sections.length} Bölüm)
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
                    💡 {extraPageNote}
                </div>
            )}
        </div>
    );
}

export default function Pricing() {
    const dispatch = useDispatch();

    // pricing store'dan sadece paket verisi — activeCampaign artık campaign store'da
    const { packages: backendPackages, loading: pkgLoading } = useSelector(s => s.pricing);
    // kampanya verisi campaign store'dan geliyor
    const { activeCampaign } = useSelector(s => s.campaign);
    const { plans: backendPlans, loading: maintLoading } = useSelector(s => s.maintenance);

    const [selected, setSelected] = useState(2);
    const [expanded, setExpanded] = useState({});
    // Countdown dolunca barı gerçek zamanlı kaldırmak için
    const [campaignVisible, setCampaignVisible] = useState(true);

    useEffect(() => {
        dispatch(fetchActivePackages());
        dispatch(fetchActiveCampaign());
        dispatch(fetchPublicPlans());
    }, [dispatch]);

    // activeCampaign değiştiğinde campaignVisible'ı sıfırla
    useEffect(() => {
        setCampaignVisible(true);
    }, [activeCampaign]);

    const packages = (backendPackages && backendPackages.length > 0) ? backendPackages : FALLBACK_PLANS;
    const maintPlans = (backendPlans && backendPlans.length > 0) ? backendPlans : FALLBACK_MAINT;

    // Kampanya geçerlilik kontrolü:
    // isActive true, endDate geçmemiş, ve campaignVisible (countdown dolmadı) olmalı
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
                title="Web Sitesi Fiyatları 2025: Landing Page, Kurumsal Site & Bakım | Algorixa"
                description="Şeffaf fiyatlarla web tasarım: Landing page 7.900₺, kurumsal statik site 14.900₺, admin panelli dinamik site 22.900₺, aylık bakım 1.500₺'den başlıyor. KDV hariç, gizli ücret yok. İstanbul'da net kapsam, net fiyat."
                keywords="web sitesi fiyatları 2025, landing page kaç para, kurumsal web sitesi fiyatı, admin panelli site fiyatı, web tasarım fiyat listesi istanbul, web sitesi yaptırma maliyeti, aylık web bakım paketi fiyatı, hosting ssl yedekleme paketi, ucuz web tasarım istanbul, uygun fiyatlı web sitesi, web tasarım teklif al, web sitesi ne kadar tutar, şeffaf fiyatlı web tasarım, landing page 7900 tl, kurumsal site 14900 tl"
                url="https://www.algorixa.com.tr/fiyatlandirma"
                canonical="https://www.algorixa.com.tr/fiyatlandirma"
            />
            <section className="page-hero">
                <VideoHero />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">Fiyatlandırma</span></div>
                    <h1 className="page-hero__title">
                        Şeffaf Fiyat,<br />
                        <em>Net Kapsam,</em>
                        Sürpriz Yok
                    </h1>
                    <p className="page-hero__desc">
                        Tüm fiyatlar KDV hariçtir. Paket içerikleri nettir, gizli ücret yoktur.
                        Ajans karmaşası olmadan, doğrudan geliştiriciyle çalışırsınız.
                    </p>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">

                    {/* ── Kampanya barı — sadece aktif + süresi dolmamış kampanya varsa göster ── */}
                    {hasCampaign && (
                        <div className="prc-promo-bar">
                            <div className="prc-promo-bar__left">
                                <div className="prc-promo-bar__title">
                                    <Zap size={16} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                    {activeCampaign.promoBarTitle || activeCampaign.campaignName || "Sınırlı Süreli Kampanya"}
                                </div>
                                <p className="prc-promo-bar__desc">
                                    {activeCampaign.promoBarDescription || activeCampaign.description ||
                                        "Algorixa'da fiyatlar; proje kapsamı, uzun vadeli sürdürülebilirlik ve karşılıklı memnuniyet esas alınarak belirlenir. Bu dönemde seçili paketlerde avantajlı fiyatlar projenin referans olarak gösterilmesi karşılığında sunulmaktadır."}
                                </p>
                                <div className="prc-promo-bar__highlights">
                                    {["KDV hariç net fiyatlar", "Gizli ücret yok", "7 gün içinde proje başlangıcı"].map(h => (
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
                                const displayFeatures = mainFeatures.length > 0 ? mainFeatures : sortedFeatures.slice(0, 5);

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

                                        <div className="prc-card__price-area">
                                            {origNum && (
                                                <div className="prc-card__orig">{formatPrice(origNum)}</div>
                                            )}
                                            <div className={`prc-card__price${p.isFeatured ? " prc-card__price--gold" : ""}`}>
                                                {currNum ? formatPrice(currNum) : "Özel Teklif"}
                                            </div>
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

                                        <ul className="prc-card__features">
                                            {displayFeatures.map((f, fi) => (
                                                <li key={fi} className="prc-card__feature">
                                                    <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                                    {f.featureText}
                                                </li>
                                            ))}
                                        </ul>

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

                                        <Link
                                            to="/iletisim"
                                            className={`prc-card__cta btn ${p.isFeatured ? "btn--primary" : "btn--outline"}`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {p.isFeatured ? "Hemen Başla" : currNum ? "Bu Paketi Seç" : "Görüşelim"}
                                        </Link>

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

                    <div className="prc-cta-bar">
                        <div className="prc-cta-bar__text">
                            <h2>Hangisi Sizin İçin Doğru?</h2>
                            <p>24 saat içinde detaylı görüşme ve net teklif. Bağlayıcı değildir.</p>
                        </div>
                        <Link to="/iletisim" className="btn btn--primary btn--lg btn--mono">
                            Ücretsiz Görüşme →
                        </Link>
                    </div>
                </div>
            </section>

            <section className="page-section page-section--alt section-border-top">
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Aylık Bakım Paketleri</span></div>
                    <h2 className="t-heading" style={{ marginBottom: "16px" }}>
                        Projeniz Bittikten Sonra da Yanınızdayız
                    </h2>
                    <p style={{ color: "var(--t-2)", marginBottom: "52px", maxWidth: "540px", lineHeight: 1.8 }}>
                        Hosting, güncelleme, SEO takibi ve teknik destek tek pakette.
                        Aylık ödeme — her ayın 1'inde peşinen. 15 gün önceden iptal bildirimi yeterli.
                    </p>

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
                                        <div className="maint-card__price">
                                            {priceNum ? formatPrice(priceNum) : "—"}<span>/ay</span>
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
                                            Bu Paketi İstiyorum →
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="maint-footer-note">
                        {["Aylık ödeme", "15 gün önceden iptal", "Domain her zaman sizin adınıza"].map(t => (
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
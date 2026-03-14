import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    Layout, Settings, Code2, Cpu, ChevronRight,
    Check, Search, Pencil, Wrench, Rocket,
    Timer, DollarSign, ArrowRight
} from "lucide-react";
import SEO from "../components/Seo";

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

const SERVICES = [
    {
        Icon: Layout,
        n: "01",
        title: "Landing Page",
        badge: "Hızlı Başlangıç",
        desc: "Tek sayfa. Net mesaj. Hızlı dönüşüm. Dijital dünyada hızlıca yer almak isteyenler için mükemmel başlangıç.",
        features: [
            "Markanıza özel modern tasarım",
            "Mobil, tablet ve masaüstü uyumlu yapı",
            "SEO uyumlu altyapı (Google görünürlüğü)",
            "WhatsApp hızlı iletişim butonu"
        ],
        time: "5–7 iş günü",
        support: "30 Gün Teknik Destek",
        note: null
    },
    {
        Icon: Settings,
        n: "02",
        title: "Kurumsal Web – Statik",
        badge: "Bakım Derdi Yok",
        desc: "Kurumsal görünüm. Bakım derdi yok. İçeriği sık değişmeyen işletmeler için sade, hızlı ve profesyonel çözüm.",
        features: [
            "Kurumsal ve sade tasarım",
            "Hızlı açılan sayfalar",
            "SEO uyumlu yapı",
            "Kurumsal e-posta & harita entegrasyonu"
        ],
        time: "8–10 iş günü",
        support: "60 Gün Teknik Destek",
        note: "⚠️ İçerik güncellemeleri için geliştirici desteği gerekir (admin panel yok)."
    },
    {
        Icon: Code2,
        n: "03",
        title: "Kurumsal Web – Dinamik",
        badge: "En Çok Tercih Edilen",
        desc: "Tam kontrol. Özgür içerik yönetimi. İçeriğini kendin yönetmek isteyen, büyümeyi hedefleyen işletmeler için.",
        features: [
            "Kullanımı kolay admin panel",
            "Tüm içerikleri bağımsız yönetme",
            "Gelişmiş SEO araçları",
            "Form & bildirim yönetimi"
        ],
        time: "12–15 iş günü",
        support: "90 Gün Teknik Destek + Panel Eğitimi",
        note: "✅ Güncelleme için kimseye bağlı kalmazsınız. Uzun vadede en ekonomik çözümdür."
    },
    {
        Icon: Cpu,
        n: "04",
        title: "Özel Yazılım Çözümü",
        badge: "Bana Özel",
        desc: "Standart paketler yetmiyorsa. İş modelinize özel, sıfırdan planlanan yazılım çözümleri.",
        features: [
            "Tamamen size özel yazılım",
            "API entegrasyonları (Ödeme, SMS vb.)",
            "Özel CRM/ERP sistemleri",
            "Tüm cihazlarda mükemmel performans"
        ],
        oldPrice: null,
        time: "Proje bazlı",
        support: "Özel destek paketi",
        note: null
    },
];

const PROCESS = [
    { Icon: Search, n: "01", title: "Keşif & Strateji", desc: "İhtiyaç analizi, hedef kitle araştırması ve proje kapsamı belirleme. Net teklif 24 saat içinde." },
    { Icon: Pencil, n: "02", title: "Tasarım & Prototip", desc: "Wireframe ve tasarım. Onayınız alınmadan koda geçilmez. Revizyon hakkınız dahildir." },
    { Icon: Wrench, n: "03", title: "Geliştirme", desc: "Clean code, SEO uyumlu altyapı, kapsamlı test ve performans optimizasyonu." },
    { Icon: Rocket, n: "04", title: "Yayın & Destek", desc: "Deploy, hız testi, eğitim ve paketinize dahil teknik destek süresi." },
];

const SECTORS = [
    "Sanayi Firmaları", "İnşaat & Yapı", "Otomotiv & Yedek Parça", "Elektronik Servis",
    "Restoran & Kafe", "Danışmanlık", "B2B Toptan Satış", "Lojistik & Nakliye",
    "Sağlık & Klinik", "Hukuk & Avukatlık", "Muhasebe", "Eğitim & Kurs",
    "Gayrimenkul", "Turizm & Otelcilik", "Tekstil & Hazır Giyim"
];

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        // Video yüklendiğinde
        const handleLoad = () => {
            setIsLoaded(true);
            v.playbackRate = 0.75; // Daha sinematik görünüm için yavaşlatma
        };

        // Hata durumunda
        const handleError = () => {
            setHasError(true);
            console.warn('Video yüklenemedi - fallback görsele geçiliyor');
        };

        v.addEventListener('loadeddata', handleLoad);
        v.addEventListener('error', handleError);

        return () => {
            v.removeEventListener('loadeddata', handleLoad);
            v.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <div className="hero-video-wrap" aria-hidden>
            {/* Poster image - video yüklenene kadar gösterilir */}
            {!isLoaded && (
                <div
                    className="hero-video__poster"
                    style={{
                        backgroundImage: 'url(/hero-poster.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1
                    }}
                />
            )}

            {/* Video element - optimize edilmiş özelliklerle */}
            <video
                ref={videoRef}
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/hero-poster.jpg"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out'
                }}
            >
                {/* Önce düşük çözünürlük mobile için, sonra desktop */}
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />

                {/* Tarayıcı desteklemiyorsa alternatif format */}
                <source src="/hero.webm" type="video/webm" />
            </video>

            {/* Multi-layer overlay for legibility */}
            <div className="hero-video__overlay" style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                position: 'absolute',
                inset: 0,
                zIndex: 2
            }} />

            {/* Subtle grain texture for premium feel */}
            <div className="hero-video__grain" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                opacity: 0.03,
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                pointerEvents: 'none'
            }} />

            {/* Bottom fade for text readability */}
            <div className="hero-video__fade-bottom" style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%)',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                zIndex: 4
            }} />

            {/* Loading indicator */}
            {!isLoaded && !hasError && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '14px',
                    fontWeight: 500
                }}>
                    <div className="loading-spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid rgba(200,168,75,0.8)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }} />
                    Video yükleniyor...
                </div>
            )}
        </div>
    );
}

export default function Services() {
    const [svcRef, svcVisible] = useReveal();
    const [procRef, procVisible] = useReveal();
    const [secRef, secVisible] = useReveal();
    const [hoveredRow, setHoveredRow] = useState(null);

    return (
        <>
            <SEO
                title="Web Tasarım Hizmetleri: Landing Page, Kurumsal Site & Yazılım | Algorixa"
                description="Landing page (7.900₺), kurumsal web sitesi (14.900₺), admin panelli dinamik site (22.900₺) ve özel yazılım çözümleri. İstanbul'da 5 iş günü teslim. Tasarım, geliştirme ve SEO tek elden. Ücretsiz analiz için hemen arayın."
                keywords="web tasarım hizmetleri istanbul, landing page tasarımı istanbul, kurumsal web sitesi tasarımı, admin panelli web sitesi fiyatı, özel yazılım geliştirme istanbul, SEO uyumlu web sitesi tasarımı, hızlı web sitesi tasarımı, mobil uyumlu web tasarım, web uygulama geliştirme istanbul, full stack geliştirici istanbul, react web sitesi, restoran web sitesi, inşaat firması web sitesi, sanayi web sitesi istanbul"
                url="https://www.algorixa.com.tr/hizmetler"
                canonical="https://www.algorixa.com.tr/hizmetler"
            />
            {/* ── Hero ── */}
            <section className="page-hero">
                <VideoHero />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">Hizmetlerimiz</span></div>
                    <h1 className="page-hero__title">
                        Markanız İçin<br /><em>Eksiksiz Dijital</em>Çözümler
                    </h1>
                    <p className="page-hero__desc">
                        Landing page'den özel yazılıma, SEO'dan kurumsal web sitelerine —
                        her adımda yanınızdayız. Net kapsam, şeffaf fiyat.
                    </p>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                        <Link to="/iletisim" className="btn btn--primary">Ücretsiz Teklif Al →</Link>
                        <Link to="/fiyatlandirma" className="btn btn--outline">Fiyat Planları</Link>
                    </div>
                </div>
            </section>

            {/* ── Services list ── */}
            <section
                ref={svcRef}
                className={`services-list-section section-border-top svc-list-wrap${svcVisible ? " is-visible" : ""}`}
            >
                <div className="svc-list">
                    {SERVICES.map((s, i) => (
                        <div
                            key={s.n}
                            className={`svc-row${hoveredRow === i ? " svc-row--hovered" : ""}`}
                            style={{ transitionDelay: `${i * 70}ms` }}
                            onMouseEnter={() => setHoveredRow(i)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            {/* Left: icon + number */}
                            <div className="svc-row__lead">

                                <span className="svc-row__n">{s.n}</span>
                            </div>

                            {/* Middle: title + desc */}
                            <div className="svc-row__body">
                                <h2 className="svc-row__title">{s.title}</h2>
                                <p className="svc-row__desc">{s.desc}</p>
                                <div className="svc-row__meta">

                                    <span className="svc-row__time">
                                        <Timer size={12} strokeWidth={1.5} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                                        {s.time}
                                    </span>
                                </div>
                            </div>

                            {/* Right: features */}
                            <div className="svc-row__features">
                                {s.features.map(f => (
                                    <div key={f} className="svc-row__feature">
                                        <Check size={12} strokeWidth={2.5} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
                                        {f}
                                    </div>
                                ))}

                            </div>

                            {/* Hover arrow */}
                            <div className="svc-row__arrow">
                                {/* <ArrowRight size={20} strokeWidth={1.5} /> */}
                                <Link to="/iletisim" className="btn btn--outline btn--sm" style={{ marginTop: "12px" }}>
                                    Teklif Al <ArrowRight size={12} strokeWidth={2} style={{ display: "inline", marginLeft: 4 }} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Process ── */}
            <section ref={procRef} className={`page-section section-border-top proc-wrap${procVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Çalışma Sürecimiz</span></div>
                    <h2 className="t-heading" style={{ marginBottom: "64px" }}>4 Adımda Başarılı Proje</h2>
                </div>
                <div className="proc-steps container--lg">
                    {PROCESS.map(({ Icon, n, title, desc }, i) => (
                        <div key={n} className="proc-step" style={{ transitionDelay: `${i * 100}ms` }}>

                            <div className="proc-step__n">{n}</div>
                            <h3 className="proc-step__title">{title}</h3>
                            <p className="proc-step__desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Sektörler ── */}
            <section ref={secRef} className={`page-section page-section--sm section-border-top svc-sectors${secVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Hizmet Verdiğimiz Sektörler</span></div>
                    <h2 className="t-heading--sm" style={{ fontFamily: "var(--f-display)", marginBottom: "32px" }}>
                        Her Sektörden İşletmelere Hizmet Veriyoruz
                    </h2>
                    <div className="sector-chips">
                        {SECTORS.map(s => <span key={s} className="sector-chip">{s}</span>)}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="page-section page-section--alt page-section--sm section-border-top" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 className="t-heading" style={{ marginBottom: "16px" }}>Hangi Hizmet Sizin İçin Uygun?</h2>
                    <p style={{ color: "var(--t-2)", maxWidth: "460px", margin: "0 auto 36px" }}>
                        Ücretsiz ön görüşmede ihtiyacınızı analiz edip en uygun çözümü öneririz.
                        24 saat içinde net teklif.
                    </p>
                    <Link to="/iletisim" className="btn btn--primary btn--lg">Görüşme Talep Et →</Link>
                </div>
            </section>
        </>
    );
}
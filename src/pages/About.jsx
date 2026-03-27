import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    User, MapPin, Clock, Star, TrendingUp, Shield, Zap,
    Mail, Phone, Instagram, MessageCircle, ChevronRight,
    Code2
} from "lucide-react";
import SEO from "../components/Seo";

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.10 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        const v = videoRef.current; if (!v) return;
        const handleLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const handleError = () => { setHasError(true); };
        v.addEventListener('loadeddata', handleLoad);
        v.addEventListener('error', handleError);
        return () => { v.removeEventListener('loadeddata', handleLoad); v.removeEventListener('error', handleError); };
    }, []);
    return (
        <div className="hero-video-wrap" aria-hidden>
            {!isLoaded && <div className="hero-video__poster" style={{ backgroundImage: 'url(/hero-poster.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0, zIndex: 1 }} />}
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
                <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="hero-video__overlay" style={{ background: 'linear-gradient(110deg, rgba(6,10,20,.85) 0%, rgba(6,10,20,.5) 55%, rgba(6,10,20,.72) 100%)', position: 'absolute', inset: 0, zIndex: 2 }} />
            <div className="hero-video__grain" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', opacity: 0.03, position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }} />
            <div className="hero-video__fade-bottom" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 40%)', position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 4 }} />
            {!isLoaded && !hasError && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'var(--f-mono)', letterSpacing: '.1em', textAlign: 'center' }}>
                    <div className="loading-spinner" />
                    YÜKLENİYOR...
                </div>
            )}
        </div>
    );
}

const VALUES = [
    { icon: User, n: "01", title: "Doğrudan Geliştirici", desc: "Ajans karmaşası olmadan, tek muhatapla çalışırsınız. Tasarım, geliştirme, sunucu ve SEO tek kişi yönetir." },
    { icon: Clock, n: "02", title: "Net Süreç & Teslim", desc: "Planlı ve zamanında teslim. Kapsam, süre ve çıktı baştan bellidir. Sürpriz maliyet yoktur." },
    { icon: Shield, n: "03", title: "Şeffaf Fiyatlandırma", desc: "Başından belli kapsam, gizli ücret yok. Paket içerikleri nettir. Net kapsam, net fiyat." },
    { icon: TrendingUp, n: "04", title: "Ölçeklenebilir", desc: "Büyüyen işletmelere uyum sağlayan altyapı. Uzun vadeli sürdürülebilirlik esas alınır." },
];

const NUMBERS = [
    { n: "Başarı İle", l: "Tamamlanan Projeler", Icon: Star },
    { n: "7+", l: "Yıl Deneyim", Icon: Clock },
    { n: "24s", l: "Yanıt Süresi", Icon: Zap },
    { n: "30dk", l: "Ücretsiz Görüşme", Icon: User },
];

const SECTORS = [
    "Sanayi Firmaları", "İnşaat & Yapı", "Otomotiv & Yedek Parça", "Elektronik Servis",
    "Restoran & Kafe", "Danışmanlık Firmaları", "B2B Toptan Satış", "Lojistik & Nakliye",
    "Sağlık & Klinik", "Hukuk & Avukatlık", "Muhasebe & Mali Müşavirlik", "Eğitim & Kurs",
    "Gayrimenkul", "Turizm & Otelcilik", "Tekstil & Hazır Giyim"
];

const CONTACTS = [
    { Icon: Mail, href: "mailto:enes.derin@algorixa.com.tr", label: "E-posta" },
    { Icon: Phone, href: "tel:+905469705451", label: "+90 546 970 54 51" },
    { Icon: Instagram, href: "https://www.instagram.com/algorixa_/", label: "Instagram" },
    { Icon: MessageCircle, href: "https://wa.me/905469705451", label: "WhatsApp" },
];

export default function About() {
    const [storyRef, storyVisible] = useReveal();
    const [valRef, valVisible] = useReveal();
    const [foundRef, foundVisible] = useReveal();
    const [secRef, secVisible] = useReveal();

    return (
        <>
            <SEO
                title="Hakkımızda — İstanbul Merkezli Web Tasarım & Yazılım | Algorixa"
                description="İstanbul merkezli Algorixa ile doğrudan geliştiriciyle çalışın. Ajans karmaşası yok, tek muhatap — tasarım, geliştirme, sunucu ve SEO tek elden. başarı ile tamamlanan projeler, 5+ yıl deneyim. Tanışalım."
                keywords="algorixa hakkında, web tasarım şirketi istanbul, freelance web geliştirici istanbul, doğrudan geliştiriciyle web sitesi, güvenilir web tasarım hizmeti, tek muhatap web tasarım, ajansız web sitesi yaptırma, enes derin web geliştirici, istanbul yazılım geliştirici, kurumsal web tasarım deneyimi, 150 proje web tasarım"
                url="https://www.algorixa.com.tr/hakkimizda"
                canonical="https://www.algorixa.com.tr/hakkimizda"
            />
            {/* ── Hero ── */}
            <section className="page-hero abt-hero">
                <VideoHero />
                {/* Ambient circles — mavi palette */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 600 500" fill="none" width="100%" height="100%" style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', opacity: .5 }}>
                        <circle cx="520" cy="60" r="320" stroke="rgba(59,130,246,.06)" strokeWidth="1" />
                        <circle cx="520" cy="60" r="200" stroke="rgba(59,130,246,.09)" strokeWidth="1" />
                        <circle cx="520" cy="60" r="100" stroke="rgba(34,211,238,.10)" strokeWidth="1" />
                    </svg>
                </div>
                {/* Grid */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 60% 80% at 70% 50%, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 70% 50%, black 30%, transparent 75%)', pointerEvents: 'none' }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <div className="page-hero__eyebrow"><span className="t-label">Hakkımızda</span></div>
                    <h1 className="page-hero__title">
                        Dijital<br /><em>Çözüm Ortağı</em>
                    </h1>
                    <p className="page-hero__desc">
                        İşletmeniz için web sitesi değil; ölçülebilir sonuçlar, artan satışlar
                        ve profesyonel dijital varlık ortaya koyuyoruz. Doğrudan geliştiriciyle, ajans karmaşası olmadan çalışın.
                    </p>
                    <div className="page-hero__cta-wrap">
                        <Link to="/iletisim" className="btn btn--primary">
                            Tanışalım <ChevronRight size={15} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", marginLeft: 2 }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Story ── */}
            <section ref={storyRef} className={`page-section section-border-top abt-story${storyVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="about-grid">
                        <div>
                            <div className="t-section-label"><span className="t-label">Hikayemiz</span></div>
                            <h2 className="t-heading" style={{ marginBottom: "28px" }}>Neden Algorixa?</h2>
                            <p style={{ marginBottom: "20px", lineHeight: 1.9, color: "var(--t-2)", fontSize: "16px" }}>
                                İstanbul merkezli işletmelere kurumsal web sitesi, admin panelli web uygulamaları
                                ve özel yazılım çözümleri sunuyoruz. Her projede doğrudan geliştiriciyle çalışırsınız.
                            </p>
                            <p style={{ marginBottom: "20px", lineHeight: 1.9, color: "var(--t-2)", fontSize: "16px" }}>
                                Biz farklı bir yaklaşım benimsedik:{" "}
                                <strong style={{ color: "var(--accent)" }}>Ajans karmaşası olmadan, tek muhatap.</strong>{" "}
                                Tasarım, geliştirme, sunucu kurulumu ve SEO tek elden yönetilir.
                            </p>
                            <p style={{ lineHeight: 1.9, color: "var(--t-2)", fontSize: "16px" }}>
                                İstanbul başta olmak üzere Türkiye'nin her yerinden projelere uzaktan hizmet veriyoruz.
                            </p>
                        </div>

                        <div className="abt-numbers">
                            {NUMBERS.map(({ n, l, Icon }, i) => (
                                <div key={n} className="abt-num-cell" style={{ transitionDelay: `${i * 80}ms` }}>
                                    <div className="abt-num-cell__icon"><Icon size={16} strokeWidth={1.5} /></div>
                                    <div className="abt-num-cell__n">{n}</div>
                                    <div className="abt-num-cell__l">{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section ref={valRef} className={`page-section page-section--xs section-border-top abt-values-wrap${valVisible ? " is-visible" : ""}`}>
                <div className="container" style={{ paddingBottom: "52px" }}>
                    <div className="t-section-label"><span className="t-label">Çalışma Modelimiz</span></div>
                    <h2 className="t-heading">Bizi Farklı Kılan Ne?</h2>
                </div>
                <div className="abt-values-grid">
                    {VALUES.map(({ n, title, desc, icon: Icon }, i) => (
                        <div key={n} className="abt-val-card" style={{ transitionDelay: `${i * 90}ms` }}>

                            <div className="abt-val-card__num">{n}</div>
                            <h3 className="abt-val-card__title">{title}</h3>
                            <p className="abt-val-card__desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Founder ── */}
            <section ref={foundRef} className={`page-section section-border-top abt-founder-wrap${foundVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Ekibimiz</span></div>
                    <h2 className="t-heading" style={{ marginBottom: "52px" }}>Doğrudan Geliştiriciyle Çalışın</h2>
                    <div className="abt-founder">
                        <div className="abt-founder__left">
                            <div className="abt-founder__av">E<div className="abt-founder__av-ring" /></div>
                            <div className="abt-founder__socials">
                                {CONTACTS.map(({ Icon, href, label }) => (
                                    <a key={label} href={href} className="abt-social-btn">
                                        <Icon size={16} strokeWidth={1.5} />
                                        <span>{label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="abt-founder__right">
                            <div className="abt-founder__name">Enes Derin</div>
                            <div className="abt-founder__role">

                                <span style={{ opacity: .4 }}>·</span>
                                <MapPin size={13} strokeWidth={1.5} />
                                İstanbul, Türkiye
                            </div>
                            <p className="abt-founder__bio">
                                Tek muhatap, hızlı iletişim ve net süreç yönetimi. Ajans karmaşası olmadan
                                doğrudan geliştiriciyle çalışın. Tasarım, geliştirme, sunucu kurulumu ve
                                SEO tek elden yönetilir.
                            </p>
                            <blockquote className="abt-founder__quote">
                                "Güzel görünen ama işe yaramayan bir site, açılmamış bir kapıdan farksızdır.
                                Her pikselin arkasında bir strateji olmalı."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Sektörler ── */}
            <section ref={secRef} className={`page-section page-section--alt page-section--sm section-border-top abt-sectors${secVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="t-section-label"><span className="t-label">Hizmet Verdiğimiz Sektörler</span></div>
                    <h2 className="t-heading--sm" style={{ fontFamily: "var(--f-display)", marginBottom: "36px" }}>
                        İstanbul & Türkiye Geneli — Her Sektörden İşletmelere
                    </h2>
                    <div className="abt-sector-chips">
                        {SECTORS.map((s, i) => (
                            <span key={s} className="abt-sector-chip" style={{ transitionDelay: `${i * 25}ms` }}>{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="page-section page-section--sm section-border-top" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 className="t-heading" style={{ marginBottom: "16px" }}>Birlikte Çalışalım</h2>
                    <p style={{ color: "var(--t-2)", maxWidth: "440px", margin: "0 auto 36px", fontSize: "16px" }}>
                        24 saat içinde detaylı görüşme ve net teklif. Bağlayıcı değildir, baskı yok.
                    </p>
                    <Link to="/iletisim" className="btn btn--primary btn--lg">Görüşme Talep Et →</Link>
                </div>
            </section>
        </>
    );
}
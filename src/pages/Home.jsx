import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedProjects } from "../redux/portfolioSlice";
import SEO from "../components/Seo";

/* ─── Scroll-triggered fade-in hook ─── */
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

/* ─── Video Hero Background ─── */
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
                    backgroundImage: 'url(/hero-poster.jpg)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    position: 'absolute', inset: 0, zIndex: 1
                }} />
            )}
            <video
                ref={videoRef} className="hero-video"
                autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
            >
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
                <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="hero-video__overlay" />
            <div className="hero-video__grain" />
            <div className="hero-video__fade-bottom" />
            {!isLoaded && !hasError && (
                <div className="hero-video__loading">
                    <div className="hero-video__spinner" />
                </div>
            )}
        </div>
    );
}

function ScrollCue() {
    return (
        <div className="scroll-cue" aria-hidden>
            <div className="scroll-cue__line" />
            <span className="scroll-cue__label">Keşfet</span>
        </div>
    );
}

const SERVICES_PREVIEW = [
    { title: "Kurumsal Web Sitesi", desc: "Güven veren, hızlı ve SEO uyumlu kurumsal web siteleri. Markanızın dijital yüzü.", tags: ["React", "Next.js", "SEO"] },
    { title: "Admin Panelli Yazılımlar", desc: "İş süreçlerinizi tek panelden yönetin, büyümeye hazır sistemler.", tags: ["Özel Yazılım", "CMS", "Panel"] },
    { title: "Landing Page", desc: "Reklamdan maksimum dönüşüm alan, net mesajlı satış sayfaları.", tags: ["Dönüşüm", "CRO", "Hızlı"] },
];

const WHY = [
    { n: "01", title: "Tek Muhatap", desc: "Ajans karmaşası yok. Tasarım, geliştirme, sunucu ve SEO tek elden." },
    { n: "02", title: "Net Süreç", desc: "Kapsam, süre ve çıktı baştan bellidir. Sürpriz maliyet yoktur." },
    { n: "03", title: "24s Yanıt", desc: "Her soruya 24 saat içinde detaylı teklif ve görüşme garantisi." },
    { n: "04", title: "Ölçeklenebilir", desc: "Büyüyen işletmelere uyum sağlayan, geleceğe hazır altyapı." },
];

export default function Home() {
    const dispatch = useDispatch();
    const { projects } = useSelector(s => s.portfolio);

    const [svcRef, svcVisible] = useReveal();
    const [portRef, portVisible] = useReveal();
    const [whyRef, whyVisible] = useReveal();
    const [ctaRef, ctaVisible] = useReveal();

    useEffect(() => {
        dispatch(fetchPublishedProjects());
    }, [dispatch]);

    // Backend'den gelen projelerden random 3 tane seç.
    // projects değiştiğinde yeniden hesaplanır, sayfa yenilenince farklı 3 çıkar.
    const randomProjects = useMemo(() => {
        if (!projects?.length) return [];
        return [...projects]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
    }, [projects]);

    return (
        <>
            <SEO
                title="Kurumsal Web Sitesi & Yazılım Çözümleri İstanbul | Algorixa"
                description="İstanbul'da kurumsal web sitesi, admin panelli yazılım ve landing page. 7.900₺'den başlayan fiyatlar, 5-7 iş günü teslimat. Ajans karmaşası yok — doğrudan geliştiriciyle çalışın. Ücretsiz teklif alın."
                keywords="web tasarım istanbul, kurumsal web sitesi istanbul, web sitesi yaptırma istanbul, admin panelli web sitesi, landing page tasarımı, özel yazılım geliştirme istanbul, web sitesi yaptırma fiyatı, profesyonel web tasarım, mobil uyumlu web sitesi, SEO uyumlu web sitesi, algorixa, dijital çözümler istanbul, KOBİ web sitesi istanbul, sanayi firması web sitesi, full stack geliştirici istanbul, web tasarım fiyatları 2025"
                url="https://www.algorixa.com.tr/"
                canonical="https://www.algorixa.com.tr/"
            />
            <style>{`
                /* ══════════════════════════════════════════
                   HOME PAGE — RESPONSIVE SYSTEM
                ══════════════════════════════════════════ */

                .hero-video__loading {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 5; display: flex; flex-direction: column;
                    align-items: center; gap: 12px;
                    color: rgba(255,255,255,0.5); font-size: 13px;
                }
                .hero-video__spinner {
                    width: 40px; height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top-color: rgba(200,168,75,0.8);
                    border-radius: 50%; animation: spin 1s linear infinite;
                }
                .hero-video__overlay {
                    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
                    position: absolute; inset: 0; z-index: 2;
                }
                .hero-video__grain {
                    opacity: 0.03; position: absolute; inset: 0; z-index: 3; pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                .hero-video__fade-bottom {
                    background: linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%);
                    position: absolute; bottom: 0; left: 0; right: 0; height: 40%; z-index: 4;
                }

                .home-hero {
                    position: relative; min-height: 100svh;
                    display: flex; align-items: center;
                    overflow: hidden; background: #060504;
                }
                .home-hero__content {
                    position: relative; z-index: 5;
                    padding: 120px 80px 100px; max-width: 880px; width: 100%;
                }
                .home-hero__eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-family: var(--f-mono); font-size: 11px;
                    letter-spacing: .22em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 32px;
                    opacity: 0; animation: heroFadeUp .8s var(--ease) .2s forwards;
                }
                .home-hero__dot {
                    width: 6px; height: 6px; background: var(--gold);
                    border-radius: 50%; animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
                }
                .home-hero__title {
                    display: flex; flex-direction: column; gap: 2px;
                    font-family: var(--f-display);
                    font-size: clamp(38px, 6vw, 100px);
                    font-weight: 300; line-height: 1.05; letter-spacing: -.03em;
                    color: #f5efe2; margin-bottom: 28px;
                }
                .home-hero__title-line {
                    display: block; opacity: 0;
                    animation: heroFadeUp .9s var(--ease) forwards;
                }
                .home-hero__title-line--1 { animation-delay: .35s; }
                .home-hero__title-line--2 { animation-delay: .5s; }
                .home-hero__title-line--3 { animation-delay: .65s; }
                .home-hero__title em {
                    font-style: italic; font-weight: 300;
                    background: linear-gradient(120deg, var(--gold) 0%, var(--gold-light) 70%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .home-hero__sub {
                    font-size: clamp(14px, 1.6vw, 18px);
                    color: rgba(245,239,226,.72); line-height: 1.8;
                    max-width: 500px; margin-bottom: 40px;
                    opacity: 0; animation: heroFadeUp .8s var(--ease) .75s forwards;
                }
                .home-hero__actions {
                    display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 32px;
                    opacity: 0; animation: heroFadeUp .8s var(--ease) .9s forwards;
                }
                .home-hero__badges {
                    display: flex; gap: 8px; flex-wrap: wrap;
                    opacity: 0; animation: heroFadeUp .7s var(--ease) 1.05s forwards;
                }
                .hero-badge-pill {
                    padding: 4px 12px; background: rgba(200,168,75,.10);
                    border: 1px solid rgba(200,168,75,.22); border-radius: 99px;
                    font-family: var(--f-mono); font-size: 10px; letter-spacing: .12em;
                    color: var(--gold); text-transform: uppercase;
                }

                .home-hero__stats {
                    position: absolute; bottom: 80px; right: 80px;
                    z-index: 5; display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
                }
                .hero-stat {
                    display: flex; align-items: baseline; gap: 10px; padding: 10px 18px;
                    background: rgba(10,9,8,.55); backdrop-filter: blur(20px) saturate(150%);
                    border: 1px solid rgba(200,168,75,.18); border-radius: 3px;
                    opacity: 0; animation: heroSlideLeft .7s var(--ease) forwards;
                    box-shadow: 0 4px 24px rgba(0,0,0,.3);
                }
                .hero-stat__n { font-family: var(--f-display); font-size: 24px; font-weight: 600; color: var(--gold); line-height: 1; }
                .hero-stat__l { font-family: var(--f-mono); font-size: 10px; letter-spacing: .13em; text-transform: uppercase; color: rgba(245,239,226,.6); }

                .scroll-cue {
                    position: absolute; bottom: 36px; left: 80px; z-index: 5;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    opacity: 0; animation: heroFadeUp .6s var(--ease) 1.4s forwards;
                }
                .scroll-cue__line {
                    width: 1px; height: 48px;
                    background: linear-gradient(to bottom, transparent, var(--gold));
                    animation: scrollPulse 1.8s ease-in-out infinite;
                }
                .scroll-cue__label {
                    font-family: var(--f-mono); font-size: 9px; letter-spacing: .22em;
                    text-transform: uppercase; color: var(--gold); opacity: .7;
                    writing-mode: vertical-rl; transform: rotate(180deg);
                }

                .btn-hero-primary {
                    display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px;
                    background: linear-gradient(135deg, var(--gold), var(--gold-light));
                    color: #1a1205 !important; border-radius: 2px;
                    font-family: var(--f-body); font-size: 14px; font-weight: 600;
                    letter-spacing: .02em; text-decoration: none;
                    box-shadow: 0 8px 40px rgba(200,168,75,.35);
                    transition: transform .3s var(--ease), box-shadow .3s var(--ease); white-space: nowrap;
                }
                .btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 60px rgba(200,168,75,.48); }
                .btn-hero-ghost {
                    display: inline-flex; align-items: center; gap: 8px; padding: 15px 32px;
                    background: rgba(245,239,226,.07); backdrop-filter: blur(12px);
                    color: rgba(245,239,226,.9) !important; border: 1px solid rgba(245,239,226,.18);
                    border-radius: 2px; font-family: var(--f-body); font-size: 14px; font-weight: 500;
                    letter-spacing: .02em; text-decoration: none; transition: all .3s var(--ease); white-space: nowrap;
                }
                .btn-hero-ghost:hover { background: rgba(245,239,226,.12); border-color: rgba(245,239,226,.32); transform: translateY(-2px); }

                .home-why { padding: 100px 0; background: var(--bg-0); border-top: 1px solid var(--b-faint); }
                .home-why__head { margin-bottom: 60px; }
                .home-why__head .t-heading { max-width: 480px; }
                .home-why__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--b-faint); }
                .home-why .why-cell { opacity: 0; transform: translateY(20px); transition: opacity .6s var(--ease), transform .6s var(--ease); }
                .home-why.is-visible .why-cell { opacity: 1; transform: translateY(0); }
                .why-cell { background: var(--bg-0); padding: 44px 36px; position: relative; overflow: hidden; transition: background .35s; }
                .why-cell::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold), transparent); transform: scaleX(0); transform-origin: left; transition: transform .4s var(--ease); }
                .why-cell:hover::before { transform: scaleX(1); }
                .why-cell:hover { background: var(--bg-1); }
                .why-cell__n { display: block; font-family: var(--f-display); font-size: 48px; font-weight: 300; color: var(--b-soft); line-height: 1; margin-bottom: 16px; letter-spacing: -.02em; transition: color .3s; }
                .why-cell:hover .why-cell__n { color: var(--b-mid); }
                .why-cell__title { font-family: var(--f-display); font-size: 19px; font-weight: 500; color: var(--t-1); margin-bottom: 8px; }
                .why-cell__desc { font-size: 13px; color: var(--t-3); line-height: 1.75; }

                .home-services { background: var(--bg-0); border-top: 1px solid var(--b-faint); }
                .home-services__head { padding: 80px 0 48px; }
                .home-services .home-svc-row { opacity: 0; transform: translateY(16px); transition: opacity .55s var(--ease), transform .55s var(--ease), background .3s; }
                .home-services.is-visible .home-svc-row { opacity: 1; transform: translateY(0); }
                .home-svc-list { display: flex; flex-direction: column; gap: 1px; background: var(--b-faint); }
                .home-svc-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 32px; align-items: center; background: var(--bg-0); padding: 36px 60px; text-decoration: none; cursor: pointer; border-left: 2px solid transparent; transition: background .3s var(--ease), border-color .3s; position: relative; }
                .home-svc-row::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: var(--b-faint); }
                .home-svc-row:hover { background: var(--bg-1); border-left-color: var(--gold); }
                .home-svc-row__title { font-family: var(--f-display); font-size: 21px; font-weight: 500; color: var(--t-1); }
                .home-svc-row__desc { font-size: 13px; color: var(--t-3); line-height: 1.65; }
                .home-svc-row__arrow { font-size: 18px; color: var(--t-4); transition: color .3s, transform .3s var(--ease); text-align: right; flex-shrink: 0; }
                .home-svc-row:hover .home-svc-row__arrow { color: var(--gold); transform: translateX(6px); }

                .home-portfolio { padding: 80px 0 0; background: var(--bg-0); border-top: 1px solid var(--b-faint); }
                .home-portfolio__head { padding-bottom: 44px; }
                .home-port-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 2px; background: var(--b-faint); }
                .home-portfolio .home-port-card { opacity: 0; transform: translateY(24px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
                .home-portfolio.is-visible .home-port-card { opacity: 1; transform: translateY(0); }
                .home-port-card { position: relative; min-height: 400px; overflow: hidden; cursor: pointer; }
                .home-port-card:first-child { min-height: 480px; }
                .home-port-card__img {
                    position: absolute; inset: 0;
                    background-size: cover; background-position: center;
                    transition: transform .6s var(--ease);
                }
                .home-port-card:hover .home-port-card__img { transform: scale(1.04); }
                .home-port-card__grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(200,168,75,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,.03) 1px, transparent 1px); background-size: 40px 40px; }
                .home-port-card__body { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(6,5,4,.92) 100%); padding: 36px; display: flex; flex-direction: column; justify-content: flex-end; transform: translateY(10px); transition: transform .5s var(--ease); }
                .home-port-card:hover .home-port-card__body { transform: translateY(0); }
                .home-port-card__label { display: block; font-family: var(--f-mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
                .home-port-card__title { font-family: var(--f-display); font-size: 22px; font-weight: 400; color: #f5efe2; margin-bottom: 6px; line-height: 1.2; }
                .home-port-card__sub { font-size: 12px; color: rgba(245,239,226,.55); line-height: 1.6; margin-bottom: 18px; max-width: 300px; }
                .home-port-card__cta { display: inline-flex; align-items: center; gap: 8px; font-family: var(--f-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); text-decoration: none; opacity: 0; transform: translateX(-8px); transition: all .35s var(--ease); }
                .home-port-card:hover .home-port-card__cta { opacity: 1; transform: translateX(0); }

                /* Proje yok / yükleniyor durumu */
                .home-port-empty {
                    grid-column: 1 / -1; padding: 80px 40px; text-align: center;
                    color: var(--t-4); font-size: 14px; background: var(--bg-0);
                }

                .home-cta { padding: 120px 0; background: var(--bg-0); border-top: 1px solid var(--b-faint); position: relative; overflow: hidden; text-align: center; }
                .home-cta__deco { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
                .home-cta__deco svg { width: 100%; height: 100%; max-width: 800px; }
                .home-cta__inner { position: relative; z-index: 1; }
                .home-cta__title { font-family: var(--f-display); font-size: clamp(40px, 5.5vw, 76px); font-weight: 300; line-height: 1.05; letter-spacing: -.025em; color: var(--t-1); margin: 20px 0 22px; opacity: 0; transform: translateY(20px); transition: opacity .8s var(--ease), transform .8s var(--ease); }
                .home-cta__title em { font-style: italic; color: var(--gold); }
                .home-cta.is-visible .home-cta__title { opacity: 1; transform: translateY(0); }
                .home-cta__sub { font-size: clamp(14px, 1.5vw, 17px); color: var(--t-3); line-height: 1.8; margin-bottom: 40px; opacity: 0; transform: translateY(16px); transition: opacity .8s var(--ease) .15s, transform .8s var(--ease) .15s; }
                .home-cta.is-visible .home-cta__sub { opacity: 1; transform: translateY(0); }
                .home-cta__actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; opacity: 0; transform: translateY(12px); transition: opacity .7s var(--ease) .28s, transform .7s var(--ease) .28s; }
                .home-cta.is-visible .home-cta__actions { opacity: 1; transform: translateY(0); }

                @keyframes heroFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes heroSlideLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes scrollPulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.7); } }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 1100px) {
                    .home-hero__content { padding: 120px 48px 100px; }
                    .home-hero__stats { right: 40px; bottom: 60px; }
                    .scroll-cue { left: 48px; }
                    .home-why__grid { grid-template-columns: repeat(2, 1fr); }
                    .home-svc-row { padding: 32px 48px; gap: 24px; }
                    .home-port-grid { grid-template-columns: 1fr 1fr; }
                    .home-port-card:first-child { grid-column: span 2; min-height: 380px; }
                }
                @media (max-width: 900px) {
                    .home-hero__content { padding: 110px 36px 80px; max-width: 100%; }
                    .home-hero__stats { position: relative; bottom: auto; right: auto; flex-direction: row; flex-wrap: wrap; gap: 8px; margin: 24px 0 0; justify-content: flex-start; animation: none; opacity: 1; }
                    .hero-stat { animation: none !important; opacity: 1 !important; }
                    .home-why__grid { grid-template-columns: repeat(2, 1fr); }
                    .home-svc-row { grid-template-columns: 1fr auto; gap: 16px; padding: 28px 36px; }
                    .home-svc-row__desc { display: none; }
                }
                @media (max-width: 768px) {
                    .home-hero { min-height: 100svh; }
                    .home-hero__content { padding: 100px 20px 80px; display: flex; flex-direction: column; justify-content: flex-end; min-height: 80svh; }
                    .home-hero__title { font-size: clamp(34px, 9vw, 52px); gap: 0; margin-bottom: 20px; }
                    .home-hero__sub { font-size: 14px; max-width: 100%; margin-bottom: 28px; }
                    .home-hero__actions { flex-direction: column; gap: 10px; margin-bottom: 24px; }
                    .btn-hero-primary, .btn-hero-ghost { width: 100%; justify-content: center; padding: 15px 24px; }
                    .home-hero__badges { gap: 6px; }
                    .hero-badge-pill { font-size: 9px; padding: 3px 10px; }
                    .home-hero__stats { flex-direction: row; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
                    .hero-stat { padding: 8px 12px; }
                    .hero-stat__n { font-size: 18px; }
                    .hero-stat__l { font-size: 9px; }
                    .scroll-cue { display: none; }
                    .home-why { padding: 72px 0; }
                    .home-why__head { margin-bottom: 40px; }
                    .home-why__grid { grid-template-columns: 1fr; }
                    .why-cell { padding: 32px 24px; }
                    .why-cell__n { font-size: 36px; margin-bottom: 12px; }
                    .why-cell__title { font-size: 17px; }
                    .home-services__head { padding: 60px 0 36px; }
                    .home-svc-row { grid-template-columns: 1fr auto; gap: 12px; padding: 22px 20px; }
                    .home-svc-row__desc { display: none; }
                    .home-svc-row__title { font-size: 16px; }
                    .home-portfolio { padding: 60px 0 0; }
                    .home-portfolio__head { padding-bottom: 28px; }
                    .home-port-grid { grid-template-columns: 1fr; gap: 2px; }
                    .home-port-card:first-child { grid-column: span 1; min-height: 280px; }
                    .home-port-card { min-height: 240px !important; }
                    .home-port-card__body { padding: 24px; }
                    .home-port-card__title { font-size: 18px; }
                    .home-port-card__cta { opacity: 1; transform: translateX(0); }
                    .home-cta { padding: 80px 0; }
                    .home-cta__actions { flex-direction: column; align-items: center; gap: 10px; }
                    .home-cta__actions .btn { width: 100%; max-width: 320px; justify-content: center; }
                }
                @media (max-width: 480px) {
                    .home-hero__content { padding: 90px 16px 72px; }
                    .home-hero__title { font-size: clamp(30px, 10vw, 42px); }
                    .home-hero__sub { font-size: 13px; }
                    .home-hero__stats { display: none; }
                    .home-why { padding: 60px 0; }
                    .why-cell { padding: 28px 16px; }
                    .home-svc-row { padding: 18px 16px; }
                    .home-svc-row__title { font-size: 15px; }
                    .home-port-card__body { padding: 20px; }
                    .home-port-card__title { font-size: 16px; }
                    .home-port-card__sub { display: none; }
                    .home-cta { padding: 64px 0; }
                    .home-cta__title { font-size: clamp(32px, 9vw, 44px); }
                }
                @media (max-width: 768px) and (orientation: landscape) {
                    .home-hero { min-height: 100svh; }
                    .home-hero__content { padding: 80px 40px 60px; min-height: auto; }
                    .home-hero__title { font-size: clamp(28px, 6vw, 42px); }
                    .home-hero__sub { max-width: 480px; }
                    .home-hero__actions { flex-direction: row; }
                    .btn-hero-primary, .btn-hero-ghost { width: auto; }
                }
                @media (min-width: 1400px) {
                    .home-hero__content { padding: 140px 100px 120px; max-width: 1000px; }
                    .home-hero__stats { right: 100px; bottom: 100px; }
                    .scroll-cue { left: 100px; }
                    .home-svc-row { padding: 44px 80px; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .home-hero__title-line, .home-hero__eyebrow, .home-hero__sub,
                    .home-hero__actions, .home-hero__badges, .scroll-cue, .hero-stat { animation: none !important; opacity: 1 !important; transform: none !important; }
                    .home-why .why-cell, .home-services .home-svc-row, .home-portfolio .home-port-card,
                    .home-cta__title, .home-cta__sub, .home-cta__actions { opacity: 1 !important; transform: none !important; transition: none !important; }
                }
            `}</style>

            {/* ════════════ HERO ════════════ */}
            <section className="home-hero" aria-label="Ana sayfa">
                <VideoHero />
                <div className="home-hero__content">
                    <h1 className="home-hero__title">
                        <span className="home-hero__title-line home-hero__title-line--1">İşinizi Büyüten</span>
                        <span className="home-hero__title-line home-hero__title-line--2">
                            <em>Kurumsal</em> Web &amp;
                        </span>
                        <span className="home-hero__title-line home-hero__title-line--3">Yazılım Çözümleri</span>
                    </h1>
                    <p className="home-hero__sub">
                        Algorixa ile sadece web sitesi değil; ölçülebilir sonuçlar,
                        artan satışlar ve profesyonel dijital varlık kazanın.
                    </p>
                    <div className="home-hero__actions">
                        <Link to="/iletisim" className="btn-hero-primary">
                            Ücretsiz Teklif Al
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link to="/referanslar" className="btn-hero-ghost">Portföyü İncele</Link>
                    </div>
                    <div className="home-hero__badges">
                        {["SSL Güvenli", "Lighthouse 90+", "24s Yanıt"].map(b => (
                            <span key={b} className="hero-badge-pill">{b}</span>
                        ))}
                    </div>
                </div>
                <ScrollCue />
            </section>

            {/* ════════════ NEDEN ════════════ */}
            <section ref={whyRef} className={`home-why${whyVisible ? " is-visible" : ""}`}>
                <div className="container">
                    <div className="home-why__head">
                        <div className="t-section-label"><span className="t-label">Neden Algorixa?</span></div>
                        <h2 className="t-heading">Doğrudan Geliştiriciyle<br />Çalışmanın Farkı</h2>
                    </div>
                    <div className="home-why__grid">
                        {WHY.map((w, i) => (
                            <div key={w.n} className="why-cell" style={{ transitionDelay: `${i * 100}ms` }}>
                                <span className="why-cell__n">{w.n}</span>
                                <h3 className="why-cell__title">{w.title}</h3>
                                <p className="why-cell__desc">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ HİZMETLER ════════════ */}
            <section ref={svcRef} className={`home-services${svcVisible ? " is-visible" : ""}`}>
                <div className="home-services__head container">
                    <div className="t-section-label"><span className="t-label">Hizmetlerimiz</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
                        <h2 className="t-heading">Neler Yapıyoruz?</h2>
                        <Link to="/hizmetler" className="btn btn--outline btn--mono btn--sm">Tüm Hizmetler →</Link>
                    </div>
                </div>
                <div className="home-svc-list">
                    {SERVICES_PREVIEW.map((s, i) => (
                        <Link key={i} to="/hizmetler" className="home-svc-row" style={{ transitionDelay: `${i * 80}ms` }}>
                            <span className="home-svc-row__title">{s.title}</span>
                            <span className="home-svc-row__desc">{s.desc}</span>
                            <span className="home-svc-row__arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ════════════ PORTFÖY ════════════ */}
            <section ref={portRef} className={`home-portfolio${portVisible ? " is-visible" : ""}`}>
                <div className="container home-portfolio__head">
                    <div className="t-section-label"><span className="t-label">Referanslar</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
                        <h2 className="t-heading">Seçkin Projeler</h2>
                        <Link to="/referanslar" className="btn btn--outline btn--mono btn--sm">Tüm Projeler →</Link>
                    </div>
                </div>

                <div className="home-port-grid">
                    {randomProjects.length === 0 ? (
                        <div className="home-port-empty">Projeler yükleniyor…</div>
                    ) : (
                        randomProjects.map((project, i) => {
                            const bg = project.backgroundGradientA && project.backgroundGradientB
                                ? `linear-gradient(135deg, ${project.backgroundGradientA} 0%, ${project.backgroundGradientB} 100%)`
                                : "linear-gradient(135deg,#1b1916 0%,#2a2518 100%)";
                            return (
                                <Link
                                    key={project.id}
                                    to="/referanslar"
                                    className="home-port-card"
                                    style={{ background: bg, transitionDelay: `${i * 120}ms` }}
                                >
                                    {/* Gerçek görsel varsa arka plana bindiriliyor */}
                                    {project.imageUrl && (
                                        <div
                                            className="home-port-card__img"
                                            style={{ backgroundImage: `url(${project.imageUrl})` }}
                                        />
                                    )}
                                    <div className="home-port-card__grid" />
                                    <div className="home-port-card__body">
                                        <span className="home-port-card__label">{project.category}</span>
                                        <h3 className="home-port-card__title">{project.title}</h3>
                                        <p className="home-port-card__sub">{project.description}</p>
                                        <span className="home-port-card__cta">
                                            İncele
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ════════════ CTA ════════════ */}
            <section ref={ctaRef} className={`home-cta${ctaVisible ? " is-visible" : ""}`}>
                <div className="home-cta__deco" aria-hidden>
                    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="400" cy="200" r="300" stroke="rgba(200,168,75,.06)" strokeWidth="1" />
                        <circle cx="400" cy="200" r="200" stroke="rgba(200,168,75,.08)" strokeWidth="1" />
                        <circle cx="400" cy="200" r="100" stroke="rgba(200,168,75,.10)" strokeWidth="1" />
                        <line x1="100" y1="200" x2="700" y2="200" stroke="rgba(200,168,75,.05)" strokeWidth="1" />
                        <line x1="400" y1="0" x2="400" y2="400" stroke="rgba(200,168,75,.05)" strokeWidth="1" />
                    </svg>
                </div>
                <div className="container home-cta__inner">
                    <div className="t-section-label" style={{ justifyContent: "center" }}>
                        <span className="t-label">Başlayalım</span>
                    </div>
                    <h2 className="home-cta__title">Projenizi<br /><em>Hayata Geçirelim</em></h2>
                    <p className="home-cta__sub">
                        24 saat içinde detaylı görüşme ve net teklif.<br />
                        Bağlayıcı değildir, baskı yoktur.
                    </p>
                    <div className="home-cta__actions">
                        <Link to="/iletisim" className="btn btn--primary btn--lg">Ücretsiz Teklif Al →</Link>
                        <Link to="/hakkimizda" className="btn btn--ghost btn--lg">Hakkımızda</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, clearSendStatus } from "../redux/contactSlice";
import {
    Mail, Phone, MapPin, Clock, Send, Instagram, MessageCircle,
    CheckCircle2, AlertCircle, ChevronRight, Shield, User, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/Seo";

// Fiyatlandırma sayfasındaki paketlerle eşleşen servis seçenekleri
const SERVICES_OPTS = [
    { value: "Landing Page", label: "Landing Page ", icon: "" },
    { value: "Kurumsal Web – Statik", label: "Kurumsal Web - Static", icon: "" },
    { value: "Kurumsal Web – Dinamik (Admin Panelli)", label: "Kurumsal Web – Dinamik (Admin Panel)", icon: "" },
    { value: "Özel Yazılım / B2B Çözüm", label: "Özel Yazılım / B2B Çözüm", icon: "" },
    { value: "Aylık Bakım Lite", label: "Aylık Bakım Lite", icon: "" },
    { value: "Aylık Bakım Pro", label: "Aylık Bakım Pro", icon: "" },
    { value: "Aylık Bakım Commerce", label: "Aylık Bakım Commerce", icon: "" },
    { value: "Diğer", label: "Diğer / Henüz karar vermedim", icon: "" },
];

const BUDGET_OPTS = [
    { value: "₺7.900 – ₺14.900", label: "₺7.900 – ₺14.900 (Landing / Statik)" },
    { value: "₺14.900 – ₺24.900", label: "₺14.900 – ₺24.900 (Dinamik / Kurumsal)" },
    { value: "₺25.000 – ₺50.000", label: "₺25.000 – ₺50.000" },
    { value: "₺50.000+", label: "₺50.000+" },
    { value: "Henüz belirlemedim", label: "Henüz belirlemedim" },
];

const CONTACT_INFO = [
    { Icon: Mail, label: "E-Posta", value: "enesderin.contact@gmail.com", href: "mailto:enesderin.contact@gmail.com" },
    { Icon: Phone, label: "Telefon", value: "+90 546 970 54 51", href: "tel:+905469705451" },
    { Icon: MapPin, label: "Konum", value: "İstanbul, Türkiye", href: "#" },
    { Icon: Clock, label: "Yanıt Süresi", value: "24 saat içinde net teklif", href: null },
];

const SOCIALS = [
    { Icon: Instagram, label: "Instagram", href: "#" },
    { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/905469705451" },
    { Icon: Mail, label: "E-posta", href: "mailto:enesderin.contact@gmail.com" },
];

const GUARANTEES = [
    { Icon: CheckCircle2, text: "24 saat içinde net teklif" },
];

// ── Telefon formatlama fonksiyonu ──
const formatPhoneNumber = (raw) => {
    // Sadece rakam bırak
    const digits = raw.replace(/\D/g, "");

    if (digits.length === 0) return "";

    // 0 ile başlıyorsa: 0555 555 55 55 formatı
    if (digits.startsWith("0")) {
        const d = digits.slice(0, 11); // max 11 karakter (0 + 10 rakam)
        if (d.length <= 1) return d;
        if (d.length <= 4) return d.slice(0, 1) + d.slice(1);
        if (d.length <= 7) return d.slice(0, 4) + " " + d.slice(4);
        if (d.length <= 9) return d.slice(0, 4) + " " + d.slice(4, 7) + " " + d.slice(7);
        return d.slice(0, 4) + " " + d.slice(4, 7) + " " + d.slice(7, 9) + " " + d.slice(9, 11);
    }

    // 0 olmadan başlıyorsa: 555 555 55 55 formatı
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
    if (d.length <= 8) return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6, 8) + " " + d.slice(8, 10);
};

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const handleError = () => setIsLoaded(true);
        v.addEventListener('loadeddata', handleLoad);
        v.addEventListener('error', handleError);
        return () => {
            v.removeEventListener('loadeddata', handleLoad);
            v.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <div className="hero-video-wrap" aria-hidden>
            <div className="hero-video__poster" style={{ backgroundImage: 'url(/hero-poster.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0, zIndex: 1 }} />
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-video__overlay" style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.55) 100%)', position: 'absolute', inset: 0, zIndex: 2 }} />
            <div className="hero-video__fade-bottom" style={{ background: 'linear-gradient(to top,rgba(10,10,10,0.85) 0%,transparent 40%)', position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 4 }} />
        </div>
    );
}

export default function Contact() {
    const dispatch = useDispatch();
    const { sendStatus, loading, error } = useSelector((state) => state.contact);

    const [quoteData, setQuoteData] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [form, setForm] = useState({
        name: "", email: "", phone: "", company: "",
        service: "", budget: "", message: "", honeypot: ""
    });
    const [phoneRaw, setPhoneRaw] = useState(""); // ham input değeri

    useEffect(() => {
        try {
            const raw = localStorage.getItem("alg-quote");
            if (raw) setQuoteData(JSON.parse(raw));
        } catch { }
    }, []);

    useEffect(() => {
        if (sendStatus === 'success') {
            const timer = setTimeout(() => dispatch(clearSendStatus()), 5000);
            return () => clearTimeout(timer);
        }
    }, [sendStatus, dispatch]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Telefon input handler
    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneRaw(formatted);
        set("phone", formatted);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.honeypot) return;

        try {
            await dispatch(sendContactMessage({
                name: form.name,
                email: form.email,
                message: form.message,
                ...(form.phone && { phone: form.phone }),
                ...(form.company && { company: form.company }),
                ...(form.service && { service: form.service }),
                ...(form.budget && { budget: form.budget }),
            })).unwrap();

            setForm({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "", honeypot: "" });
            setPhoneRaw("");
        } catch (err) {
            console.error("Form gönderme hatası:", err);
        }
    };

    return (
        <>
            <SEO
                title="İletişim — Ücretsiz Web Tasarım Teklifi Alın | Algorixa İstanbul"
                description="Web siteniz için 24 saat içinde ücretsiz teklif alın. İstanbul'da yüz yüze veya online görüşme. Landing page, kurumsal site, admin panel veya özel yazılım — ihtiyacınızı analiz edip net fiyat sunuyoruz."
                keywords="web tasarım teklif al istanbul, ücretsiz web sitesi analizi, web sitesi fiyat teklifi, kurumsal web sitesi teklifi, istanbul web geliştirici iletişim, web tasarım görüşme, landing page teklif, admin panelli site teklifi, algorixa iletişim, web tasarım whatsapp istanbul"
                url="https://www.algorixa.com.tr/iletisim"
                canonical="https://www.algorixa.com.tr/iletisim"
            />
            <style>{`
                .cnt-page { font-family: inherit; }

                /* ── Grid ── */
                .cnt-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.4fr;
                    gap: 60px;
                    align-items: start;
                }
                @media (max-width: 1024px) {
                    .cnt-grid { grid-template-columns: 1fr; gap: 40px; }
                }

                /* ── Info list ── */
                .cnt-info-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 36px; }
                .cnt-info-item { display: flex; align-items: flex-start; gap: 16px; }
                .cnt-info-item__icon {
                    width: 42px; height: 42px; border-radius: 12px;
                    background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.2);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold); flex-shrink: 0;
                }
                .cnt-info-item__label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--t-4); margin-bottom: 3px; }
                .cnt-info-item__value { font-size: 14px; color: var(--t-2); font-weight: 500; }
                .cnt-info-item__value--link { color: var(--gold); text-decoration: none; }
                .cnt-info-item__value--link:hover { text-decoration: underline; }

                /* ── Socials ── */
                .cnt-socials { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
                .cnt-social-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 10px 18px; border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.12);
                    color: var(--t-2); font-size: 13px; text-decoration: none;
                    transition: all 0.25s; backdrop-filter: blur(4px);
                }
                .cnt-social-btn:hover { border-color: var(--gold); color: var(--gold); }

                /* ── Quote panel ── */
                .cnt-quote-panel {
                    position: relative; border-radius: 16px;
                    border: 1px solid rgba(200,168,75,0.25);
                    background: rgba(200,168,75,0.04);
                    padding: 24px; margin-bottom: 28px; overflow: hidden;
                }
                .cnt-quote-panel__bar {
                    position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--gold), transparent);
                }
                .cnt-quote-panel__close {
                    position: absolute; top: 14px; right: 14px;
                    background: none; border: none; color: var(--t-4);
                    cursor: pointer; font-size: 14px; padding: 4px;
                }
                .cnt-quote-panel__head {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 13px; font-weight: 600; color: var(--t-2); margin-bottom: 16px;
                }
                .quote-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .quote-row__l { color: var(--t-4); }
                .quote-row__r { color: var(--t-2); font-weight: 500; }
                .quote-feat-list { list-style: none; padding: 8px 0; margin: 0; font-size: 12px; color: var(--t-4); }
                .quote-feat-list li::before { content: "✓ "; color: var(--gold); }
                .quote-total { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; }
                .quote-total__label { font-size: 12px; color: var(--t-4); text-transform: uppercase; letter-spacing: 0.08em; }
                .quote-total__amount { font-size: 20px; font-weight: 700; color: var(--gold); }

                /* ── Guarantees ── */
                .cnt-guarantees { display: flex; flex-direction: column; gap: 10px; }
                .cnt-guarantee {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 13px; color: var(--t-3);
                }

                /* ── Form card ── */
                .cnt-form-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px; padding: 44px;
                    position: relative; overflow: hidden;
                    backdrop-filter: blur(8px);
                }
                @media (max-width: 600px) {
                    .cnt-form-card { padding: 24px 20px; border-radius: 16px; }
                }
                .cnt-form-card__bar {
                    position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--gold), transparent 60%);
                }

                /* ── Form rows ── */
                .cnt-form-row {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;
                }
                @media (max-width: 580px) {
                    .cnt-form-row { grid-template-columns: 1fr; }
                }
                .form-field { margin-bottom: 16px; }
                .form-label {
                    display: block; font-size: 12px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    color: var(--t-3); margin-bottom: 8px;
                }
                .form-input {
                    width: 100%; padding: 14px 16px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px; color: var(--t-1);
                    font-size: 14px; outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    font-family: inherit;
                    box-sizing: border-box;
                }
                .form-input:focus {
                    border-color: rgba(200,168,75,0.5);
                    background: rgba(200,168,75,0.04);
                }
                .form-input::placeholder { color: rgba(255,255,255,0.2); }
                select.form-input { cursor: pointer; }
                select.form-input option { background: #1a1a1a; color: #fff; }
                textarea.form-input { resize: vertical; min-height: 120px; line-height: 1.6; }

                /* ── Select with icon ── */
                .select-wrapper { position: relative; }
                .select-wrapper select { padding-right: 36px; appearance: none; }
                .select-wrapper::after {
                    content: "▾"; position: absolute; right: 14px; top: 50%;
                    transform: translateY(-50%); color: var(--t-4); pointer-events: none;
                    font-size: 12px;
                }

                /* ── Service options styled ── */
                .service-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
                .service-option {
                    display: flex; align-items: center; gap: 12px;
                    padding: 12px 16px; border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.08);
                    cursor: pointer; transition: all 0.2s;
                    background: rgba(255,255,255,0.02);
                }
                .service-option:hover { border-color: rgba(200,168,75,0.3); background: rgba(200,168,75,0.04); }
                .service-option.selected { border-color: rgba(200,168,75,0.6); background: rgba(200,168,75,0.08); }
                .service-option__icon { font-size: 18px; flex-shrink: 0; }
                .service-option__text { font-size: 13px; color: var(--t-2); line-height: 1.4; }
                .service-option__check {
                    margin-left: auto; width: 20px; height: 20px;
                    border-radius: 50%; border: 2px solid rgba(255,255,255,0.15);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; transition: all 0.2s;
                }
                .service-option.selected .service-option__check {
                    background: var(--gold); border-color: var(--gold); color: #000;
                    font-size: 11px;
                }

                /* ── Submit btn ── */
                .cnt-submit-btn {
                    width: 100%; padding: 16px 24px; border-radius: 12px;
                    background: linear-gradient(135deg, var(--gold), #a8832a);
                    color: #000; font-size: 15px; font-weight: 700;
                    border: none; cursor: pointer; display: flex;
                    align-items: center; justify-content: center; gap: 10px;
                    transition: all 0.3s; letter-spacing: 0.02em;
                    margin-top: 8px;
                }
                .cnt-submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(200,168,75,0.3);
                }
                .cnt-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .cnt-submit-btn__dots::after {
                    content: "...";
                    display: inline-block;
                    animation: dots 1.2s steps(4, end) infinite;
                }
                @keyframes dots {
                    0%, 20% { content: ""; }
                    40% { content: "."; }
                    60% { content: ".."; }
                    80%, 100% { content: "..."; }
                }

                /* ── Error ── */
                .cnt-form-err {
                    display: flex; align-items: center; gap: 8px;
                    padding: 12px 16px; border-radius: 10px;
                    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
                    color: #fca5a5; font-size: 13px; margin-top: 12px;
                }

                /* ── Legal ── */
                .cnt-form-legal {
                    font-size: 11px; color: var(--t-4); text-align: center;
                    margin-top: 16px; line-height: 1.6;
                }

                /* ── Success ── */
                .cnt-success {
                    text-align: center; padding: 60px 20px;
                }
                .cnt-success__icon {
                    margin: 0 auto 24px;
                    width: 80px; height: 80px; border-radius: 50%;
                    background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.2);
                    display: flex; align-items: center; justify-content: center;
                }
                .cnt-success h3 {
                    font-size: 24px; font-weight: 700; margin-bottom: 12px; color: var(--t-1);
                }
                .cnt-success p { font-size: 15px; color: var(--t-3); line-height: 1.8; }

                /* ── Section label ── */
                .t-section-label { margin-bottom: 24px; }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* ── Hero ── */}
            <section className="page-hero">
                <VideoHero />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">İletişim</span></div>
                    <h1 className="page-hero__title">
                        Projenizi<br /><em>Hayata Geçirelim</em>
                    </h1>
                    <p className="page-hero__desc">
                        Formu doldurun, 24 saat içinde size dönüyoruz.
                        Ücretsiz ön görüşme ile somut teklif hazırlıyoruz.
                    </p>
                </div>
            </section>

            {/* ── Main ── */}
            <section className="page-section section-border-top">
                <div className="container">
                    <div className="cnt-grid">

                        {/* ── Sol kolon ── */}
                        <div className="cnt-left">
                            <div className="t-section-label">
                                <span className="t-label">Bize Ulaşın</span>
                            </div>
                            <h2 className="t-heading--sm" style={{ fontFamily: "var(--f-display)", marginBottom: "40px" }}>
                                Konuşmaktan<br />Memnuniyet Duyarız
                            </h2>

                            <div className="cnt-info-list">
                                {CONTACT_INFO.map(({ Icon, label, value, href }) => (
                                    <div key={label} className="cnt-info-item">
                                        <div className="cnt-info-item__icon"><Icon size={18} strokeWidth={1.5} /></div>
                                        <div>
                                            <div className="cnt-info-item__label">{label}</div>
                                            {href && href !== "#" ? (
                                                <a href={href} className="cnt-info-item__value cnt-info-item__value--link">{value}</a>
                                            ) : (
                                                <div className="cnt-info-item__value">{value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cnt-socials">
                                {SOCIALS.map(({ Icon, label, href }) => (
                                    <a key={label} href={href} className="cnt-social-btn" target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                                        <Icon size={16} strokeWidth={1.5} />
                                        {label}
                                    </a>
                                ))}
                            </div>

                            {quoteData && !dismissed && (
                                <div className="cnt-quote-panel">
                                    <div className="cnt-quote-panel__bar" />
                                    <button className="cnt-quote-panel__close" onClick={() => setDismissed(true)}>✕</button>
                                    <div className="cnt-quote-panel__head">
                                        <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                                        <span>Seçili Teklif Özeti</span>
                                    </div>
                                    <div className="cnt-quote-panel__body">
                                        <div className="quote-row">
                                            <span className="quote-row__l">Paket</span>
                                            <span className="quote-row__r">{quoteData.package || "Kurumsal – Dinamik"}</span>
                                        </div>
                                        {quoteData.features?.length > 0 && (
                                            <ul className="quote-feat-list">
                                                {quoteData.features.map(f => <li key={f}>{f}</li>)}
                                            </ul>
                                        )}
                                        <div className="quote-total">
                                            <span className="quote-total__label">Tahmini Tutar</span>
                                            <span className="quote-total__amount">{quoteData.price || "₺18.900"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="cnt-guarantees">
                                {GUARANTEES.map(({ Icon, text }) => (
                                    <div key={text} className="cnt-guarantee">
                                        <Icon size={14} strokeWidth={2} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Sağ: Form ── */}
                        <div className="cnt-form-card">
                            <div className="cnt-form-card__bar" />
                            <div className="t-section-label">
                                <span className="t-label">Teklif Formu</span>
                            </div>

                            {sendStatus === "success" ? (
                                <div className="cnt-success">
                                    <div className="cnt-success__icon">
                                        <CheckCircle2 size={48} strokeWidth={1} style={{ color: "var(--gold)" }} />
                                    </div>
                                    <h3>Formunuz Alındı!</h3>
                                    <p>
                                        En geç 24 saat içinde size dönülecektir.<br />
                                        WhatsApp ile de ulaşabilirsiniz:{" "}
                                        <a href="tel:+905469705451" style={{ color: "var(--gold)" }}>+90 546 970 54 51</a>
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* honeypot */}
                                    <input type="text" value={form.honeypot} onChange={e => set("honeypot", e.target.value)}
                                        style={{ position: "absolute", left: "-9999px", opacity: 0 }} tabIndex={-1} aria-hidden />

                                    {/* Ad + Email */}
                                    <div className="cnt-form-row">
                                        <div className="form-field" style={{ marginBottom: 0 }}>
                                            <label className="form-label">
                                                <User size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                                Ad Soyad <span style={{ color: "var(--gold)" }}>*</span>
                                            </label>
                                            <input className="form-input" type="text" placeholder="Ad Soyad"
                                                value={form.name} onChange={e => set("name", e.target.value)} required />
                                        </div>
                                        <div className="form-field" style={{ marginBottom: 0 }}>
                                            <label className="form-label">
                                                <Mail size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                                E-Posta <span style={{ color: "var(--gold)" }}>*</span>
                                            </label>
                                            <input className="form-input" type="email" placeholder="ornek@sirket.com"
                                                value={form.email} onChange={e => set("email", e.target.value)} required />
                                        </div>
                                    </div>

                                    {/* Telefon + Şirket */}
                                    <div className="cnt-form-row">
                                        <div className="form-field" style={{ marginBottom: 0 }}>
                                            <label className="form-label">
                                                <Phone size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                                Telefon
                                            </label>
                                            <input
                                                className="form-input"
                                                type="tel"
                                                placeholder="0555 555 55 55"
                                                value={phoneRaw}
                                                onChange={handlePhoneChange}
                                                maxLength={14}
                                                inputMode="numeric"
                                            />
                                        </div>
                                        <div className="form-field" style={{ marginBottom: 0 }}>
                                            <label className="form-label">
                                                <Building2 size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                                Şirket / Marka
                                            </label>
                                            <input className="form-input" type="text" placeholder="Şirket Adı"
                                                value={form.company} onChange={e => set("company", e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Hizmet seçimi — görsel kartlar */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            <ChevronRight size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                            Hangi Hizmeti Arıyorsunuz? <span style={{ color: "var(--gold)" }}>*</span>
                                        </label>
                                        <div className="service-options">
                                            {SERVICES_OPTS.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    className={`service-option ${form.service === opt.value ? "selected" : ""}`}
                                                    onClick={() => set("service", opt.value)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={e => e.key === "Enter" && set("service", opt.value)}
                                                >
                                                    <span className="service-option__icon">{opt.icon}</span>
                                                    <span className="service-option__text">{opt.label}</span>
                                                    <span className="service-option__check">
                                                        {form.service === opt.value && "✓"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bütçe */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            <ChevronRight size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                            Bütçe Aralığı
                                        </label>
                                        <div className="select-wrapper">
                                            <select className="form-input" value={form.budget} onChange={e => set("budget", e.target.value)}>
                                                <option value="">Seçiniz...</option>
                                                {BUDGET_OPTS.map(o => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mesaj */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            <Send size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                            Proje Detayları <span style={{ color: "var(--gold)" }}>*</span>
                                        </label>
                                        <textarea className="form-input" rows={5}
                                            placeholder="Projenizi kısaca anlatın — hedef kitle, istenen özellikler, referans siteler, süre beklentisi..."
                                            value={form.message} onChange={e => set("message", e.target.value)} required />
                                    </div>

                                    <button type="submit" className="cnt-submit-btn" disabled={loading || sendStatus === "loading"}>
                                        {(loading || sendStatus === "loading") ? (
                                            <>Gönderiliyor<span className="cnt-submit-btn__dots" /></>
                                        ) : (
                                            <><Send size={15} strokeWidth={1.5} /> Teklif Talebi Gönder</>
                                        )}
                                    </button>

                                    {error && (
                                        <div className="cnt-form-err">
                                            <AlertCircle size={15} strokeWidth={1.5} />
                                            {error}
                                        </div>
                                    )}

                                    <p className="cnt-form-legal">
                                        <Shield size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 4 }} />
                                        Formunuz KVKK kapsamında korunmaktadır. Bilgileriniz 3. taraflarla paylaşılmaz.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, clearSendStatus } from "../redux/contactSlice";
import {
    Mail, Phone, MapPin, Clock, Send, Instagram, MessageCircle,
    CheckCircle2, AlertCircle, ChevronRight, Shield, User, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/Seo";

// ─── Veri ─────────────────────────────────────────────────────────────────────
const SERVICES_OPTS = [
    { value: "Landing Page", label: "Landing Page" },
    { value: "Kurumsal Web – Statik", label: "Kurumsal Web — Statik" },
    { value: "Kurumsal Web – Dinamik (Admin Panelli)", label: "Kurumsal Web — Dinamik (Admin Panel)" },
    { value: "İnşaat Firması Web Sitesi", label: "İnşaat Firması Web Sitesi" },
    { value: "Emlak & Gayrimenkul Sitesi", label: "Emlak & Gayrimenkul Sitesi" },
    { value: "Kafe & Restoran Web Sitesi", label: "Kafe & Restoran Web Sitesi" },
    { value: "Özel Yazılım / B2B Çözüm", label: "Özel Yazılım / B2B Çözüm" },
    { value: "Aylık Bakım Paketi", label: "Aylık Bakım Paketi" },
    { value: "Diğer", label: "Diğer / Henüz karar vermedim" },
];

const BUDGET_OPTS = [
    { value: "₺10.000 – ₺20.000", label: "₺10.000 – ₺20.000" },
    { value: "₺20.000 – ₺40.000", label: "₺20.000 – ₺40.000" },
    { value: "₺40.000 – ₺80.000", label: "₺40.000 – ₺80.000" },
    { value: "₺80.000+", label: "₺80.000+" },
    { value: "Henüz belirlemedim", label: "Henüz belirlemedim" },
];

const CONTACT_INFO = [
    { Icon: Mail, label: "E-Posta", value: "enes.derin@algorixa.com.tr", href: "mailto:enes.derin@algorixa.com.tr" },
    { Icon: Phone, label: "Telefon", value: "+90 546 970 54 51", href: "tel:+905469705451" },
    { Icon: Clock, label: "Yanıt Süresi", value: "24 saat içinde net teklif", href: null },
];

const SOCIALS = [
    { Icon: Instagram, label: "Instagram", href: "#" },
    { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/905469705451" },
    { Icon: Mail, label: "E-posta", href: "mailto:enes.derin@algorixa.com.tr" },
];

// ─── Telefon formatlama ───────────────────────────────────────────────────────
const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits.length) return "";
    if (digits.startsWith("0")) {
        const d = digits.slice(0, 11);
        if (d.length <= 4) return d;
        if (d.length <= 7) return d.slice(0, 4) + " " + d.slice(4);
        if (d.length <= 9) return d.slice(0, 4) + " " + d.slice(4, 7) + " " + d.slice(7);
        return d.slice(0, 4) + " " + d.slice(4, 7) + " " + d.slice(7, 9) + " " + d.slice(9, 11);
    }
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
    if (d.length <= 8) return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6, 8) + " " + d.slice(8, 10);
};

// ─── Video Hero ───────────────────────────────────────────────────────────────
function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const onError = () => setIsLoaded(true);
        v.addEventListener("loadeddata", onLoad);
        v.addEventListener("error", onError);
        return () => {
            v.removeEventListener("loadeddata", onLoad);
            v.removeEventListener("error", onError);
        };
    }, []);

    return (
        <div className="hero-video-wrap" aria-hidden>
            <div className="hero-video__poster" style={{
                backgroundImage: "url(/hero-poster.jpg)", backgroundSize: "cover",
                backgroundPosition: "center", position: "absolute", inset: 0, zIndex: 1,
            }} />
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline
                preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.8s ease-in-out" }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-video__overlay" style={{
                background: "linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.55) 100%)",
                position: "absolute", inset: 0, zIndex: 2,
            }} />
            <div className="hero-video__fade-bottom" style={{
                background: "linear-gradient(to top,rgba(10,10,10,0.85) 0%,transparent 40%)",
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", zIndex: 4,
            }} />
        </div>
    );
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function Contact() {
    const dispatch = useDispatch();
    const { sendStatus, loading, error } = useSelector(s => s.contact);

    const [form, setForm] = useState({
        name: "", email: "", phone: "", company: "",
        service: "", budget: "", message: "", honeypot: "",
    });
    const [phoneRaw, setPhoneRaw] = useState("");

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handlePhoneChange = e => {
        const fmt = formatPhone(e.target.value);
        setPhoneRaw(fmt);
        set("phone", fmt);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.honeypot) return;
        try {
            await dispatch(sendContactMessage({
                name: form.name, email: form.email, message: form.message,
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

    useEffect(() => {
        if (sendStatus === "success") {
            const t = setTimeout(() => dispatch(clearSendStatus()), 6000);
            return () => clearTimeout(t);
        }
    }, [sendStatus, dispatch]);

    const isSending = loading || sendStatus === "loading";

    return (
        <>
            <SEO
                title="İletişim — Ücretsiz Web Tasarım Teklifi Alın | Algorixa İstanbul"
                description="Web siteniz için 24 saat içinde ücretsiz teklif alın. İstanbul'da yüz yüze veya online görüşme."
                keywords="web tasarım teklif al istanbul, ücretsiz web sitesi analizi, web sitesi fiyat teklifi"
                url="https://www.algorixa.com.tr/iletisim"
                canonical="https://www.algorixa.com.tr/iletisim"
            />

            <style>{`
                @keyframes spin  { to { transform: rotate(360deg); } }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.85); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes cntPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(200,168,75,0.4); }
                    50%     { box-shadow: 0 0 0 10px rgba(200,168,75,0); }
                }

                /* ── Layout ── */
                .cnt-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 56px;
                    align-items: start;
                }
                @media (max-width: 1024px) { .cnt-grid { grid-template-columns: 1fr; gap: 40px; } }

                /* ── Sol kolon ── */
                .cnt-left { position: sticky; top: 100px; }
                @media (max-width: 1024px) { .cnt-left { position: static; } }

                .cnt-heading {
                    font-size: clamp(22px, 3vw, 30px);
                    font-weight: 800;
                    font-family: var(--f-display);
                    color: var(--t-1);
                    line-height: 1.25;
                    margin: 0 0 32px;
                }
                .cnt-heading em {
                    font-style: normal;
                    color: var(--gold);
                }

                /* ── Info kartlar ── */
                .cnt-info-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
                .cnt-info-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 14px 16px; border-radius: 12px;
                    background: var(--bg-card);
                    border: 1px solid var(--b-faint);
                    transition: border-color 0.2s;
                }
                .cnt-info-item:hover { border-color: var(--b-mid); }
                .cnt-info-item__icon {
                    width: 36px; height: 36px; border-radius: 10px;
                    background: var(--gold-glow);
                    border: 1px solid var(--b-soft);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold); flex-shrink: 0;
                }
                .cnt-info-item__label {
                    font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
                    color: var(--t-4); margin-bottom: 2px; font-family: var(--f-mono);
                }
                .cnt-info-item__value { font-size: 13px; color: var(--t-2); font-weight: 500; }
                .cnt-info-item__value--link { color: var(--gold); text-decoration: none; }
                .cnt-info-item__value--link:hover { text-decoration: underline; }

                /* ── Sosyal ── */
                .cnt-socials { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
                .cnt-social-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 9px 16px; border-radius: 50px;
                    border: 1px solid var(--b-soft);
                    color: var(--t-3); font-size: 12px; text-decoration: none;
                    background: var(--bg-card);
                    transition: all 0.2s;
                }
                .cnt-social-btn:hover { border-color: var(--b-mid); color: var(--gold); }

                /* ── Garanti bandı ── */
                .cnt-guarantee-band {
                    display: flex; align-items: center; gap: 10px;
                    padding: 12px 16px; border-radius: 10px;
                    background: var(--gold-glow);
                    border: 1px solid var(--b-soft);
                    font-size: 12px; color: var(--t-3);
                }

                /* ── Form kartı ── */
                .cnt-form-card {
                    background: var(--bg-card);
                    border: 1px solid var(--b-soft);
                    border-radius: 20px; padding: 40px;
                    position: relative; overflow: hidden;
                }
                .cnt-form-card__topbar {
                    position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--gold) 0%, rgba(200,168,75,0.3) 60%, transparent 100%);
                }
                @media (max-width: 600px) { .cnt-form-card { padding: 24px 18px; border-radius: 14px; } }

                .cnt-form-title {
                    font-size: 18px; font-weight: 700; color: var(--t-1);
                    font-family: var(--f-display); margin: 0 0 6px;
                }
                .cnt-form-subtitle {
                    font-size: 13px; color: var(--t-3); margin: 0 0 28px; line-height: 1.5;
                }

                /* ── Field ── */
                .cnt-form-row {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;
                }
                @media (max-width: 560px) { .cnt-form-row { grid-template-columns: 1fr; } }

                .form-field { margin-bottom: 14px; }
                .form-label {
                    display: flex; align-items: center; gap: 5px;
                    font-size: 11px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.09em; color: var(--t-4); margin-bottom: 7px;
                }
                .form-label__req { color: var(--gold); font-size: 13px; line-height: 1; }

                /* ── Input — Dark Mode ── */
                .cnt-form-input {
                    width: 100%; padding: 12px 14px;
                    background: var(--bg-2);
                    border: 1px solid var(--b-soft);
                    border-radius: 10px;
                    color: var(--t-1);
                    font-size: 14px; outline: none;
                    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
                    font-family: inherit; box-sizing: border-box;
                }
                .cnt-form-input:focus {
                    border-color: var(--gold);
                    background: var(--bg-1);
                    box-shadow: 0 0 0 3px var(--gold-glow);
                }
                .cnt-form-input::placeholder { color: var(--t-4); }
                textarea.cnt-form-input { resize: vertical; min-height: 110px; line-height: 1.65; }
                select.cnt-form-input { cursor: pointer; appearance: none; padding-right: 36px; }

                /* ── Input — Light Mode ── */
                [data-theme="light"] .cnt-form-input {
                    background: #ffffff;
                    border-color: rgba(100, 80, 20, 0.18);
                    color: #1a1510;
                }
                [data-theme="light"] .cnt-form-input:focus {
                    border-color: #a8863a;
                    background: #faf6ee;
                    box-shadow: 0 0 0 3px rgba(168, 134, 58, 0.1);
                }
                [data-theme="light"] .cnt-form-input::placeholder {
                    color: #a09070;
                }
                [data-theme="light"] select.cnt-form-input option {
                    background: #ffffff;
                    color: #1a1510;
                }

                .select-wrap { position: relative; }
                .select-wrap::after {
                    content: "▾"; position: absolute; right: 13px; top: 50%;
                    transform: translateY(-50%); color: var(--t-4);
                    pointer-events: none; font-size: 11px;
                }

                /* ── Hizmet grid ── */
                .service-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-bottom: 14px;
                }
                @media (max-width: 480px) { .service-grid { grid-template-columns: 1fr; } }

                .service-opt {
                    display: flex; align-items: center; gap: 10px;
                    padding: 11px 14px; border-radius: 10px;
                    border: 1px solid var(--b-faint);
                    cursor: pointer; transition: all 0.18s;
                    background: var(--bg-1);
                    user-select: none;
                }
                .service-opt:hover {
                    border-color: var(--b-mid);
                    background: var(--bg-2);
                }
                .service-opt--active {
                    border-color: var(--gold);
                    background: var(--gold-glow);
                }

                /* Light mode service-opt */
                [data-theme="light"] .service-opt {
                    background: #f3ede1;
                    border-color: rgba(100, 80, 20, 0.12);
                }
                [data-theme="light"] .service-opt:hover {
                    background: #ebe3d4;
                    border-color: rgba(100, 80, 20, 0.25);
                }
                [data-theme="light"] .service-opt--active {
                    background: rgba(168, 134, 58, 0.1);
                    border-color: #a8863a;
                }
                [data-theme="light"] .service-opt__label {
                    color: #3d3525;
                }
                [data-theme="light"] .service-opt--active .service-opt__label {
                    color: #1a1510;
                }

                .service-opt__dot {
                    width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
                    border: 2px solid var(--b-mid);
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.18s;
                }
                .service-opt--active .service-opt__dot {
                    background: var(--gold); border-color: var(--gold);
                }
                .service-opt__check { font-size: 9px; color: #000; font-weight: 800; line-height: 1; }
                .service-opt__label { font-size: 12px; color: var(--t-2); line-height: 1.35; }
                .service-opt--active .service-opt__label { color: var(--t-1); }

                /* "Diğer" tek sütun */
                .service-opt--wide { grid-column: 1 / -1; }

                /* ── Form kartı light mode ── */
                [data-theme="light"] .cnt-form-card {
                    background: #ffffff;
                    border-color: rgba(100, 80, 20, 0.14);
                }
                [data-theme="light"] .cnt-form-title { color: #1a1510; }
                [data-theme="light"] .cnt-form-subtitle { color: #6e6248; }
                [data-theme="light"] .form-label { color: #6e6248; }

                /* ── Info kartlar light mode ── */
                [data-theme="light"] .cnt-info-item {
                    background: #ffffff;
                    border-color: rgba(100, 80, 20, 0.1);
                }
                [data-theme="light"] .cnt-info-item__value { color: #3d3525; }
                [data-theme="light"] .cnt-social-btn {
                    background: #ffffff;
                    border-color: rgba(100, 80, 20, 0.14);
                    color: #6e6248;
                }
                [data-theme="light"] .cnt-guarantee-band {
                    background: rgba(168, 134, 58, 0.08);
                    border-color: rgba(168, 134, 58, 0.2);
                    color: #6e6248;
                }

                /* ── Submit butonu ── */
                .cnt-btn {
                    width: 100%; padding: 15px 24px; border-radius: 12px;
                    background: var(--gold);
                    color: #000; font-size: 14px; font-weight: 700;
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 9px;
                    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
                    letter-spacing: 0.03em; margin-top: 6px; position: relative;
                    overflow: hidden;
                }
                .cnt-btn::before {
                    content: "";
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
                    pointer-events: none;
                }
                .cnt-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(200,168,75,0.35);
                }
                .cnt-btn:active:not(:disabled) { transform: translateY(0); }
                .cnt-btn:disabled { opacity: 0.65; cursor: not-allowed; }

                .cnt-btn__spinner {
                    width: 16px; height: 16px; border-radius: 50%;
                    border: 2px solid rgba(0,0,0,0.2);
                    border-top-color: #000;
                    animation: spin 0.7s linear infinite; flex-shrink: 0;
                }

                /* ── Hata kutusu ── */
                .cnt-form-err {
                    display: flex; align-items: flex-start; gap: 10px;
                    padding: 13px 15px; border-radius: 10px;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.22);
                    color: #fca5a5; font-size: 13px; margin-top: 12px;
                    line-height: 1.5; animation: fadeUp 0.3s ease;
                }
                [data-theme="light"] .cnt-form-err {
                    color: #b91c1c;
                    background: rgba(239,68,68,0.06);
                }

                /* ── Yasal not ── */
                .cnt-form-legal {
                    display: flex; align-items: flex-start; gap: 6px;
                    font-size: 11px; color: var(--t-4);
                    margin-top: 14px; line-height: 1.6;
                }

                /* ── Başarı ekranı ── */
                .cnt-success {
                    display: flex; flex-direction: column;
                    align-items: center; text-align: center;
                    padding: 48px 24px;
                    animation: fadeUp 0.4s ease;
                }
                .cnt-success__ring {
                    width: 80px; height: 80px; border-radius: 50%;
                    background: var(--gold-glow);
                    border: 1px solid var(--b-soft);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                    animation: scaleIn 0.4s ease, cntPulse 2s ease 0.6s infinite;
                }
                .cnt-success__title {
                    font-size: 22px; font-weight: 800; color: var(--t-1);
                    font-family: var(--f-display); margin: 0 0 10px;
                }
                .cnt-success__desc {
                    font-size: 14px; color: var(--t-3); line-height: 1.8; margin: 0 0 28px;
                    max-width: 340px;
                }
                .cnt-success__chips {
                    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
                    margin-bottom: 28px;
                }
                .cnt-success__chip {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 14px; border-radius: 100px;
                    background: var(--gold-glow);
                    border: 1px solid var(--b-soft);
                    font-size: 12px; color: var(--t-2);
                    font-family: var(--f-mono);
                }
                .cnt-success__wa {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 13px 24px; border-radius: 12px;
                    background: #25d366; color: #fff;
                    font-size: 14px; font-weight: 600; text-decoration: none;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .cnt-success__wa:hover { opacity: 0.9; transform: translateY(-2px); }
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

            {/* ── İçerik ── */}
            <section className="page-section section-border-top">
                <div className="container">
                    <div className="cnt-grid">

                        {/* ──────────── Sol kolon ──────────── */}
                        <div className="cnt-left">
                            <span className="t-label" style={{ display: "block", marginBottom: "14px" }}>Bize Ulaşın</span>
                            <h2 className="cnt-heading">
                                Konuşmaktan<br /><em>Memnuniyet Duyarız</em>
                            </h2>

                            <div className="cnt-info-list">
                                {CONTACT_INFO.map(({ Icon, label, value, href }) => (
                                    <div key={label} className="cnt-info-item">
                                        <div className="cnt-info-item__icon">
                                            <Icon size={16} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className="cnt-info-item__label">{label}</div>
                                            {href ? (
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
                                    <a key={label} href={href} className="cnt-social-btn"
                                        target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                                        <Icon size={14} strokeWidth={1.5} />
                                        {label}
                                    </a>
                                ))}
                            </div>

                            <div className="cnt-guarantee-band">
                                <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
                                <span>24 saat içinde net teklif — bağlayıcı değildir.</span>
                            </div>
                        </div>

                        {/* ──────────── Form kartı ──────────── */}
                        <div className="cnt-form-card">
                            <div className="cnt-form-card__topbar" />

                            {sendStatus === "success" ? (
                                /* ── Başarı Ekranı ── */
                                <div className="cnt-success">
                                    <div className="cnt-success__ring">
                                        <CheckCircle2 size={40} strokeWidth={1.2} style={{ color: "var(--gold)" }} />
                                    </div>
                                    <h3 className="cnt-success__title">Talebiniz Alındı!</h3>
                                    <p className="cnt-success__desc">
                                        En geç <strong style={{ color: "var(--t-1)" }}>24 saat</strong> içinde
                                        size dönülecektir. Acil durumlar için WhatsApp'tan yazabilirsiniz.
                                    </p>
                                    <div className="cnt-success__chips">
                                        {["Ücretsiz görüşme", "Net teklif", "Baskı yok"].map(c => (
                                            <span key={c} className="cnt-success__chip">
                                                <CheckCircle2 size={11} strokeWidth={2} style={{ color: "var(--gold)" }} />
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                    <a href="https://wa.me/905469705451" className="cnt-success__wa"
                                        target="_blank" rel="noreferrer">
                                        <MessageCircle size={16} strokeWidth={1.5} />
                                        WhatsApp ile Yaz
                                    </a>
                                </div>
                            ) : (
                                /* ── Form ── */
                                <>
                                    <p className="cnt-form-title">Teklif Formu</p>
                                    <p className="cnt-form-subtitle">
                                        Tüm alanları doldurun, size özel teklif hazırlayalım.
                                    </p>

                                    <form onSubmit={handleSubmit} noValidate>
                                        {/* honeypot */}
                                        <input type="text" value={form.honeypot}
                                            onChange={e => set("honeypot", e.target.value)}
                                            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                                            tabIndex={-1} aria-hidden />

                                        {/* Ad + E-posta */}
                                        <div className="cnt-form-row">
                                            <div className="form-field" style={{ marginBottom: 0 }}>
                                                <label className="form-label">
                                                    <User size={10} strokeWidth={1.5} />
                                                    Ad Soyad <span className="form-label__req">*</span>
                                                </label>
                                                <input className="cnt-form-input" type="text" placeholder="Ad Soyad"
                                                    value={form.name} onChange={e => set("name", e.target.value)} required />
                                            </div>
                                            <div className="form-field" style={{ marginBottom: 0 }}>
                                                <label className="form-label">
                                                    <Mail size={10} strokeWidth={1.5} />
                                                    E-Posta <span className="form-label__req">*</span>
                                                </label>
                                                <input className="cnt-form-input" type="email" placeholder="ornek@sirket.com"
                                                    value={form.email} onChange={e => set("email", e.target.value)} required />
                                            </div>
                                        </div>

                                        {/* Telefon + Şirket */}
                                        <div className="cnt-form-row">
                                            <div className="form-field" style={{ marginBottom: 0 }}>
                                                <label className="form-label">
                                                    <Phone size={10} strokeWidth={1.5} />
                                                    Telefon
                                                </label>
                                                <input className="cnt-form-input" type="tel"
                                                    placeholder="0555 555 55 55"
                                                    value={phoneRaw} onChange={handlePhoneChange}
                                                    maxLength={14} inputMode="numeric" />
                                            </div>
                                            <div className="form-field" style={{ marginBottom: 0 }}>
                                                <label className="form-label">
                                                    <Building2 size={10} strokeWidth={1.5} />
                                                    Şirket / Marka
                                                </label>
                                                <input className="cnt-form-input" type="text" placeholder="Şirket Adı"
                                                    value={form.company} onChange={e => set("company", e.target.value)} />
                                            </div>
                                        </div>

                                        {/* Hizmet seçimi */}
                                        <div className="form-field">
                                            <label className="form-label">
                                                <ChevronRight size={10} strokeWidth={1.5} />
                                                Hangi Hizmeti Arıyorsunuz? <span className="form-label__req">*</span>
                                            </label>
                                            <div className="service-grid">
                                                {SERVICES_OPTS.map(opt => {
                                                    const isWide = opt.value === "Diğer";
                                                    const isActive = form.service === opt.value;
                                                    return (
                                                        <div
                                                            key={opt.value}
                                                            className={`service-opt${isActive ? " service-opt--active" : ""}${isWide ? " service-opt--wide" : ""}`}
                                                            onClick={() => set("service", opt.value)}
                                                            role="button" tabIndex={0}
                                                            onKeyDown={e => e.key === "Enter" && set("service", opt.value)}
                                                        >
                                                            <span className="service-opt__dot">
                                                                {isActive && <span className="service-opt__check">✓</span>}
                                                            </span>
                                                            <span className="service-opt__label">{opt.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Bütçe */}
                                        <div className="form-field">
                                            <label className="form-label">
                                                <ChevronRight size={10} strokeWidth={1.5} />
                                                Bütçe Aralığı
                                            </label>
                                            <div className="select-wrap">
                                                <select className="cnt-form-input" value={form.budget}
                                                    onChange={e => set("budget", e.target.value)}>
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
                                                <Send size={10} strokeWidth={1.5} />
                                                Proje Detayları <span className="form-label__req">*</span>
                                            </label>
                                            <textarea className="cnt-form-input" rows={5}
                                                placeholder="Projenizi kısaca anlatın — hedef kitle, istenen özellikler, referans siteler, süre beklentisi..."
                                                value={form.message} onChange={e => set("message", e.target.value)} required />
                                        </div>

                                        {/* Gönder */}
                                        <button type="submit" className="cnt-btn" disabled={isSending}>
                                            {isSending ? (
                                                <>
                                                    <span className="cnt-btn__spinner" />
                                                    Gönderiliyor...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} strokeWidth={1.5} />
                                                    Teklif Talebi Gönder
                                                </>
                                            )}
                                        </button>

                                        {/* Hata */}
                                        {error && (
                                            <div className="cnt-form-err">
                                                <AlertCircle size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        {/* Yasal */}
                                        <p className="cnt-form-legal">
                                            <Shield size={11} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2, color: "var(--t-4)" }} />
                                            Formunuz KVKK kapsamında korunmaktadır. Bilgileriniz 3. taraflarla paylaşılmaz.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
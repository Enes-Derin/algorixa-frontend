import { Link } from "react-router-dom";
import {
    Mail, Phone, MapPin, Instagram, MessageCircle,
    ArrowRight, Code2, Cpu, Globe,
    ShieldCheck, Clock
} from "lucide-react";

const SERVICES_LINKS = [
    ["Landing Page", "/hizmetler"],
    ["Kurumsal Web Sitesi", "/hizmetler"],
    ["Admin Panelli Yazılım", "/hizmetler"],
    ["Özel Yazılım & B2B", "/hizmetler"],
];

const COMPANY_LINKS = [
    ["Hakkımızda", "/hakkimizda"],
    ["Referanslar", "/referanslar"],
    ["Blog", "/blog"],
    ["Fiyatlandırma", "/fiyatlandirma"],
    ["İletişim", "/iletisim"],
];

const CONTACT_ITEMS = [
    { Icon: Mail, href: "mailto:enes.derin@algorixa.com.tr", label: "enes.derin@algorixa.com.tr" },
    { Icon: Phone, href: "tel:+905469705451", label: "+90 546 970 54 51" },
    { Icon: MapPin, href: null, label: "İstanbul, Türkiye" },
    { Icon: Clock, href: null, label: "24 saat içinde yanıt" },
];

const SOCIALS = [
    { Icon: Instagram, href: "https://www.instagram.com/algorixa_/", label: "Instagram" },
    { Icon: MessageCircle, href: "https://wa.me/905469705451", label: "WhatsApp" },
    { Icon: Mail, href: "mailto:enes.derin@algorixa.com.tr", label: "E-posta" },
];



export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">

                    {/* ── Brand column ── */}
                    <div className="footer__brand-col">
                        <Link to="/" className="footer__logo-lockup">
                            <span className="footer__logo-text">ALGORIXA</span>
                            <span className="footer__logo-sub">Dijital Çözüm Ortağınız</span>
                        </Link>
                        <p className="footer__desc">
                            Markanızı dijital dünyada zirveye taşıyan, sonuç odaklı
                            web tasarım ve geliştirme ajansı.
                            İstanbul merkezli, global vizyonlu.
                        </p>
                        <div className="footer__socials">
                            {SOCIALS.map(({ Icon, href, label }) => (
                                <a key={label} href={href} className="footer__social-btn" aria-label={label}>
                                    <Icon size={15} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Services column ── */}
                    <div>
                        <p className="footer__col-title">
                            <Code2 size={13} strokeWidth={1.5} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                            Hizmetler
                        </p>
                        <nav className="footer__nav">
                            {SERVICES_LINKS.map(([label, to]) => (
                                <Link key={label} to={to} className="footer__link">
                                    <ArrowRight size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* ── Company column ── */}
                    <div>
                        <p className="footer__col-title">
                            <Globe size={13} strokeWidth={1.5} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                            Şirket
                        </p>
                        <nav className="footer__nav">
                            {COMPANY_LINKS.map(([label, to]) => (
                                <Link key={label} to={to} className="footer__link">
                                    <ArrowRight size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* ── CTA + Contact column ── */}
                    <div>
                        <p className="footer__col-title">
                            <Cpu size={13} strokeWidth={1.5} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                            Bir Proje Mi Var?
                        </p>
                        <div className="footer__cta-box">
                            <p>
                                Markanız için doğru dijital stratejiyi birlikte belirleyelim.
                                Ücretsiz ön görüşme için bize ulaşın.
                            </p>
                            <Link to="/iletisim" className="btn btn--primary btn--mono btn--sm footer__cta-btn">
                                Teklif Al
                                <ArrowRight size={12} strokeWidth={2} />
                            </Link>
                        </div>

                        <p className="footer__col-title" style={{ marginTop: "28px" }}>
                            <MapPin size={13} strokeWidth={1.5} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                            İletişim
                        </p>
                        <div className="footer__contact-list">
                            {CONTACT_ITEMS.map(({ Icon, href, label }) => (
                                href ? (
                                    <a key={label} href={href} className="footer__contact-item">
                                        <Icon size={13} strokeWidth={1.5} style={{ flexShrink: 0, color: "var(--primary)" }} />
                                        {label}
                                    </a>
                                ) : (
                                    <div key={label} className="footer__contact-item">
                                        <Icon size={13} strokeWidth={1.5} style={{ flexShrink: 0, color: "var(--primary)" }} />
                                        {label}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="footer__bottom">
                    <div className="footer__bottom-left">
                        <ShieldCheck size={13} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                        <span>© {year} Algorixa. Tüm hakları saklıdır.</span>
                    </div>

                </div>
            </div>
        </footer>
    );
}
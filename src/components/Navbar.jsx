import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { to: "/", label: "Ana Sayfa", end: true },
    { to: "/hizmetler", label: "Hizmetler" },
    { to: "/referanslar", label: "Referanslar" },
    { to: "/fiyatlandirma", label: "Fiyatlandırma" },
    { to: "/hakkimizda", label: "Hakkımızda" },
    { to: "/iletisim", label: "İletişim" },
    { to: "/blog", label: "Blog" },
];

/* ── Algorixa "A" mark — pixel-accurate SVG matching the real logo ── */
function AlgorizaMark({ size = 120 }) {

    const grad = "algorixaGold";

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
        >

            <defs>
                <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f6e1a3" />
                    <stop offset="40%" stopColor="#d7aa45" />
                    <stop offset="70%" stopColor="#b8862e" />
                    <stop offset="100%" stopColor="#6f4f16" />
                </linearGradient>
            </defs>

            {/* A HARFİ */}
            <path
                d="
                M20 105
                L60 15
                L100 105
                L85 105
                L73 75
                L47 75
                L35 105
                Z
                "
                fill={`url(#${grad})`}
            />

            {/* ORTA ÇİZGİ */}
            <rect
                x="47"
                y="68"
                width="26"
                height="8"
                fill={`url(#${grad})`}
            />

        </svg>
    );
}

function AlgorizaLogo() {
    return (
        <span className="alg-lockup">
            <AlgorizaMark size={36} />
            <span className="alg-lockup__text">
                <span className="alg-lockup__name">ALGORIXA</span>
                <span className="alg-lockup__sub">Dijital Çözüm Ortağınız</span>
            </span>
        </span>
    );
}

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [indStyle, setIndStyle] = useState({});
    const navRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 48);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => { setOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        if (!navRef.current) return;
        const active = navRef.current.querySelector(".nb-link.active");
        if (active) {
            const nr = navRef.current.getBoundingClientRect();
            const lr = active.getBoundingClientRect();
            setIndStyle({ left: lr.left - nr.left, width: lr.width, opacity: 1 });
        } else {
            setIndStyle({ opacity: 0, width: 0 });
        }
    }, [location.pathname]);

    return (
        <>
            <header className={`nb${scrolled ? " nb--scrolled" : ""}`}>
                <div className="nb__inner">
                    <Link to="/" className="nb__brand"><AlgorizaLogo /></Link>

                    {/* Desktop nav */}
                    <nav className="nb__nav" ref={navRef} aria-label="Gezinti">
                        {NAV_LINKS.map(l => (
                            <NavLink
                                key={l.to} to={l.to} end={l.end}
                                className={({ isActive }) => "nb-link" + (isActive ? " active" : "")}
                            >{l.label}</NavLink>
                        ))}
                        <span className="nb__ind" style={indStyle} aria-hidden="true" />
                    </nav>

                    <div className="nb__ctl">
                        {/* Theme toggle — Lucide Sun/Moon */}
                        <button className="nb__theme" onClick={toggle} aria-label="Temayı değiştir">
                            {theme === "dark"
                                ? <Sun size={16} strokeWidth={1.8} />
                                : <Moon size={16} strokeWidth={1.8} />
                            }
                        </button>

                        <Link to="/iletisim" className="nb__cta">
                            Teklif Al
                        </Link>

                        <button
                            className={`nb__burger${open ? " open" : ""}`}
                            onClick={() => setOpen(o => !o)}
                            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
                            aria-expanded={open}
                        >
                            {open
                                ? <X size={18} strokeWidth={1.8} style={{ color: "var(--t-1)" }} />
                                : <Menu size={18} strokeWidth={1.8} style={{ color: "var(--t-1)" }} />
                            }
                        </button>
                    </div>
                </div>
            </header>

            {/* Backdrop */}
            <div className={`nb-bk${open ? " show" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

            {/* Drawer */}
            <aside className={`nb-drawer${open ? " open" : ""}`} aria-hidden={!open}>
                <div className="nb-drawer__head" style={{ marginTop: 10 }}>

                </div>
                <nav className="nb-drawer__nav">
                    {NAV_LINKS.map((l, i) => (
                        <NavLink
                            key={l.to} to={l.to} end={l.end}
                            className={({ isActive }) => "nb-drawer__link" + (isActive ? " active" : "")}
                            onClick={() => setOpen(false)}
                        >
                            <span className="nb-drawer__num">0{i + 1}</span>
                            {l.label}
                            <ArrowUpRight
                                size={14} strokeWidth={1.5}
                                className="nb-drawer__arr"
                            />
                        </NavLink>
                    ))}
                </nav>
                <div className="nb-drawer__foot">
                    <Link to="/iletisim" className="btn btn--primary btn--full" onClick={() => setOpen(false)}>
                        Ücretsiz Teklif Al
                    </Link>
                    <div className="nb-drawer__theme-row">
                        <span>Tema</span>
                        <button className="nb__theme" onClick={toggle} aria-label="Temayı değiştir">
                            {theme === "dark"
                                ? <Sun size={15} strokeWidth={1.8} />
                                : <Moon size={15} strokeWidth={1.8} />
                            }
                        </button>
                    </div>
                </div>
            </aside>

            <style>{`
                /* navbar bg token for SVG cutout */
                .nb                      { --navbar-bg: var(--bg-0); }
                .nb--scrolled            { --navbar-bg: var(--bg-glass); }
                [data-theme="light"] .nb { --navbar-bg: var(--bg-0); }

                /* ── Shell ── */
                .nb {
                    position: fixed; top:0; left:0; right:0; width:100%;
                    z-index: 1000;
                    transition: all .4s var(--ease-soft);
                }
                .nb__inner {
                    display: flex; justify-content: space-between; align-items: center;
                    width: 100%; box-sizing: border-box;
                    padding: 14px 48px;
                    transition: all .4s var(--ease-soft);
                }
                .nb--scrolled .nb__inner {
                    padding: 9px 48px;
                    background: var(--bg-glass);
                    backdrop-filter: blur(28px) saturate(180%);
                    -webkit-backdrop-filter: blur(28px) saturate(180%);
                    border-bottom: 1px solid var(--b-faint);
                    box-shadow: 0 4px 40px rgba(0,0,0,.22);
                }

                /* ── Logo lockup ── */
                .nb__brand { text-decoration: none; flex-shrink: 0; }
                .alg-lockup {
                    display: inline-flex; align-items: center; gap: 10px;
                    transition: opacity .2s;
                }
                .nb__brand:hover .alg-lockup { opacity: .82; }
                .nb__brand:hover .alg-lockup svg {
                    filter: drop-shadow(0 0 10px rgba(200,168,75,.6));
                    transform: scale(1.05);
                }
                .alg-lockup svg { transition: filter .3s, transform .3s var(--ease); }
                .alg-lockup__text {
                    display: flex; flex-direction: column; gap: 2px; line-height: 1;
                }
                .alg-lockup__name {
                    font-family: var(--f-display);
                    font-size: 18px; font-weight: 600; letter-spacing: .22em;
                    background: linear-gradient(120deg,#f0d080 0%,#c8a84b 50%,#7a5e20 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    line-height: 1;
                }
                .alg-lockup__sub {
                    font-family: var(--f-mono); font-size: 7.5px; letter-spacing: .3em;
                    text-transform: uppercase; color: var(--t-4);
                    -webkit-text-fill-color: var(--t-4); line-height: 1;
                }

                /* ── Desktop nav ── */
                .nb__nav {
                    display: flex; align-items: center; gap: 30px; position: relative;
                }
                .nb-link {
                    font-size: 13px; font-weight: 500; color: var(--t-2); letter-spacing: .03em;
                    text-decoration: none; padding-bottom: 3px; white-space: nowrap; transition: color .2s;
                }
                .nb-link::after { display: none; }
                .nb-link:hover  { color: var(--t-1); }
                .nb-link.active { color: var(--gold); }
                .nb__ind {
                    position: absolute; bottom: -3px; height: 1px;
                    background: var(--gold); box-shadow: 0 0 8px rgba(200,168,75,.55);
                    pointer-events: none;
                    transition: left .35s var(--ease), width .35s var(--ease), opacity .25s;
                }

                /* ── Light mode — hero üzerinde (scroll öncesi) sade renkler ── */
                [data-theme="light"] .nb:not(.nb--scrolled) .nb-link {
                    color: rgba(250, 246, 238, 0.88);
                    font-weight: 500;
                    text-shadow: none;
                    filter: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb-link:hover {
                    color: #ffffff;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb-link.active {
                    color: var(--gold-light, #dfc07a);
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__ind {
                    background: var(--gold-light, #dfc07a);
                    box-shadow: 0 0 8px rgba(223,192,122,.55);
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .alg-lockup__name {
                    background: linear-gradient(120deg,#f0d080 0%,#c8a84b 50%,#7a5e20 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    filter: none;
                    text-shadow: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .alg-lockup__sub {
                    color: rgba(250, 246, 238, 0.6);
                    -webkit-text-fill-color: rgba(250, 246, 238, 0.6);
                    text-shadow: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__theme {
                    border-color: rgba(245, 239, 226, 0.35);
                    color: rgba(245, 239, 226, 0.85);
                    background: rgba(0, 0, 0, 0.15);
                    box-shadow: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__theme:hover {
                    border-color: var(--gold-light, #dfc07a);
                    color: var(--gold-light, #dfc07a);
                    background: rgba(0, 0, 0, 0.25);
                    box-shadow: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__cta {
                    background: linear-gradient(135deg, #c8a84b, #dfc07a);
                    color: #1a1205 !important;
                    border: none;
                    box-shadow: 0 4px 20px rgba(200, 168, 75, 0.4);
                    text-shadow: none;
                    filter: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__cta:hover {
                    box-shadow: 0 6px 28px rgba(200, 168, 75, 0.55);
                    transform: translateY(-2px);
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__burger {
                    border-color: rgba(245, 239, 226, 0.35);
                    background: rgba(0, 0, 0, 0.15);
                    box-shadow: none;
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__burger:hover {
                    border-color: var(--gold-light, #dfc07a);
                    background: rgba(0, 0, 0, 0.25);
                }
                [data-theme="light"] .nb:not(.nb--scrolled) .nb__burger svg {
                    color: rgba(245, 239, 226, 0.9) !important;
                    filter: none;
                }
                /* Scroll sonrası normal light mode renklerine dön */
                [data-theme="light"] .nb.nb--scrolled .nb-link {
                    color: var(--t-2);
                    text-shadow: none;
                    filter: none;
                }
                [data-theme="light"] .nb.nb--scrolled .nb-link:hover { color: var(--t-1); }
                [data-theme="light"] .nb.nb--scrolled .nb-link.active { color: var(--gold); }
                [data-theme="light"] .nb.nb--scrolled .nb__ind {
                    background: var(--gold);
                    box-shadow: 0 0 8px rgba(168,134,58,.55);
                }
                [data-theme="light"] .nb.nb--scrolled .alg-lockup__name {
                    background: linear-gradient(120deg,#f0d080 0%,#c8a84b 50%,#7a5e20 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    filter: none; text-shadow: none;
                }
                [data-theme="light"] .nb.nb--scrolled .alg-lockup__sub {
                    color: var(--t-4); -webkit-text-fill-color: var(--t-4);
                }
                [data-theme="light"] .nb.nb--scrolled .nb__theme {
                    border-color: var(--b-soft);
                    color: var(--t-2);
                    background: transparent;
                    box-shadow: none;
                }
                [data-theme="light"] .nb.nb--scrolled .nb__cta {
                    background: linear-gradient(135deg,var(--gold),var(--gold-light));
                    color: #1a1205 !important;
                    border: none;
                    box-shadow: var(--sh-gold);
                }
                [data-theme="light"] .nb.nb--scrolled .nb__burger {
                    border-color: var(--b-soft);
                    background: transparent;
                    box-shadow: none;
                }
                [data-theme="light"] .nb.nb--scrolled .nb__burger svg {
                    color: var(--t-1) !important;
                    filter: none;
                }

                /* ── Controls ── */
                .nb__ctl {
                    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
                }
                .nb__theme {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: transparent; border: 1px solid var(--b-soft);
                    color: var(--t-2); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all .3s;
                }
                .nb__theme:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-glow); }
                .nb__cta {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 9px 22px;
                    background: linear-gradient(135deg,var(--gold),var(--gold-light));
                    color: #1a1610; border: none; border-radius: 2px;
                    font-family: var(--f-mono); font-size: 11px; font-weight: 500;
                    letter-spacing: .12em; text-transform: uppercase;
                    text-decoration: none; transition: all .3s;
                    box-shadow: var(--sh-gold);
                }
                .nb__cta:hover { transform: translateY(-2px); box-shadow: var(--sh-gold-lg); }
                .nb__cta svg { transition: transform .25s var(--ease); }
                .nb__cta:hover svg { transform: translate(2px,-2px); }

                /* ── Burger ── */
                .nb__burger {
                    display: none; align-items: center; justify-content: center;
                    width: 40px; height: 40px;
                    background: transparent; border: 1px solid var(--b-soft);
                    border-radius: 2px; cursor: pointer;
                    transition: border-color .2s, background .2s;
                }
                .nb__burger:hover { border-color: var(--gold); background: var(--gold-glow); }

                /* ── Backdrop ── */
                .nb-bk {
                    position: fixed; inset:0;
                    background: rgba(0,0,0,.6); backdrop-filter: blur(4px);
                    z-index: 998; opacity:0; pointer-events:none;
                    transition: opacity .4s var(--ease-soft);
                }
                .nb-bk.show { opacity:1; pointer-events:all; }

                /* ── Drawer ── */
                .nb-drawer {
                    position: fixed; top:0; right:0; bottom:0;
                    width: min(340px,88vw);
                    background: var(--bg-card); border-left: 1px solid var(--b-soft);
                    z-index: 999;
                    display: flex; flex-direction: column;
                    transform: translateX(100%);
                    transition: transform .45s var(--ease);
                    box-shadow: -20px 0 80px rgba(0,0,0,.45);
                    overflow: hidden;
                }
                .nb-drawer::before {
                    content:''; position:absolute; top:0; left:0; bottom:0; width:2px;
                    background: linear-gradient(180deg,var(--gold),transparent 65%);
                    opacity:.55;
                }
                .nb-drawer.open { transform: translateX(0); }
                .nb-drawer__head {
                    display:flex; align-items:center; justify-content:space-between;
                    padding: 18px 20px; border-bottom: 1px solid var(--b-faint);
                }
                .nb-drawer__nav { flex:1; overflow-y:auto; padding: 10px 0; }
                .nb-drawer__link {
                    display:flex; align-items:center; gap:13px;
                    padding: 14px 20px; font-size:15px; font-weight:500;
                    color: var(--t-2); text-decoration:none;
                    border-left: 2px solid transparent;
                    transition: all .25s var(--ease);
                }
                .nb-drawer__link:hover { background:var(--gold-glow); color:var(--t-1); padding-left:26px; }
                .nb-drawer__link.active { color:var(--gold); border-left-color:var(--gold); background:var(--gold-glow); }
                .nb-drawer__num {
                    font-family:var(--f-mono); font-size:10px; letter-spacing:.1em;
                    color:var(--t-4); flex-shrink:0; transition:color .25s;
                }
                .nb-drawer__link.active .nb-drawer__num { color:var(--gold); opacity:.7; }
                .nb-drawer__arr {
                    margin-left:auto; opacity:0; transform:translateX(-5px);
                    transition:all .25s var(--ease); color:var(--gold); flex-shrink:0;
                }
                .nb-drawer__link:hover .nb-drawer__arr,
                .nb-drawer__link.active .nb-drawer__arr { opacity:1; transform:translateX(0); }
                .nb-drawer__foot {
                    padding: 16px 20px; border-top: 1px solid var(--b-faint);
                    display:flex; flex-direction:column; gap:12px;
                }
                .nb-drawer__theme-row {
                    display:flex; align-items:center; justify-content:space-between;
                    font-size:11px; color:var(--t-3);
                    font-family:var(--f-mono); letter-spacing:.06em; text-transform:uppercase;
                }

                /* ── Responsive ── */
                @media (max-width:1100px){ .nb__nav { gap:20px; } .nb-link { font-size:12px; } }
                @media (max-width:900px){
                    .nb__nav    { display:none; }
                    .nb__burger { display:flex; }
                    .nb__inner  { padding:12px 24px; }
                    .nb--scrolled .nb__inner { padding:9px 24px; }
                }
                @media (max-width:480px){
                    .nb__inner { padding:10px 16px; }
                    .nb__cta   { display:none; }
                    .alg-lockup__name { font-size:15px; letter-spacing:.18em; }
                    .alg-lockup svg { width:30px; height:30px; }
                }
            `}</style>
        </>
    );
}
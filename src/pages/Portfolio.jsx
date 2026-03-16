import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedProjects, fetchPortfolioCategories } from "../redux/portfolioSlice";
import {
    ArrowRight, ExternalLink, X, Check, ChevronRight, Layers,
    Filter, Star, Lightbulb, AlertCircle, Award, Zap
} from "lucide-react";
import SEO from "../components/Seo";

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        v.addEventListener("loadeddata", onLoad);
        v.addEventListener("error", () => setIsLoaded(true));
        return () => v.removeEventListener("loadeddata", onLoad);
    }, []);
    return (
        <div className="hero-video-wrap" aria-hidden>
            <div className="hero-video__poster" style={{
                backgroundImage: "url(/hero-poster.jpg)", backgroundSize: "cover",
                backgroundPosition: "center", position: "absolute", inset: 0, zIndex: 1
            }} />
            <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline
                preload="auto" poster="/hero-poster.jpg"
                style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.8s ease-in-out" }}>
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div style={{
                background: "linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.55) 100%)",
                position: "absolute", inset: 0, zIndex: 2
            }} />
            <div style={{
                background: "linear-gradient(to top,rgba(10,10,10,0.85) 0%,transparent 40%)",
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", zIndex: 4
            }} />
        </div>
    );
}

function ProjectVisualBg({ imageUrl, gradientA, gradientB, dimOverlay = false }) {
    if (imageUrl) {
        return (
            <>
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover", backgroundPosition: "center"
                }} />
                {dimOverlay && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                )}
            </>
        );
    }
    return (
        <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${gradientA || "#111"}, ${gradientB || "#222"})`
        }} />
    );
}

function ProjectModal({ project, onClose }) {
    const [tab, setTab] = useState("overview");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (project) {
            document.body.style.overflow = "hidden";
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [project]);

    // Proje değişince tab'ı geçerli ilk içeriğe sıfırla
    useEffect(() => {
        if (!project) return;
        const hasProblemSolution = !!(project.problemStatement || project.solutionStatement);
        const hasTechStack = project.techStack?.length > 0;
        const hasOverview = hasProblemSolution || hasTechStack;
        const hasFeatures = project.features?.length > 0;
        const hasResults = project.results?.length > 0;
        const first = hasOverview ? "overview"
            : hasFeatures ? "features"
                : hasResults ? "results"
                    : "overview";
        setTab(first);
    }, [project?.id]);

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!project) return null;

    const accent = project.accentColor || "var(--gold)";
    const hasImage = !!project.imageUrl;

    // İçerik varlık kontrolleri
    const hasProblemSolution = !!(project.problemStatement || project.solutionStatement);
    const hasTechStack = project.techStack?.length > 0;
    const hasOverviewContent = hasProblemSolution || hasTechStack;
    const hasFeatures = project.features?.length > 0;
    const hasResults = project.results?.length > 0;

    // Sadece içeriği olan tab'ları göster
    const visibleTabs = [
        hasOverviewContent && { key: "overview", label: "Genel Bakış" },
        hasFeatures && { key: "features", label: "Özellikler" },
        hasResults && { key: "results", label: "Kazanımlar" },
    ].filter(Boolean);

    // Aktif tab geçersizse ilk geçerli tab'a düş
    const activeTab = visibleTabs.find(t => t.key === tab) ? tab : visibleTabs[0]?.key ?? "overview";

    return (
        <>
            <SEO
                title="Web Tasarım Referansları & Portfolyo — Gerçek Projeler | Algorixa"
                description="İstanbul'da tamamlanan web tasarım ve yazılım projeleri: sanayi B2B kataloğu, restoran sitesi, kişisel portfolyo, inşaat kurumsal sitesi ve özel yazılım. Her proje somut iş sonuçlarıyla teslim edildi. Projeleri inceleyin."
                keywords="web tasarım referansları istanbul, web sitesi örnekleri, kurumsal web sitesi örnekleri, portfolyo web tasarım, başarılı web projeleri istanbul, sanayi firması web sitesi örneği, restoran web sitesi tasarımı, inşaat firması web sitesi, b2b katalog web sitesi, admin panelli web sitesi örneği, özel yazılım projesi, servis yönetim sistemi, react web projesi istanbul"
                url="https://www.algorixa.com.tr/referanslar"
                canonical="https://www.algorixa.com.tr/referanslar"
            />
            <style>{`
                .prt-modal-backdrop {
                    position: fixed; inset: 0; z-index: 1000;
                    background: rgba(0,0,0,0.88); backdrop-filter: blur(10px);
                    display: flex; align-items: flex-end;
                    animation: prtFadeIn 0.25s ease;
                }
                @media (min-width: 768px) {
                    .prt-modal-backdrop { align-items: center; justify-content: center; padding: 24px; }
                }
                @keyframes prtFadeIn { from { opacity: 0; } to { opacity: 1; } }
                .prt-modal-sheet {
                    background: #0e0e0e; border: 1px solid rgba(255,255,255,0.08);
                    width: 100%; max-height: 92vh; border-radius: 24px 24px 0 0;
                    overflow: hidden; display: flex; flex-direction: column;
                    animation: prtSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); position: relative;
                }
                @media (min-width: 768px) {
                    .prt-modal-sheet {
                        max-width: 820px; max-height: 90vh; border-radius: 24px;
                        animation: prtScaleIn 0.25s cubic-bezier(0.34,1.1,0.64,1);
                    }
                }
                @keyframes prtSlideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes prtScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .prt-modal-handle {
                    width: 40px; height: 4px; border-radius: 4px;
                    background: rgba(255,255,255,0.2); margin: 12px auto 0; flex-shrink: 0;
                }
                @media (min-width: 768px) { .prt-modal-handle { display: none; } }
                .prt-modal-close {
                    position: absolute; top: 14px; right: 14px; z-index: 20;
                    width: 34px; height: 34px; border-radius: 50%;
                    background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.85);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s;
                }
                .prt-modal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

                .prt-modal-hero {
                    flex-shrink: 0; display: grid;
                    grid-template-columns: 220px 1fr;
                    min-height: 220px;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                }
                 @media (max-width: 600px) {
    .prt-modal-hero { grid-template-columns: 1fr !important; }
    .prt-modal-hero__visual { display: none !important; }
}
                .prt-modal-hero__visual--gradient { aspect-ratio: unset; min-height: 180px; }
                @media (max-width: 600px) {
                    .prt-modal-hero__visual { aspect-ratio: 1 / 1; align-self: auto; }
                    .prt-modal-hero__visual--gradient { aspect-ratio: 3 / 1; min-height: unset; }
                }
                .prt-modal-hero__visual-overlay {
                    position: absolute; inset: 0; z-index: 2;
                    background: linear-gradient(to right, rgba(14,14,14,0) 70%, rgba(14,14,14,0.5) 100%);
                }
                @media (max-width: 600px) {
                    .prt-modal-hero__visual-overlay {
                        background: linear-gradient(to bottom, rgba(14,14,14,0) 60%, rgba(14,14,14,0.7) 100%);
                    }
                }
                .prt-modal-hero__badge {
                    position: absolute; top: 12px; left: 12px; z-index: 5;
                    display: flex; align-items: center; gap: 5px;
                    padding: 4px 10px; border-radius: 100px;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
                    background: rgba(200,168,75,0.18); border: 1px solid rgba(200,168,75,0.45);
                    color: var(--gold);
                }
                .prt-modal-hero__info {
                    padding: 28px 40px 24px 28px;
                    display: flex; flex-direction: column; justify-content: center;
                    background: rgba(255,255,255,0.01);
                }
                @media (max-width: 600px) { .prt-modal-hero__info { padding: 20px; } }

                .prt-modal-tags { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 10px; }
                .prt-modal-tag {
                    padding: 3px 10px; border-radius: 100px;
                    font-size: 10px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.08em; border: 1px solid currentColor; opacity: 0.75;
                }
                .prt-modal-title {
                    font-size: clamp(16px, 2.8vw, 22px); font-weight: 800;
                    line-height: 1.2; color: #fff; margin-bottom: 8px;
                    font-family: var(--f-display, serif);
                }
                .prt-modal-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; }
                .prt-modal-impacts {
                    display: flex; margin-top: 18px; border-radius: 11px;
                    overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
                }
                .prt-modal-impact {
                    flex: 1; padding: 10px 12px; text-align: center;
                    border-right: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.025);
                }
                .prt-modal-impact:last-child { border-right: none; }
                .prt-modal-impact__val { font-size: 13px; font-weight: 800; line-height: 1.2; margin-bottom: 3px; }
                .prt-modal-impact__sub { font-size: 10px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.06em; }

                .prt-modal-tabs {
                    display: flex; padding: 0 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    flex-shrink: 0; overflow-x: auto; scrollbar-width: none; background: #0e0e0e;
                }
                .prt-modal-tabs::-webkit-scrollbar { display: none; }
                @media (min-width: 768px) { .prt-modal-tabs { padding: 0 32px; } }
                .prt-modal-tab {
                    padding: 13px 16px; font-size: 13px; font-weight: 600;
                    color: rgba(255,255,255,0.4); border: none; background: none;
                    cursor: pointer; white-space: nowrap;
                    border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s;
                }
                .prt-modal-tab.active { color: #fff; border-bottom-color: var(--modal-accent, var(--gold)); }
                .prt-modal-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

                .prt-modal-body {
                    flex: 1; overflow-y: auto; padding: 24px;
                    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
                }
                @media (min-width: 768px) { .prt-modal-body { padding: 28px 32px; } }

                .prt-ps-grid { display: grid; gap: 12px; margin-bottom: 24px; }
                @media (min-width: 500px) { .prt-ps-grid { grid-template-columns: 1fr 1fr; } }
                .prt-ps-card { padding: 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); }
                .prt-ps-card--problem { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.15); }
                .prt-ps-card--solution { background: rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.15); }
                .prt-ps-header {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 10px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.1em; margin-bottom: 8px;
                }
                .prt-ps-card--problem .prt-ps-header { color: #f87171; }
                .prt-ps-card--solution .prt-ps-header { color: #34d399; }
                .prt-ps-card p { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.6); margin: 0; }

                .prt-section-title {
                    font-size: 10px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.1em; color: rgba(255,255,255,0.35);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
                }
                .prt-feat-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
                    gap: 8px; margin-bottom: 28px;
                }
                .prt-feat-item {
                    padding: 11px 13px; border-radius: 10px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
                    font-size: 13px; color: rgba(255,255,255,0.7);
                    display: flex; align-items: center; gap: 10px;
                }
                .prt-feat-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--modal-accent, var(--gold)); flex-shrink: 0;
                }
                .prt-results-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
                .prt-result-item {
                    display: flex; align-items: center; gap: 10px; padding: 10px 14px;
                    border-radius: 10px; background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    font-size: 13px; color: rgba(255,255,255,0.72);
                }
                .prt-tech-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
                .prt-tech-chip {
                    padding: 5px 13px; border-radius: 100px;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500;
                }

                .prt-modal-footer {
                    padding: 14px 24px 24px; border-top: 1px solid rgba(255,255,255,0.07);
                    display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap; background: #0e0e0e;
                }
                @media (min-width: 768px) { .prt-modal-footer { padding: 16px 32px 24px; } }
                .prt-modal-cta {
                    flex: 1; min-width: 130px; padding: 13px 18px; border-radius: 12px;
                    font-size: 13px; font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    gap: 8px; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none;
                }
                .prt-modal-cta--primary { background: linear-gradient(135deg, var(--gold), #a8832a); color: #000; }
                .prt-modal-cta--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(200,168,75,0.25); }
                .prt-modal-cta--outline {
                    background: transparent; border: 1.5px solid rgba(255,255,255,0.15) !important;
                    color: rgba(255,255,255,0.65);
                }
                .prt-modal-cta--outline:hover { border-color: rgba(255,255,255,0.3) !important; color: #fff; }
                .prt-modal-cta--live {
                    background: rgba(16,185,129,0.1);
                    border: 1.5px solid rgba(16,185,129,0.3) !important; color: #34d399;
                }
            `}</style>

            <div className="prt-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
                <div className="prt-modal-sheet" style={{ "--modal-accent": accent }}>
                    <div className="prt-modal-handle" />
                    <button className="prt-modal-close" onClick={onClose}>
                        <X size={14} strokeWidth={2} />
                    </button>

                    {/* Hero: sol görsel + sağ bilgi */}
                    <div className="prt-modal-hero">
                        <div className={`prt-modal-hero__visual${!hasImage ? " prt-modal-hero__visual--gradient" : ""}`}>
                            <ProjectVisualBg
                                imageUrl={project.imageUrl}
                                gradientA={project.backgroundGradientA}
                                gradientB={project.backgroundGradientB}
                                dimOverlay={hasImage}
                            />
                            {!hasImage && (
                                <div style={{
                                    position: "absolute", inset: 0, zIndex: 1,
                                    backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                                    backgroundSize: "28px 28px", opacity: 0.4
                                }} />
                            )}
                            <div className="prt-modal-hero__visual-overlay" />
                            {project.isFeatured && (
                                <div className="prt-modal-hero__badge">
                                    <Star size={9} strokeWidth={2.5} /> Öne Çıkan
                                </div>
                            )}
                        </div>

                        <div className="prt-modal-hero__info">
                            <div className="prt-modal-tags">
                                {project.category && (
                                    <span className="prt-modal-tag"
                                        style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.2)" }}>
                                        {project.category}
                                    </span>
                                )}
                                {project.projectType && (
                                    <span className="prt-modal-tag"
                                        style={{ color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.12)" }}>
                                        {project.projectType}
                                    </span>
                                )}
                            </div>
                            <h2 className="prt-modal-title">{project.title}</h2>
                            {project.description && (
                                <p className="prt-modal-desc">{project.description}</p>
                            )}
                            {/* Impact bar — sadece results varsa göster */}
                            {hasResults && (
                                <div className="prt-modal-impacts">
                                    {project.results.slice(0, 3).map((r, i) => {
                                        const parts = r.resultText.split(" ");
                                        return (
                                            <div key={i} className="prt-modal-impact">
                                                <div className="prt-modal-impact__val" style={{ color: accent }}>
                                                    {parts[0]}
                                                </div>
                                                <div className="prt-modal-impact__sub">
                                                    {parts.slice(1).join(" ")}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs — sadece içeriği olanlar */}
                    {visibleTabs.length > 0 && (
                        <div className="prt-modal-tabs">
                            {visibleTabs.map(t => (
                                <button key={t.key}
                                    className={`prt-modal-tab ${activeTab === t.key ? "active" : ""}`}
                                    onClick={() => setTab(t.key)}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Body */}
                    <div className="prt-modal-body" ref={scrollRef}>

                        {/* Genel Bakış */}
                        {activeTab === "overview" && (
                            <>
                                {/* Sorun/Çözüm — ikisi de boşsa hiç gösterme */}
                                {hasProblemSolution && (
                                    <div className="prt-ps-grid">
                                        {project.problemStatement && (
                                            <div className="prt-ps-card prt-ps-card--problem">
                                                <div className="prt-ps-header">
                                                    <AlertCircle size={12} strokeWidth={2} /> Sorun
                                                </div>
                                                <p>{project.problemStatement}</p>
                                            </div>
                                        )}
                                        {project.solutionStatement && (
                                            <div className="prt-ps-card prt-ps-card--solution">
                                                <div className="prt-ps-header">
                                                    <Lightbulb size={12} strokeWidth={2} /> Çözüm
                                                </div>
                                                <p>{project.solutionStatement}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Teknoloji stack — boşsa hiç gösterme */}
                                {hasTechStack && (
                                    <>
                                        <div className="prt-section-title">
                                            <Zap size={11} strokeWidth={2} /> Teknoloji Stack
                                        </div>
                                        <div className="prt-tech-wrap">
                                            {project.techStack.map((s, i) => (
                                                <span key={i} className="prt-tech-chip">{s.technology}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Özellikler — boşsa hiç gösterme */}
                        {activeTab === "features" && hasFeatures && (
                            <>
                                <div className="prt-section-title">
                                    <Layers size={11} strokeWidth={2} /> Özellikler & İşlevler
                                </div>
                                <div className="prt-feat-grid">
                                    {project.features.map((f, i) => (
                                        <div key={i} className="prt-feat-item">
                                            <div className="prt-feat-dot" />
                                            {f.featureText}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Kazanımlar — boşsa hiç gösterme */}
                        {activeTab === "results" && hasResults && (
                            <>
                                <div className="prt-section-title">
                                    <Award size={11} strokeWidth={2} /> Kazanımlar
                                </div>
                                <div className="prt-results-list">
                                    {project.results.map((r, i) => (
                                        <div key={i} className="prt-result-item">
                                            <Check size={14} strokeWidth={2.5} style={{ color: accent, flexShrink: 0 }} />
                                            {r.resultText}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="prt-modal-footer">
                        <Link to="/iletisim" className="prt-modal-cta prt-modal-cta--primary" onClick={onClose}>
                            Benzer Proje İstiyorum <ArrowRight size={14} strokeWidth={2} />
                        </Link>
                        {project.liveUrl && project.liveUrl.trim() !== "" && project.liveUrl !== "#" && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer"
                                className="prt-modal-cta prt-modal-cta--live">
                                <ExternalLink size={14} strokeWidth={2} /> Canlı Demo
                            </a>
                        )}
                        <button className="prt-modal-cta prt-modal-cta--outline" onClick={onClose}>
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProjectCard({ project, onClick, index }) {
    const accent = project.accentColor || "var(--gold)";
    const hasImage = !!project.imageUrl;
    return (
        <div className="prt-card" onClick={onClick} style={{ animationDelay: `${index * 60}ms` }}>
            <div className="prt-card__visual"
                style={!hasImage ? {
                    background: `linear-gradient(135deg,${project.backgroundGradientA || "#111"},${project.backgroundGradientB || "#222"})`
                } : {}}>
                <ProjectVisualBg
                    imageUrl={project.imageUrl}
                    gradientA={project.backgroundGradientA}
                    gradientB={project.backgroundGradientB}
                    dimOverlay={hasImage}
                />
                {!hasImage && <div className="prt-card__visual-grid" />}
                {project.isFeatured && (
                    <div className="prt-card__tag-badge"
                        style={{ color: "var(--gold)", borderColor: "var(--gold)", background: "rgba(200,168,75,0.12)", position: "relative", zIndex: 2 }}>
                        ⭐ Öne Çıkan
                    </div>
                )}
                <div className="prt-card__hover-overlay" style={{ zIndex: 3 }}>
                    <span className="prt-card__hover-icon" style={{ background: accent }}>
                        <ChevronRight size={18} strokeWidth={2.5} style={{ color: "#000" }} />
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>İncele</span>
                </div>
            </div>
            <div className="prt-card__body">
                <div className="prt-card__cat">
                    <span className="t-label" style={{ fontSize: "9px", letterSpacing: "0.12em" }}>{project.category}</span>
                    <span style={{ fontSize: "9px", color: "var(--t-4)", margin: "0 6px" }}>·</span>
                    <span style={{ fontSize: "9px", color: "var(--t-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{project.projectType}</span>
                </div>
                <h3 className="prt-card__title">{project.title}</h3>
                <p className="prt-card__desc">{project.description}</p>
                <div className="prt-card__hint" style={{ color: accent }}>
                    Detayları Gör <ChevronRight size={11} strokeWidth={2.5} style={{ display: "inline" }} />
                </div>
            </div>
        </div>
    );
}

export default function Portfolio() {
    const dispatch = useDispatch();
    const { projects, categories: backendCategories, loading } = useSelector(s => s.portfolio);
    const [cat, setCat] = useState("Tümü");
    const [modal, setModal] = useState(null);

    useEffect(() => {
        dispatch(fetchPublishedProjects());
        dispatch(fetchPortfolioCategories());
    }, [dispatch]);

    const sorted = [...(projects || [])].sort((a, b) => {
        if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1;
        return (b.displayOrder ?? b.id ?? 0) - (a.displayOrder ?? a.id ?? 0);
    });

    const allCats = ["Tümü", ...new Set((backendCategories || []).filter(c => c !== "Tümü"))];
    const filtered = cat === "Tümü" ? sorted : sorted.filter(p => p.category === cat);

    return (
        <>
            <style>{`
                .prt-filters {
                    display: flex; align-items: center; gap: 8px;
                    flex-wrap: wrap; margin-bottom: 48px;
                }
                .prt-filters__label {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 11px; color: var(--t-4); font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.08em; margin-right: 4px;
                }
                .prt-filter-btn {
                    padding: 7px 16px; border-radius: 100px;
                    border: 1.5px solid rgba(255,255,255,0.1);
                    background: transparent; color: var(--t-3);
                    font-size: 12px; font-weight: 600; cursor: pointer;
                    display: flex; align-items: center; gap: 6px; transition: all 0.2s;
                }
                .prt-filter-btn:hover { border-color: rgba(200,168,75,0.4); color: var(--gold); }
                .prt-filter-btn.active {
                    background: rgba(200,168,75,0.12);
                    border-color: rgba(200,168,75,0.5); color: var(--gold);
                }
                .prt-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                @media (max-width: 600px) { .prt-grid { grid-template-columns: 1fr; } }
                .prt-card {
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; overflow: hidden;
                    cursor: pointer; transition: all 0.25s;
                    animation: prtFadeUp 0.4s ease both;
                    background: rgba(255,255,255,0.01);
                }
                .prt-card:hover {
                    border-color: rgba(255,255,255,0.15);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.3);
                }
                @keyframes prtFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .prt-card__visual {
                    aspect-ratio: 1 / 1; width: 100%;
                    position: relative; overflow: hidden;
                }
                .prt-card__visual-grid {
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 24px 24px; opacity: 0.35;
                }
                .prt-card__tag-badge {
                    position: absolute; top: 12px; left: 12px;
                    padding: 4px 10px; border-radius: 100px;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.05em; border: 1px solid;
                }
                .prt-card__hover-overlay {
                    position: absolute; inset: 0;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 8px;
                    background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.25s;
                }
                .prt-card:hover .prt-card__hover-overlay { opacity: 1; }
                .prt-card__hover-icon {
                    width: 40px; height: 40px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                }
                .prt-card__body { padding: 18px 20px 20px; }
                .prt-card__cat { display: flex; align-items: center; margin-bottom: 8px; }
                .prt-card__title {
                    font-size: 16px; font-weight: 700; color: var(--t-1);
                    line-height: 1.3; margin-bottom: 8px; font-family: var(--f-display, serif);
                }
                .prt-card__desc {
                    font-size: 13px; color: var(--t-4); line-height: 1.6; margin-bottom: 12px;
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }
                .prt-card__hint { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
            `}</style>

            <section className="page-hero">
                <VideoHero />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">Referanslarımız</span></div>
                    <h1 className="page-hero__title">Ölçülebilir <em>Sonuçlar</em>Üreten Projeler</h1>
                    <p className="page-hero__desc">
                        Her proje somut büyüme hedefleriyle başlar, ölçülebilir başarıyla tamamlanır.
                        Projeye tıklayarak detayları inceleyin.
                    </p>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">
                    <div className="prt-filters">
                        <div className="prt-filters__label">
                            <Filter size={12} strokeWidth={1.5} /> Filtre
                        </div>
                        {allCats.map(c => (
                            <button key={c}
                                className={`prt-filter-btn${cat === c ? " active" : ""}`}
                                onClick={() => setCat(c)}>
                                {cat === c && <Star size={10} strokeWidth={2} />}
                                {c}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div style={{ textAlign: "center", padding: "80px 0" }}>
                            <div style={{
                                width: "36px", height: "36px", margin: "0 auto",
                                border: "3px solid rgba(255,255,255,0.1)",
                                borderTop: "3px solid rgba(200,168,75,0.8)",
                                borderRadius: "50%", animation: "spin 1s linear infinite"
                            }} />
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--t-4)" }}>
                            <p style={{ fontSize: "16px" }}>Bu kategoride proje bulunamadı.</p>
                        </div>
                    )}

                    {!loading && filtered.length > 0 && (
                        <div className="prt-grid">
                            {filtered.map((p, i) => (
                                <ProjectCard key={p.id} project={p} index={i} onClick={() => setModal(p)} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="page-section page-section--alt page-section--sm section-border-top"
                style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 className="t-heading" style={{ marginBottom: "16px" }}>
                        Sıradaki Başarı Hikayesi Sizin Olsun
                    </h2>
                    <p style={{ color: "var(--t-2)", maxWidth: "460px", margin: "0 auto 36px" }}>
                        Projenizi analiz edip somut büyüme hedefleriyle teklif hazırlayalım.
                    </p>
                    <Link to="/iletisim" className="btn btn--primary btn--lg">Teklif Al →</Link>
                </div>
            </section>

            <ProjectModal project={modal} onClose={() => setModal(null)} />
        </>
    );
}
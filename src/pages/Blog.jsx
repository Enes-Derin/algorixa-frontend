import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPublishedPosts,
    fetchPostBySlug,
    fetchCategories,
    incrementViewCount
} from "../redux/blogSlice";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag, Sparkles, ExternalLink } from "lucide-react";
import SEO from "../components/Seo";

const DEFAULT_POSTS = [
    {
        id: 'default-1',
        slug: 'web-sitesi-performans-optimizasyonu',
        title: 'Web Sitesi Performans Optimizasyonu: 3 Saniyeden 1 Saniyeye',
        excerpt: 'Yavaş web sitesi müşteri kaybeder. Lighthouse 90+ skor için yapılması gerekenler.',
        content: `<h2>Görsel Optimizasyonu</h2><p>WebP formatı kullanın, lazy loading uygulayın ve responsive görseller sunun.</p><h2>JavaScript Optimizasyonu</h2><p>Code splitting uygulayın, gereksiz kütüphaneleri kaldırın.</p><h2>Sonuç</h2><p>Bu adımları uygulayarak Lighthouse skorunuzu 90+ seviyesine çıkarabilirsiniz.</p>`,
        category: 'Teknik',
        author: 'Algorixa',
        readTime: '5 dk okuma',
        publishedDate: new Date().toISOString(),
        viewCount: 0,
        isFeatured: true,
        imageUrl: null
    },
    {
        id: 'default-2',
        slug: 'seo-stratejisi-2025',
        title: 'SEO Stratejisi 2025: Google İlk Sayfada Olmak',
        excerpt: 'Organik trafiği artırmak için yapmanız gereken 7 adım.',
        content: '<p>SEO artık sadece anahtar kelime optimizasyonu değil...</p>',
        category: 'SEO',
        author: 'Algorixa',
        readTime: '7 dk okuma',
        publishedDate: new Date().toISOString(),
        viewCount: 0,
        isFeatured: false,
        imageUrl: null
    }
];

const DEFAULT_CATEGORIES = ["Rehber", "Strateji", "Teknik", "SEO", "Tasarım"];

const CAT_COLORS = {
    "Rehber": { bg: "rgba(59,130,246,.15)", border: "rgba(59,130,246,.35)", text: "#60a5fa", glow: "rgba(59,130,246,.25)" },
    "Strateji": { bg: "rgba(168,85,247,.15)", border: "rgba(168,85,247,.35)", text: "#c084fc", glow: "rgba(168,85,247,.25)" },
    "Teknik": { bg: "rgba(52,211,153,.15)", border: "rgba(52,211,153,.35)", text: "#34d399", glow: "rgba(52,211,153,.25)" },
    "SEO": { bg: "rgba(248,113,113,.15)", border: "rgba(248,113,113,.35)", text: "#f87171", glow: "rgba(248,113,113,.25)" },
    "Tasarım": { bg: "rgba(251,191,36,.15)", border: "rgba(251,191,36,.35)", text: "#fbbf24", glow: "rgba(251,191,36,.25)" },
};

const DEFAULT_CAT = { bg: "rgba(100,116,139,.15)", border: "rgba(100,116,139,.35)", text: "#94a3b8", glow: "rgba(100,116,139,.2)" };

function getCat(category) {
    return CAT_COLORS[category] ?? DEFAULT_CAT;
}

function VideoHero() {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleLoad = () => { setIsLoaded(true); v.playbackRate = 0.75; };
        const handleError = () => setHasError(true);
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
                background: 'linear-gradient(110deg, rgba(6,10,20,.85) 0%, rgba(6,10,20,.5) 55%, rgba(6,10,20,.72) 100%)',
                position: 'absolute', inset: 0, zIndex: 2
            }} />
            <div className="hero-video__grain" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                opacity: 0.03, position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none'
            }} />
            <div className="hero-video__fade-bottom" style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 40%)',
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 4
            }} />
        </div>
    );
}

function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const fn = () => {
            const el = document.documentElement;
            const scrollTop = el.scrollTop || document.body.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
            background: 'var(--b-faint)', zIndex: 9999, pointerEvents: 'none'
        }}>
            <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                transition: 'width .1s linear'
            }} />
        </div>
    );
}

function CardCover({ imageUrl, category, size = "card" }) {
    const c = getCat(category);
    if (imageUrl) {
        return (
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
            }} />
        );
    }
    return (
        <>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%)'
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 70% 70% at 40% 50%, ${c.glow} 0%, transparent 70%)`
            }} />
            <BookOpen
                size={size === "featured" ? 44 : size === "post" ? 72 : 32}
                strokeWidth={size === "post" ? 0.5 : 0.7}
                style={{ color: c.text, opacity: .25, position: 'relative', zIndex: 1 }}
            />
        </>
    );
}

/* ─── Blog Listesi ─── */
function BlogList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { posts: backendPosts, categories: backendCategories, loading } = useSelector(s => s.blog);

    const posts = backendPosts.length > 0 ? backendPosts : DEFAULT_POSTS;
    const categories = backendCategories.length > 0 ? backendCategories : DEFAULT_CATEGORIES;

    const [cat, setCat] = useState("Tümü");

    useEffect(() => {
        dispatch(fetchPublishedPosts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const CATS = ["Tümü", ...categories];
    const filtered = cat === "Tümü" ? posts : posts.filter(p => p.category === cat);
    const featured = filtered.find(p => p.isFeatured) || filtered[0];
    const rest = filtered.filter(p => p !== featured);

    if (loading) {
        return (
            <div className="page">
                <div className="container text-center" style={{ padding: "100px 0" }}>
                    <div className="spinner-border" role="status" />
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Web Tasarım, SEO & Dijital Büyüme Blogu | Algorixa"
                description="Web sitesi performansı, SEO stratejisi, Google sıralamaları ve dijital büyüme üzerine uygulanabilir rehberler."
                keywords="web tasarım blogu, seo rehberi türkçe, web sitesi hız optimizasyonu"
                url="https://www.algorixa.com.tr/blog"
                canonical="https://www.algorixa.com.tr/blog"
            />

            <style>{`
                /* ── Blog List Styles ── */
                .blg-cats {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 40px;
                }
                .blg-cat-btn {
                    padding: 7px 18px;
                    border-radius: 2px;
                    font-family: var(--f-mono);
                    font-size: 10px;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    cursor: pointer;
                    border: 1px solid var(--b-faint);
                    background: transparent;
                    color: var(--t-3);
                    transition: all .2s;
                }
                .blg-cat-btn:hover {
                    border-color: var(--b-mid);
                    color: var(--t-1);
                    background: var(--bg-2);
                }
                .blg-cat-btn.active {
                    background: var(--gold-glow2);
                    border-color: var(--gold);
                    color: var(--gold);
                }

                /* ── Featured Card ── */
                .blg-featured {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    border: 1px solid var(--b-faint);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 36px;
                    cursor: pointer;
                    transition: border-color .3s, box-shadow .3s, transform .3s;
                    background: var(--bg-card);
                }
                .blg-featured:hover {
                    border-color: var(--b-mid);
                    box-shadow: var(--sh-gold);
                    transform: translateY(-3px);
                }
                .blg-featured__img {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    aspect-ratio: 4/3;
                }
                .blg-featured__img::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,.2);
                    transition: background .3s;
                }
                .blg-featured:hover .blg-featured__img::after {
                    background: rgba(0,0,0,.1);
                }
                .blg-featured__body {
                    padding: 32px 36px 32px 236px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 12px;
                }
                .blg-featured__eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-family: var(--f-mono);
                    font-size: 10px;
                    letter-spacing: .16em;
                    text-transform: uppercase;
                    color: var(--gold);
                }
                .blg-featured__cat-badge {
                    position: absolute;
                    bottom: 14px;
                    left: 14px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 11px;
                    border-radius: 2px;
                    font-family: var(--f-mono);
                    font-size: 9px;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                    background: var(--c, rgba(200,168,75,.15));
                    border: 1px solid var(--c, rgba(200,168,75,.3));
                    color: var(--t-1);
                    z-index: 3;
                    backdrop-filter: blur(8px);
                }
                .blg-featured__title {
                    font-family: var(--f-display);
                    font-size: clamp(20px, 2.2vw, 28px);
                    font-weight: 500;
                    color: var(--t-1);
                    line-height: 1.3;
                    letter-spacing: -.01em;
                    margin: 0;
                }
                .blg-featured__excerpt {
                    color: var(--t-3);
                    font-size: 14px;
                    line-height: 1.7;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .blg-featured__meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: var(--t-4);
                    font-family: var(--f-mono);
                }
                .blg-featured__cta {
                    align-self: flex-start;
                    margin-top: 4px;
                }
                .blg-dot {
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: var(--t-4);
                    display: inline-block;
                }

                /* ── Grid ── */
                .blg-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                @media (max-width: 1024px) { .blg-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px)  { .blg-grid { grid-template-columns: 1fr; } }

                .blg-card {
                    background: var(--bg-card);
                    border: 1px solid var(--b-faint);
                    border-radius: 4px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    transition: border-color .3s, box-shadow .3s, transform .3s;
                }
                .blg-card:hover {
                    border-color: var(--b-mid);
                    box-shadow: var(--sh-md);
                    transform: translateY(-4px);
                }
                .blg-card__img {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    aspect-ratio: 16/9;
                }
                .blg-card__img::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,.18);
                    transition: background .3s;
                }
                .blg-card:hover .blg-card__img::after { background: rgba(0,0,0,.08); }
                .blg-card__cat-badge {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    padding: 3px 10px;
                    border-radius: 2px;
                    font-family: var(--f-mono);
                    font-size: 9px;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                    background: var(--c, rgba(200,168,75,.15));
                    border: 1px solid var(--c, rgba(200,168,75,.3));
                    color: var(--t-1);
                    z-index: 3;
                    backdrop-filter: blur(8px);
                }
                .blg-card__body {
                    padding: 20px 22px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 8px;
                }
                .blg-card__title {
                    font-family: var(--f-display);
                    font-size: 18px;
                    font-weight: 500;
                    color: var(--t-1);
                    margin: 0;
                    line-height: 1.35;
                    letter-spacing: -.01em;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .blg-card__excerpt {
                    color: var(--t-3);
                    font-size: 13px;
                    line-height: 1.65;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex: 1;
                }
                .blg-card__footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 10px;
                    border-top: 1px solid var(--b-faint);
                }
                .blg-card__meta {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-family: var(--f-mono);
                    font-size: 11px;
                    color: var(--t-4);
                }

                @media (max-width: 768px) {
                    .blg-featured { grid-template-columns: 1fr !important; }
                    .blg-featured__img { aspect-ratio: 16/7; }
                    .blg-featured__body { padding: 22px 20px; }
                }
            `}</style>

            <section className="page-hero">
                <VideoHero />
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    backgroundImage: 'linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)',
                    pointerEvents: 'none'
                }} />
                <div className="container">
                    <div className="page-hero__eyebrow"><span className="t-label">Blog</span></div>
                    <h1 className="page-hero__title">
                        Dijital Dünyadan<br /><em>Uzman Görüşleri</em>
                    </h1>
                    <p className="page-hero__desc">
                        SEO, web tasarım ve dijital pazarlama hakkında uygulanabilir içerikler.
                        Teorisiz, doğrudan işe yarayan bilgi.
                    </p>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">

                    {/* Kategori Filtreleri */}
                    <div className="blg-cats">
                        {CATS.map(c => (
                            <button
                                key={c}
                                className={`blg-cat-btn${cat === c ? " active" : ""}`}
                                onClick={() => setCat(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Featured */}
                    {featured && (() => {
                        const c = getCat(featured.category);
                        return (
                            <div className="blg-featured" onClick={() => navigate(`/blog/${featured.slug}`)}>
                                <div className="blg-featured__img">
                                    <CardCover imageUrl={featured.imageUrl} category={featured.category} size="featured" />
                                    <div className="blg-featured__cat-badge" style={{
                                        "--c": c.bg,
                                        color: c.text,
                                        borderColor: c.border
                                    }}>
                                        <Tag size={9} strokeWidth={2} />{featured.category}
                                    </div>
                                </div>
                                <div className="blg-featured__body">
                                    <div className="blg-featured__eyebrow">
                                        <Sparkles size={12} strokeWidth={1.5} />
                                        Öne Çıkan Yazı
                                    </div>
                                    <h2 className="blg-featured__title">{featured.title}</h2>
                                    <p className="blg-featured__excerpt">{featured.excerpt}</p>
                                    <div className="blg-featured__meta">
                                        <span>{featured.author}</span>
                                        <span className="blg-dot" />
                                        <Clock size={11} strokeWidth={1.5} />
                                        <span>{new Date(featured.publishedDate).toLocaleDateString('tr-TR')}</span>
                                        <span className="blg-dot" />
                                        <span>{featured.readTime}</span>
                                    </div>
                                    <span className="blg-featured__cta btn btn--outline btn--mono btn--sm">
                                        Oku <ArrowRight size={12} strokeWidth={2} style={{ display: "inline", marginLeft: 4 }} />
                                    </span>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Grid */}
                    {rest.length > 0 && (
                        <div className="blg-grid">
                            {rest.map(post => {
                                const c = getCat(post.category);
                                return (
                                    <Link key={post.id} to={`/blog/${post.slug}`} className="blg-card">
                                        <div className="blg-card__img">
                                            <CardCover imageUrl={post.imageUrl} category={post.category} size="card" />
                                            <div className="blg-card__cat-badge" style={{
                                                "--c": c.bg,
                                                color: c.text,
                                                borderColor: c.border
                                            }}>
                                                {post.category}
                                            </div>
                                        </div>
                                        <div className="blg-card__body">
                                            <h3 className="blg-card__title">{post.title}</h3>
                                            <p className="blg-card__excerpt">{post.excerpt}</p>
                                            <div className="blg-card__footer">
                                                <span className="blg-card__meta">
                                                    <Clock size={11} strokeWidth={1.5} />
                                                    {new Date(post.publishedDate).toLocaleDateString('tr-TR')} · {post.readTime}
                                                </span>
                                                <ArrowRight size={14} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

/* ─── Blog Post Detay ─── */
function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const catKeywords = {
        Teknik: "web sitesi teknik seo, lighthouse optimizasyonu, site hızı artırma",
        SEO: "seo stratejisi 2025, google sıralaması, organik trafik artırma",
        Rehber: "web sitesi kurma rehberi, kurumsal site nasıl yapılır",
        Strateji: "dijital büyüme stratejisi, web sitesi ile müşteri kazanma",
        Tasarım: "modern web tasarımı, ui ux tasarım ipuçları, mobil uyumlu tasarım",
    };

    const { currentPost, posts: backendPosts, loading } = useSelector(s => s.blog);
    const posts = backendPosts.length > 0 ? backendPosts : DEFAULT_POSTS;

    useEffect(() => {
        dispatch(fetchPostBySlug(slug));
    }, [slug, dispatch]);

    useEffect(() => {
        if (currentPost) dispatch(incrementViewCount(currentPost.id));
    }, [currentPost, dispatch]);

    const post = currentPost || posts.find(p => p.slug === slug);
    const related = posts.filter(p => p.slug !== slug).slice(0, 3);

    if (loading) {
        return (
            <div className="page">
                <div className="container text-center" style={{ padding: "100px 0" }}>
                    <div className="spinner-border" role="status" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{
                minHeight: "80vh", display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column", gap: "20px"
            }}>
                <div style={{ fontFamily: "var(--f-display)", fontSize: "80px", color: "var(--b-mid)" }}>404</div>
                <p style={{ color: "var(--t-3)" }}>Bu yazı bulunamadı.</p>
                <button className="btn btn--outline btn--sm" onClick={() => navigate("/blog")}>
                    <ArrowLeft size={14} strokeWidth={1.5} style={{ display: "inline", marginRight: 6 }} />
                    Blog'a Dön
                </button>
            </div>
        );
    }

    const c = getCat(post.category);

    return (
        <>
            <SEO
                title={`${post.title} | Algorixa Blog`}
                description={post.excerpt ? post.excerpt.slice(0, 155) : `${post.title} — Algorixa blog'unda web tasarım ve SEO üzerine uygulanabilir rehber.`}
                keywords={`${post.title.toLowerCase()}, ${post.category?.toLowerCase()}, ${catKeywords[post.category] ?? "web tasarım istanbul"}, algorixa blog`}
                url={`https://www.algorixa.com.tr/blog/${post.slug}`}
                canonical={`https://www.algorixa.com.tr/blog/${post.slug}`}
                ogImage={post.imageUrl || "https://www.algorixa.com.tr/og-image.jpg"}
                type="article"
            />

            <ReadingProgress />

            <style>{`
                /* ── Post Page Styles ── */
                .blog-post-page {
                    padding: 60px 0 80px;
                }
                .blg-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-family: var(--f-mono);
                    font-size: 11px;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                    color: var(--t-4);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 40px;
                    transition: color .2s;
                }
                .blg-back-btn:hover { color: var(--gold); }

                .blg-post-layout {
                    display: grid;
                    grid-template-columns: 420px 1fr;
                    gap: 56px;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .blg-post-layout {
                        grid-template-columns: 1fr;
                        gap: 28px;
                    }
                    .blg-post-cover-wrap {
                        position: relative !important;
                        top: unset !important;
                    }
                }

                .blg-post-cover-wrap {
                    aspect-ratio: 1 / 1;
                    border-radius: 6px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: sticky;
                    top: 90px;
                    border: 1px solid var(--b-faint);
                }

                .blg-post-cover-cat {
                    position: absolute;
                    bottom: 16px;
                    left: 16px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 12px;
                    border-radius: 2px;
                    font-family: var(--f-mono);
                    font-size: 9px;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    backdrop-filter: blur(10px);
                    z-index: 3;
                }

                /* ── Post Header ── */
                .blg-post-header {
                    margin-bottom: 28px;
                }
                .blg-post-cat-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 12px;
                    border-radius: 2px;
                    font-family: var(--f-mono);
                    font-size: 9px;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }
                .blg-post-title {
                    font-family: var(--f-display);
                    font-size: clamp(26px, 3vw, 38px);
                    font-weight: 400;
                    color: var(--t-1);
                    line-height: 1.25;
                    letter-spacing: -.02em;
                    margin: 0 0 16px;
                }
                .blg-post-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: var(--f-mono);
                    font-size: 11px;
                    color: var(--t-4);
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--b-faint);
                    flex-wrap: wrap;
                }

                /* ── Post Content ── */
                .blg-post-content {
                    color: var(--t-2);
                    font-size: 15px;
                    line-height: 1.85;
                }
                .blg-post-content h1 {
                    font-family: var(--f-display);
                    font-size: 30px;
                    font-weight: 600;
                    color: var(--t-1);
                    margin: 36px 0 14px;
                    letter-spacing: -.015em;
                }
                .blg-post-content h2 {
                    font-family: var(--f-display);
                    font-size: 24px;
                    font-weight: 500;
                    color: var(--t-1);
                    margin: 32px 0 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--b-faint);
                }
                .blg-post-content h3 {
                    font-family: var(--f-display);
                    font-size: 19px;
                    font-weight: 500;
                    color: var(--t-2);
                    margin: 24px 0 10px;
                }
                .blg-post-content p {
                    margin: 0 0 18px;
                }
                .blg-post-content strong {
                    font-weight: 700;
                    color: var(--t-1);
                }
                .blg-post-content em {
                    font-style: italic;
                    color: var(--t-2);
                }
                .blg-post-content u {
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .blg-post-content ul {
                    padding-left: 22px;
                    margin: 0 0 18px;
                    list-style: none;
                }
                .blg-post-content ul li {
                    position: relative;
                    padding-left: 16px;
                    margin-bottom: 8px;
                    line-height: 1.75;
                }
                .blg-post-content ul li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 11px;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: var(--gold);
                }
                .blg-post-content ol {
                    padding-left: 22px;
                    margin: 0 0 18px;
                    counter-reset: ol-counter;
                    list-style: none;
                }
                .blg-post-content ol li {
                    counter-increment: ol-counter;
                    position: relative;
                    padding-left: 16px;
                    margin-bottom: 8px;
                    line-height: 1.75;
                }
                .blg-post-content ol li::before {
                    content: counter(ol-counter) ".";
                    position: absolute;
                    left: -4px;
                    color: var(--gold);
                    font-family: var(--f-mono);
                    font-size: 12px;
                    font-weight: 600;
                }
                .blg-post-content blockquote {
                    border-left: 3px solid var(--gold);
                    padding: 14px 20px;
                    margin: 24px 0;
                    background: var(--gold-glow);
                    color: var(--t-2);
                    font-style: italic;
                    font-size: 16px;
                    line-height: 1.7;
                    border-radius: 0 2px 2px 0;
                }
                .blg-post-content pre {
                    background: var(--bg-0);
                    border: 1px solid var(--b-soft);
                    border-radius: 2px;
                    padding: 18px 20px;
                    font-family: var(--f-mono);
                    font-size: 13px;
                    overflow-x: auto;
                    margin: 20px 0;
                    color: var(--gold);
                    line-height: 1.6;
                }
                .blg-post-content a {
                    color: var(--gold);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    transition: color .2s;
                }
                .blg-post-content a:hover {
                    color: var(--gold-light);
                }
                .blg-post-content img {
                    width: 100%;
                    border-radius: 4px;
                    margin: 20px 0;
                    border: 1px solid var(--b-faint);
                }
                .blg-post-content hr {
                    border: none;
                    border-top: 1px solid var(--b-faint);
                    margin: 32px 0;
                }

                /* ── CTA Kutusu ── */
                .blg-post-cta {
                    margin-top: 40px;
                    padding: 28px 32px;
                    background: var(--bg-card);
                    border: 1px solid var(--b-faint);
                    border-top: 2px solid var(--gold);
                    border-radius: 2px;
                    position: relative;
                    overflow: hidden;
                }
                .blg-post-cta::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
                }
                .blg-post-cta h3 {
                    font-family: var(--f-display);
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--t-1);
                    margin: 0 0 8px;
                }
                .blg-post-cta p {
                    color: var(--t-3);
                    font-size: 14px;
                    margin: 0 0 18px;
                    line-height: 1.6;
                }

                /* ── Related ── */
                .blog-related {
                    padding: 60px 0;
                    border-top: 1px solid var(--b-faint);
                    background: var(--bg-1);
                }
                .blog-related h2 {
                    font-family: var(--f-display);
                    font-size: 28px;
                    font-weight: 400;
                    color: var(--t-1);
                    margin-bottom: 28px;
                }

                /* Light theme overrides */
                [data-theme="light"] .blg-post-content pre {
                    background: var(--bg-2);
                    color: var(--gold-muted);
                }
                [data-theme="light"] .blg-featured {
                    box-shadow: var(--sh-sm);
                }
                [data-theme="light"] .blg-card {
                    box-shadow: var(--sh-sm);
                }
                [data-theme="light"] .blog-related {
                    background: var(--bg-2);
                }
            `}</style>

            <div className="blog-post-page">
                <div className="container" style={{ maxWidth: '1100px' }}>

                    <button className="blg-back-btn" onClick={() => navigate("/blog")}>
                        <ArrowLeft size={14} strokeWidth={1.5} /> Blog'a Dön
                    </button>

                    <div className="blg-post-layout">

                        {/* Sol: Sticky Cover */}
                        <div className="blg-post-cover-wrap">
                            {post.imageUrl ? (
                                <>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: `url(${post.imageUrl})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center'
                                    }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)' }} />
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: `linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%)`
                                    }} />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${c.glow} 0%, transparent 70%)`
                                    }} />
                                    <BookOpen size={72} strokeWidth={0.5}
                                        style={{ color: c.text, opacity: .22, position: 'relative', zIndex: 2 }} />
                                </>
                            )}
                            <div className="blg-post-cover-cat" style={{
                                background: c.bg,
                                borderColor: c.border,
                                color: c.text,
                                border: `1px solid ${c.border}`
                            }}>
                                <Tag size={10} strokeWidth={2} /> {post.category}
                            </div>
                        </div>

                        {/* Sağ: İçerik */}
                        <div>
                            <div className="blg-post-header">
                                <div className="blg-post-cat-chip" style={{
                                    background: c.bg, borderColor: c.border, color: c.text,
                                    border: `1px solid ${c.border}`
                                }}>
                                    <Tag size={10} strokeWidth={2} />
                                    {post.category}
                                </div>
                                <h1 className="blg-post-title">{post.title}</h1>
                                <div className="blg-post-meta">
                                    <span>{post.author}</span>
                                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--t-4)", display: "inline-block" }} />
                                    <Clock size={11} strokeWidth={1.5} />
                                    <span>{new Date(post.publishedDate).toLocaleDateString('tr-TR')}</span>
                                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--t-4)", display: "inline-block" }} />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <article
                                className="blg-post-content"
                                dangerouslySetInnerHTML={{ __html: post.content || "" }}
                            />

                            <div className="blg-post-cta">
                                <h3>Bu Konuda Yardıma mı İhtiyacınız Var?</h3>
                                <p>Projeniz için ücretsiz analiz ve teklif alın. Ortalama 4 saatte yanıt veriyoruz.</p>
                                <Link to="/iletisim" className="btn btn--primary btn--lg">
                                    <ExternalLink size={14} strokeWidth={1.5} style={{ display: "inline", marginRight: 8 }} />
                                    Ücretsiz Teklif Al →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            <div className="blog-related">
                <div className="container">
                    <h2>İlgili Yazılar</h2>
                    <div className="blg-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px"
                    }}>
                        {related.map(p => {
                            const rc = getCat(p.category);
                            return (
                                <Link key={p.id} to={`/blog/${p.slug}`} style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--b-faint)",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "border-color .3s, box-shadow .3s, transform .3s"
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "var(--b-mid)";
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "var(--sh-md)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "var(--b-faint)";
                                        e.currentTarget.style.transform = "";
                                        e.currentTarget.style.boxShadow = "";
                                    }}
                                >
                                    <div style={{
                                        position: "relative", overflow: "hidden",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        aspectRatio: "16/9"
                                    }}>
                                        <CardCover imageUrl={p.imageUrl} category={p.category} size="card" />
                                        <div style={{
                                            position: "absolute", inset: 0,
                                            background: "rgba(0,0,0,.18)", zIndex: 1
                                        }} />
                                        <div style={{
                                            position: "absolute", bottom: 10, left: 10,
                                            padding: "3px 10px", borderRadius: "2px",
                                            fontFamily: "var(--f-mono)", fontSize: "9px",
                                            letterSpacing: ".12em", textTransform: "uppercase",
                                            background: rc.bg, border: `1px solid ${rc.border}`,
                                            color: rc.text, zIndex: 3,
                                            backdropFilter: "blur(8px)"
                                        }}>
                                            {p.category}
                                        </div>
                                    </div>
                                    <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <div style={{
                                            fontFamily: "var(--f-display)", fontSize: "17px",
                                            fontWeight: 500, color: "var(--t-1)", lineHeight: 1.35,
                                            display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical", overflow: "hidden"
                                        }}>
                                            {p.title}
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            justifyContent: "space-between", marginTop: "auto",
                                            paddingTop: "10px", borderTop: "1px solid var(--b-faint)"
                                        }}>
                                            <span style={{
                                                display: "flex", alignItems: "center", gap: 5,
                                                fontFamily: "var(--f-mono)", fontSize: "11px", color: "var(--t-4)"
                                            }}>
                                                <Clock size={11} strokeWidth={1.5} />
                                                {new Date(p.publishedDate).toLocaleDateString('tr-TR')} · {p.readTime}
                                            </span>
                                            <ArrowRight size={14} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Blog() {
    const { slug } = useParams();
    return slug ? <BlogPost /> : <BlogList />;
}
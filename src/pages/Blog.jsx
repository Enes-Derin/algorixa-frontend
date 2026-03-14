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

const DEFAULT_POSTS = [
    {
        id: 'default-1',
        slug: 'web-sitesi-performans-optimizasyonu',
        title: 'Web Sitesi Performans Optimizasyonu: 3 Saniyeden 1 Saniyeye',
        excerpt: 'Yavaş web sitesi müşteri kaybeder. Lighthouse 90+ skor için yapılması gerekenler.',
        content: `Web sitenizin yükleme hızı, kullanıcı deneyimi ve SEO için kritik öneme sahiptir.

## Görsel Optimizasyonu
WebP formatı kullanın, lazy loading uygulayın ve responsive görseller sunun.

## JavaScript Optimizasyonu
Code splitting uygulayın, gereksiz kütüphaneleri kaldırın.

## Sonuç
Bu adımları uygulayarak Lighthouse skorunuzu 90+ seviyesine çıkarabilirsiniz.`,
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
        content: 'SEO artık sadece anahtar kelime optimizasyonu değil...',
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
    "Rehber": "var(--accent)",
    "Strateji": "var(--primary)",
    "Teknik": "#34d399",
    "SEO": "#f87171",
    "Tasarım": "var(--secondary)",
};

function parseContent(md) {
    return md
        .replace(/^## (.+)/gm, '<h2>$1</h2>')
        .replace(/^### (.+)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^> (.+)/gm, '<blockquote><p>$1</p></blockquote>')
        .replace(/^- (.+)/gm, '<li>$1</li>')
        .replace(/((<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hbui])/gm, '')
        .replace(/<p><\/p>/g, '');
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
            {!isLoaded && !hasError && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', zIndex: 5,
                    color: 'rgba(255,255,255,0.5)', fontSize: '12px',
                    fontFamily: 'var(--f-mono)', letterSpacing: '.1em', textAlign: 'center'
                }}>
                    <div className="loading-spinner" />
                    YÜKLENİYOR...
                </div>
            )}
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
    return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

// ── Kart görseli: varsa gerçek görsel, yoksa gradient ──
function CardBg({ imageUrl, category, size = "normal" }) {
    const color = CAT_COLORS[category] ?? 'rgba(59,130,246,.25)';
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0B1120, #111827)' }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 80% 80% at 40% 50%, ${color}33 0%, transparent 65%)`
            }} />
            <BookOpen
                size={size === "featured" ? 80 : size === "post" ? 88 : 36}
                strokeWidth={size === "post" ? 0.45 : 0.7}
                style={{ color: color, opacity: size === "post" ? .18 : .2, position: 'relative', zIndex: 1 }}
            />
        </>
    );
}

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

    const CATS = [...categories];
    const filtered = cat === "Tümü" ? posts : posts.filter(p => p.category === cat);
    const featured = filtered.find(p => p.isFeatured) || filtered[0];
    const rest = filtered.filter(p => p !== featured);

    if (loading) {
        return (
            <div className="page">
                <div className="container text-center" style={{ padding: "100px 0" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
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
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0, transform: 'translateY(16px)', animation: 'heroFadeUp .7s var(--ease) .6s forwards' }}>
                        {CATS.filter(c => c !== "Tümü").map(c => (
                            <span key={c} className="hero-badge-pill" style={{
                                color: CAT_COLORS[c] ?? 'var(--accent)',
                                borderColor: `${CAT_COLORS[c] ?? 'var(--accent)'}44`,
                                background: `${CAT_COLORS[c] ?? 'var(--accent)'}18`
                            }}>{c}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section section-border-top" style={{ paddingTop: "60px" }}>
                <div className="container">
                    {/* Filters */}
                    <div className="blg-filters">
                        {CATS.map(c => (
                            <button key={c} className={`blg-filter-btn${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
                                {cat === c && <Sparkles size={11} strokeWidth={2} />}
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Featured */}
                    {featured && (
                        <div className="blg-featured" onClick={() => navigate(`/blog/${featured.slug}`)}>
                            <div className="blg-featured__img">
                                <CardBg imageUrl={featured.imageUrl} category={featured.category} size="featured" />
                                {/* Görsel varsa üzerine hafif karartma katmanı */}
                                {featured.imageUrl && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,20,.45)', zIndex: 1 }} />
                                )}
                                {/* Grid overlay - sadece gradient modda */}
                                {!featured.imageUrl && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: 'linear-gradient(rgba(59,130,246,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.06) 1px, transparent 1px)',
                                        backgroundSize: '44px 44px', zIndex: 1, pointerEvents: 'none'
                                    }} />
                                )}
                                <div className="blg-featured__cat-badge"
                                    style={{ "--c": CAT_COLORS[featured.category] ?? "var(--primary)", zIndex: 2 }}>
                                    <Tag size={10} strokeWidth={2} />{featured.category}
                                </div>
                            </div>
                            <div className="blg-featured__body">
                                <div className="blg-featured__eyebrow">
                                    <Sparkles size={12} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                                    Öne Çıkan Yazı
                                </div>
                                <h2 className="blg-featured__title">{featured.title}</h2>
                                <p className="blg-featured__excerpt">{featured.excerpt}</p>
                                <div className="blg-featured__meta">
                                    <span>{featured.author}</span>
                                    <span className="blg-dot" />
                                    <Clock size={12} strokeWidth={1.5} />
                                    <span>{new Date(featured.publishedDate).toLocaleDateString('tr-TR')}</span>
                                    <span className="blg-dot" />
                                    <span>{featured.readTime}</span>
                                </div>
                                <span className="blg-featured__cta btn btn--outline btn--mono btn--sm">
                                    Oku <ArrowRight size={12} strokeWidth={2} style={{ display: "inline", marginLeft: 4 }} />
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="blg-grid">
                        {rest.map(post => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className="blg-card">
                                <div className="blg-card__img">
                                    <CardBg imageUrl={post.imageUrl} category={post.category} size="card" />
                                    {post.imageUrl && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,20,.35)', zIndex: 1 }} />
                                    )}
                                    <div className="blg-card__cat-badge"
                                        style={{ "--c": CAT_COLORS[post.category] ?? "var(--primary)", zIndex: 2 }}>
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
                                        <ArrowRight size={15} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentPost, posts: backendPosts, loading } = useSelector(s => s.blog);
    const posts = backendPosts.length > 0 ? backendPosts : DEFAULT_POSTS;

    useEffect(() => {
        dispatch(fetchPostBySlug(slug));
    }, [slug, dispatch]);

    useEffect(() => {
        if (currentPost) {
            dispatch(incrementViewCount(currentPost.id));
        }
    }, [currentPost, dispatch]);

    const post = currentPost || posts.find(p => p.slug === slug);
    const related = posts.filter(p => p.slug !== slug).slice(0, 3);

    if (loading) {
        return (
            <div className="page">
                <div className="container text-center" style={{ padding: "100px 0" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
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

    const html = parseContent(post.content || "");
    const catColor = CAT_COLORS[post.category] ?? "var(--primary)";

    return (
        <>
            <ReadingProgress />
            <div className="blog-post-page">
                <div className="container--sm">
                    <button className="blg-back-btn" onClick={() => navigate("/blog")}>
                        <ArrowLeft size={15} strokeWidth={1.5} /> Blog'a Dön
                    </button>

                    <div className="blog-post__header">
                        <div className="blg-post__cat-row">
                            <span className="blog-post__cat" style={{
                                background: `${catColor}18`, borderColor: `${catColor}44`, color: catColor
                            }}>
                                <Tag size={11} strokeWidth={2} style={{ display: "inline", marginRight: 5 }} />
                                {post.category}
                            </span>
                        </div>
                        <h1 className="blog-post__title">{post.title}</h1>
                        <div className="blog-post__meta">
                            <span>{post.author}</span>
                            <span>·</span>
                            <Clock size={12} strokeWidth={1.5} />
                            <span>{new Date(post.publishedDate).toLocaleDateString('tr-TR')}</span>
                            <span>·</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    {/* Cover: gerçek görsel varsa göster, yoksa gradient placeholder */}
                    <div className="blg-post__cover">
                        {post.imageUrl ? (
                            <>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: `url(${post.imageUrl})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    borderRadius: 'inherit'
                                }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(6,10,20,.3)',
                                    borderRadius: 'inherit'
                                }} />
                            </>
                        ) : (
                            <>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: `linear-gradient(135deg, #0B1120, #111827)`,
                                    borderRadius: 'inherit'
                                }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${catColor}22 0%, transparent 70%)`,
                                    borderRadius: 'inherit'
                                }} />
                                <BookOpen size={88} strokeWidth={0.45}
                                    style={{ color: catColor, opacity: .18, position: 'relative', zIndex: 2 }} />
                            </>
                        )}
                        <div className="blg-post__cover-cat" style={{ zIndex: 3 }}>
                            <Tag size={11} strokeWidth={2} /> {post.category}
                        </div>
                    </div>

                    <article className="blog-post__content"
                        dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />

                    <div className="blog-post__cta">
                        <h3>Bu Konuda Yardıma mı İhtiyacınız Var?</h3>
                        <p>Projeniz için ücretsiz analiz ve teklif alın. Ortalama 4 saatte yanıt veriyoruz.</p>
                        <Link to="/iletisim" className="btn btn--primary btn--lg">
                            <ExternalLink size={15} strokeWidth={1.5} style={{ display: "inline", marginRight: 8 }} />
                            Ücretsiz Teklif Al →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="blog-related">
                <div className="container">
                    <h2>İlgili Yazılar</h2>
                    <div className="blg-grid">
                        {related.map(p => (
                            <Link key={p.id} to={`/blog/${p.slug}`} className="blg-card">
                                <div className="blg-card__img">
                                    <CardBg imageUrl={p.imageUrl} category={p.category} size="card" />
                                    {p.imageUrl && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,20,.35)', zIndex: 1 }} />
                                    )}
                                    <div className="blg-card__cat-badge"
                                        style={{ "--c": CAT_COLORS[p.category] ?? "var(--primary)", zIndex: 2 }}>
                                        {p.category}
                                    </div>
                                </div>
                                <div className="blg-card__body">
                                    <h3 className="blg-card__title">{p.title}</h3>
                                    <div className="blg-card__footer">
                                        <span className="blg-card__meta">
                                            <Clock size={11} strokeWidth={1.5} />
                                            {new Date(p.publishedDate).toLocaleDateString('tr-TR')} · {p.readTime}
                                        </span>
                                        <ArrowRight size={15} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
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
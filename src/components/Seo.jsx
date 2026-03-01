import { Helmet } from "react-helmet-async";

const SEO = ({
    title = "Algorixa — Kurumsal Web Sitesi, Yazılım ve Admin Panel Çözümleri | İstanbul",
    description = "İstanbul'da kurumsal web sitesi tasarımı, admin panelli web uygulamaları ve özel yazılım geliştirme. Landing page 8.900₺'den, kurumsal site 14.900₺'den. Ajans karmaşası yok — doğrudan geliştiriciyle çalışın.",
    keywords = "web tasarım istanbul, kurumsal web sitesi istanbul, web sitesi yaptırma istanbul, admin panelli web sitesi, landing page tasarımı istanbul, özel yazılım geliştirme istanbul, web tasarım fiyatları, kurumsal web sitesi fiyatı, SEO uyumlu web sitesi, react web sitesi, full stack geliştirici istanbul, web sitesi yaptırma fiyatı, profesyonel web tasarım istanbul, mobil uyumlu web sitesi, hızlı web sitesi, güvenli web sitesi, algorixa, enes derin web tasarım, dijital çözümler istanbul, KOBİ web sitesi istanbul, sanayi firması web sitesi",
    ogImage = "https://www.algorixa.com.tr/og-image.jpg",
    url = "https://www.algorixa.com.tr",
    canonical = "https://www.algorixa.com.tr/",
    type = "website"
}) => {

    /* ─── LOCAL BUSINESS (en güçlü yerel SEO sinyali) ─── */
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "ProfessionalService"],
        "name": "Algorixa",
        "alternateName": ["Algorixa Web Tasarım", "Algorixa Yazılım", "Algorixa İstanbul"],
        "description": "İstanbul'da kurumsal web sitesi tasarımı, admin panelli web uygulamaları, landing page ve özel yazılım geliştirme hizmetleri. Doğrudan geliştiriciyle çalışın.",
        "url": "https://www.algorixa.com.tr",
        "logo": "https://www.algorixa.com.tr/logo.png",
        "image": "https://www.algorixa.com.tr/og-image.jpg",
        "telephone": "+905469705451",
        "email": "enesderin.contact@gmail.com",
        "priceRange": "₺₺",
        "currenciesAccepted": "TRY",
        "paymentAccepted": "Nakit, Havale/EFT, Kredi Kartı",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "İstanbul",
            "addressRegion": "İstanbul",
            "postalCode": "34000",
            "addressCountry": "TR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 41.0082,
            "longitude": 28.9784
        },
        "areaServed": [
            { "@type": "City", "name": "İstanbul" },
            { "@type": "Country", "name": "Türkiye" }
        ],
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 41.0082, "longitude": 28.9784 },
            "geoRadius": "50000"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "sameAs": ["https://www.instagram.com/algorixa_/"],
        "founder": { "@type": "Person", "name": "Enes Derin" },
        "foundingDate": "2023",
        "knowsLanguage": ["tr", "en"],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web Tasarım & Yazılım Hizmetleri",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Landing Page Tasarımı",
                    "description": "Dönüşüm odaklı tek sayfa web sitesi. 5-7 iş günü teslimat.",
                    "price": "8900",
                    "priceCurrency": "TRY",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "8900", "priceCurrency": "TRY", "unitText": "proje" },
                    "itemOffered": { "@type": "Service", "name": "Landing Page Tasarımı" }
                },
                {
                    "@type": "Offer",
                    "name": "Kurumsal Web Sitesi (Statik)",
                    "description": "SEO uyumlu, hızlı kurumsal web sitesi. 8-10 iş günü teslimat.",
                    "price": "14900",
                    "priceCurrency": "TRY",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "14900", "priceCurrency": "TRY", "unitText": "proje" },
                    "itemOffered": { "@type": "Service", "name": "Kurumsal Web Sitesi Statik" }
                },
                {
                    "@type": "Offer",
                    "name": "Kurumsal Web Sitesi (Admin Panelli)",
                    "description": "Kendi kendine yönetilebilen dinamik web sitesi. 12-15 iş günü teslimat.",
                    "price": "22900",
                    "priceCurrency": "TRY",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "22900", "priceCurrency": "TRY", "unitText": "proje" },
                    "itemOffered": { "@type": "Service", "name": "Kurumsal Web Sitesi Admin Panelli" }
                },
                {
                    "@type": "Offer",
                    "name": "Aylık Web Bakım Paketi",
                    "description": "Hosting, SSL, yedekleme, SEO takibi ve içerik güncellemeleri.",
                    "price": "1500",
                    "priceCurrency": "TRY",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "1500", "priceCurrency": "TRY", "unitText": "ay" },
                    "itemOffered": { "@type": "Service", "name": "Web Bakım Paketi" }
                }
            ]
        }
    };

    /* ─── WEBSITE SCHEMA (SearchAction ile) ─── */
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Algorixa",
        "url": "https://www.algorixa.com.tr",
        "description": "İstanbul'da kurumsal web sitesi tasarımı, admin panel ve özel yazılım geliştirme.",
        "inLanguage": "tr-TR",
        "copyrightYear": "2024",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.algorixa.com.tr/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    /* ─── PERSON SCHEMA (kurucu) ─── */
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Enes Derin",
        "jobTitle": "Full Stack Web Geliştirici",
        "worksFor": { "@type": "Organization", "name": "Algorixa" },
        "url": "https://www.enesderin.com.tr",
        "sameAs": ["https://www.instagram.com/algorixa_/"],
        "knowsAbout": ["Web Tasarım", "React", "Spring Boot", "SEO", "UI/UX", "Admin Panel Geliştirme"]
    };

    /* ─── BREADCRUMB ─── */
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.algorixa.com.tr/" },
            { "@type": "ListItem", "position": 2, "name": "Hizmetler", "item": "https://www.algorixa.com.tr/#services" },
            { "@type": "ListItem", "position": 3, "name": "Referanslar", "item": "https://www.algorixa.com.tr/#projects" },
            { "@type": "ListItem", "position": 4, "name": "Fiyatlar", "item": "https://www.algorixa.com.tr/#pricing" },
            { "@type": "ListItem", "position": 5, "name": "İletişim", "item": "https://www.algorixa.com.tr/#contact" }
        ]
    };

    /* ─── FAQ (genişletilmiş — fiyatları içeren sorular önemli) ─── */
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "İstanbul'da web sitesi yaptırma fiyatları ne kadar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Algorixa'da landing page 8.900₺'den, kurumsal statik web sitesi 14.900₺'den, admin panelli dinamik web sitesi 22.900₺'den başlar. Aylık web bakım paketi 1.500₺'den başlamaktadır. Tüm fiyatlar KDV hariçtir."
                }
            },
            {
                "@type": "Question",
                "name": "Admin panelli web sitesi ne demek, ne işe yarar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Admin panelli web sitesi, sitenizin içeriklerini (blog yazıları, ürünler, fiyatlar, görseller) teknik bilgi gerekmeden tarayıcı üzerinden yönetebileceğiniz bir yönetim sistemidir. Geliştirici bağımlılığı olmadan sitenizi kendiniz güncelleyebilirsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Web sitesi projesi kaç günde teslim edilir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Landing page 5-7 iş günü, kurumsal statik web sitesi 8-10 iş günü, admin panelli dinamik web sitesi 12-15 iş günü içinde teslim edilmektedir. Özel yazılım projelerinde süre proje kapsamına göre belirlenir."
                }
            },
            {
                "@type": "Question",
                "name": "Kurumsal web sitesi neden önemlidir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Profesyonel bir web sitesi müşteri güvenini artırır, Google'da görünürlük sağlar ve 7/24 müşteri kazanımına olanak tanır. İstanbul'daki KOBİ ve sanayi firmalarının büyük çoğunluğunun profesyonel web sitesi bulunmamaktadır — bu büyük bir rekabet avantajı fırsatıdır."
                }
            },
            {
                "@type": "Question",
                "name": "Web sitesinde SEO neden önemli?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SEO sayesinde Google'da 'web tasarım istanbul', 'kurumsal web sitesi' gibi aramalarda üst sıralarda çıkabilirsiniz. Bu, ücretli reklam vermeden organik müşteri kazanmanızı sağlar. Algorixa'da tüm projeler teknik SEO standartlarına uygun geliştirilir."
                }
            },
            {
                "@type": "Question",
                "name": "Aylık web bakım paketi nedir, neler dahil?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Aylık web bakım paketi hosting, SSL yönetimi, günlük otomatik yedekleme, uptime takibi ve aylık içerik güncellemelerini kapsar. Başlangıç paketi 1.500₺/ay, Büyüme paketi 2.500₺/ay ve Pro paketi 4.000₺/ay olarak sunulmaktadır."
                }
            },
            {
                "@type": "Question",
                "name": "Ajans yerine freelancer tercih etmeli miyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Algorixa ile doğrudan geliştiriciyle çalışırsınız — ajans gibi pahalı ve yavaş değil, tek muhatap ve hızlı iletişim. Tasarım, backend, sunucu kurulumu ve SEO'yu tek kişi yönetir. Ajans karmaşası, ara katmanlar ve sürpriz maliyet yoktur."
                }
            },
            {
                "@type": "Question",
                "name": "Sanayi firmaları için web sitesi yapıyor musunuz?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet. Referans projemiz rulmanlistesi.com, İstanbul İkitelli'deki 33 yıllık bir sanayi firması için geliştirilen 25.835 ürünlü B2B katalog sistemidir. Sanayi, makine, elektrik, inşaat ve toptan satış firmaları için özel çözümler üretiyoruz."
                }
            }
        ]
    };

    /* ─── SERVICE SCHEMA (her hizmet için ayrı) ─── */
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Web Tasarım ve Yazılım Geliştirme",
        "name": "Kurumsal Web Sitesi Tasarımı İstanbul",
        "description": "İstanbul'da doğrudan geliştiriciyle çalışarak kurumsal web sitesi, landing page, admin panelli web uygulaması ve özel yazılım geliştirme hizmetleri.",
        "provider": {
            "@type": "Organization",
            "name": "Algorixa",
            "url": "https://www.algorixa.com.tr"
        },
        "areaServed": { "@type": "City", "name": "İstanbul" },
        "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": "https://www.algorixa.com.tr",
            "servicePhone": "+905469705451"
        },
        "termsOfService": "https://www.algorixa.com.tr/#contact"
    };

    return (
        <Helmet>
            {/* ─── Temel ─── */}
            <html lang="tr" />
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Algorixa — Enes Derin" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Turkish" />
            <meta name="revisit-after" content="3 days" />
            <meta name="rating" content="general" />
            <meta name="distribution" content="global" />
            <meta name="copyright" content="Algorixa" />

            {/* ─── Canonical ─── */}
            <link rel="canonical" href={canonical} />
            <link rel="alternate" hrefLang="tr" href="https://www.algorixa.com.tr/" />
            <link rel="alternate" hrefLang="x-default" href="https://www.algorixa.com.tr/" />

            {/* ─── Geo (yerel SEO) ─── */}
            <meta name="geo.region" content="TR-34" />
            <meta name="geo.placename" content="İstanbul, Türkiye" />
            <meta name="geo.position" content="41.0082;28.9784" />
            <meta name="ICBM" content="41.0082, 28.9784" />

            {/* ─── Open Graph ─── */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Algorixa — Kurumsal Web Sitesi ve Yazılım Çözümleri İstanbul" />
            <meta property="og:locale" content="tr_TR" />
            <meta property="og:site_name" content="Algorixa" />

            {/* ─── Twitter Card ─── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content="Algorixa — Kurumsal Web Sitesi ve Yazılım Çözümleri İstanbul" />
            <meta name="twitter:site" content="@algorixa_" />

            {/* ─── PWA / Mobil ─── */}
            <meta name="theme-color" content="#d4b676" />
            <meta name="msapplication-TileColor" content="#d4b676" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Algorixa" />
            <meta name="application-name" content="Algorixa" />

            {/* ─── Performans: Preconnect ─── */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

            {/* ─── JSON-LD Schemas ─── */}
            <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        </Helmet>
    );
};

export default SEO;
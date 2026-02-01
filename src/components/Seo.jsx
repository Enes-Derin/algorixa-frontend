import { Helmet } from "react-helmet-async";

const SEO = ({
    title = "Algorixa - Kurumsal Web Sitesi, Yazılım ve Admin Panel Çözümleri | İstanbul",
    description = "İstanbul'da kurumsal web sitesi tasarımı, admin panelli web uygulamaları ve özel yazılım geliştirme hizmetleri. SEO uyumlu, hızlı, güvenilir ve satış odaklı dijital çözümler. İşletmenizi dijitalde büyütün.",
    keywords = "algorixa, algorixa web sitesi, kurumsal web sitesi, web tasarım istanbul, yazılım şirketi istanbul, admin panel geliştirme, landing page tasarımı, SEO uyumlu web sitesi, e-ticaret sitesi, özel yazılım geliştirme, react web sitesi, dijital ajans istanbul, web yazılım hizmetleri, kurumsal web tasarım, responsive web tasarım, mobil uyumlu web sitesi, profesyonel web tasarım, web sitesi yaptırma, freelance yazılım geliştirici, web uygulama geliştirme, online sipariş sistemi, randevu sistemi, üye yönetim sistemi, CRM yazılımı, işletme yazılımı, dijital dönüşüm, web tabanlı yazılım, bulut tabanlı sistem, API entegrasyonu, modern web teknolojileri, full stack geliştirme",
    ogImage = "https://algorixa.com.tr/og-image.jpg",
    url = "https://www.algorixa.com.tr",
    type = "website"
}) => {
    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Algorixa",
        "alternateName": "Algorixa Yazılım",
        "image": "https://algorixa.com.tr/logo.png",
        "description": description,
        "url": url,
        "telephone": "+905469705451",
        "email": "enesderin.contact@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "İstanbul",
            "addressRegion": "İstanbul",
            "addressCountry": "TR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 41.0082,
            "longitude": 28.9784
        },
        "priceRange": "$$",
        "areaServed": {
            "@type": "Country",
            "name": "Türkiye"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "sameAs": [
            "https://instagram.com/algorixa_"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Dijital Hizmetler",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Kurumsal Web Sitesi Tasarımı",
                        "description": "Güven veren, hızlı ve SEO uyumlu kurumsal web siteleri"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Admin Panelli Web Uygulamaları",
                        "description": "İş süreçlerinizi yönetmek için özel admin panel sistemleri"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Landing Page Tasarımı",
                        "description": "Yüksek dönüşüm oranlarına sahip satış sayfaları"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Özel Yazılım Geliştirme",
                        "description": "İşletmenize özel yazılım çözümleri ve entegrasyonlar"
                    }
                }
            ]
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Algorixa",
        "legalName": "Algorixa Yazılım Hizmetleri",
        "url": url,
        "logo": "https://algorixa.com.tr/logo.png",
        "foundingDate": "2023",
        "founders": [
            {
                "@type": "Person",
                "name": "Enes Derin"
            }
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-546-970-5451",
            "contactType": "customer service",
            "email": "enesderin.contact@gmail.com",
            "areaServed": "TR",
            "availableLanguage": ["Turkish", "English"]
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "İstanbul",
            "addressRegion": "İstanbul",
            "addressCountry": "TR"
        },
        "sameAs": [
            "https://instagram.com/algorixa_"
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": url
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Hizmetler",
                "item": `${url}#services`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Projeler",
                "item": `${url}#projects`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "İletişim",
                "item": `${url}#contact`
            }
        ]
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": url,
        "inLanguage": "tr-TR",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Algorixa",
            "url": url
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Algorixa ne tür hizmetler sunuyor?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Algorixa; kurumsal web sitesi tasarımı, admin panelli web uygulamaları, landing page tasarımı ve özel yazılım geliştirme hizmetleri sunmaktadır. Tüm çözümlerimiz SEO uyumlu, hızlı ve güvenilirdir."
                }
            },
            {
                "@type": "Question",
                "name": "Web sitesi projesi ne kadar sürede tamamlanır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Proje kapsamına bağlı olarak değişmekle birlikte, standart bir kurumsal web sitesi 2-4 hafta, admin panelli sistemler ise 4-8 hafta arasında teslim edilir. Her proje için net bir zaman çizelgesi sunulur."
                }
            },
            {
                "@type": "Question",
                "name": "SEO uyumlu web sitesi nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SEO uyumlu web sitesi, Google ve diğer arama motorlarında üst sıralarda çıkmak için optimize edilmiş, hızlı, mobil uyumlu ve teknik SEO standartlarına uygun olarak geliştirilmiş web sitesidir."
                }
            },
            {
                "@type": "Question",
                "name": "Hangi bölgelere hizmet veriyorsunuz?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "İstanbul merkezli olmakla birlikte, Türkiye'nin her yerinden ve yurt dışından projelere uzaktan hizmet vermekteyiz. Online toplantılar ve süreç yönetimi ile projeler başarıyla tamamlanmaktadır."
                }
            },
            {
                "@type": "Question",
                "name": "Admin panel sistemi ne işe yarar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Admin panel, web sitenizin içeriğini, ürünlerinizi, müşterilerinizi, siparişlerinizi ve diğer tüm verileri kolayca yönetebileceğiniz özel bir yönetim sistemidir. Teknik bilgi gerektirmeden web sitenizi güncelleyebilirsiniz."
                }
            }
        ]
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <html lang="tr" />
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Algorixa - Enes Derin" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Turkish" />
            <meta name="revisit-after" content="3 days" />
            <meta name="rating" content="general" />
            <meta name="distribution" content="global" />

            {/* Geo Tags */}
            <meta name="geo.region" content="TR-34" />
            <meta name="geo.placename" content="Istanbul" />
            <meta name="geo.position" content="41.0082;28.9784" />
            <meta name="ICBM" content="41.0082, 28.9784" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Algorixa - Kurumsal Web Sitesi ve Yazılım Çözümleri" />
            <meta property="og:locale" content="tr_TR" />
            <meta property="og:site_name" content="Algorixa" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content="Algorixa - Kurumsal Web Sitesi ve Yazılım Çözümleri" />

            {/* Additional SEO Tags */}
            <meta name="theme-color" content="#d4b676" />
            <meta name="msapplication-TileColor" content="#d4b676" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Algorixa" />

            {/* Canonical */}
            <link rel="canonical" href={url} />

            {/* Alternate Language */}
            <link rel="alternate" hrefLang="tr" href={url} />
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Preconnect for Performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* Schema.org for Google - Business */}
            <script type="application/ld+json">
                {JSON.stringify(businessSchema)}
            </script>

            {/* Schema.org for Google - Organization */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>

            {/* Schema.org for Google - Breadcrumb */}
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>

            {/* Schema.org for Google - WebPage */}
            <script type="application/ld+json">
                {JSON.stringify(webPageSchema)}
            </script>

            {/* Schema.org for Google - FAQ */}
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
import { motion } from "framer-motion";

/**
 * SeoContent.jsx
 * 
 * Sayfanın alt kısmında görünen ama kullanıcı deneyimini bozmayan
 * SEO odaklı içerik bölümü. Google bu metinleri indexler.
 * 
 * Hedef kelimeler:
 * - web tasarım istanbul
 * - kurumsal web sitesi istanbul
 * - web sitesi yaptırma fiyatları
 * - admin panelli web sitesi
 * - landing page tasarımı istanbul
 * - web tasarım fiyatları 2026
 */

const SeoContent = () => {
    return (
        <section
            id="seo-content"
            aria-label="Hizmetler Hakkında Bilgi"
            style={{
                padding: "80px 0",
                background: "var(--bg-section)",
                borderTop: "1px solid var(--border-subtle)"
            }}
        >
            <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>

                {/* Başlık */}
                <motion.div
                    style={{ textAlign: "center", marginBottom: "52px" }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 style={{
                        fontSize: "clamp(22px, 3vw, 30px)",
                        fontWeight: "800",
                        color: "var(--text-primary)",
                        marginBottom: "12px",
                        letterSpacing: "-0.3px"
                    }}>
                        İstanbul'da Web Tasarım & Yazılım Hizmetleri
                    </h2>
                    <p style={{
                        fontSize: "16px",
                        color: "var(--text-secondary)",
                        maxWidth: "620px",
                        margin: "0 auto",
                        lineHeight: "1.7"
                    }}>
                        Algorixa olarak İstanbul'daki işletmelere kurumsal web sitesi, admin panelli web uygulamaları ve özel yazılım çözümleri sunuyoruz. Her projede doğrudan geliştiriciyle çalışırsınız.
                    </p>
                </motion.div>

                {/* 3 Sütun Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "28px",
                    marginBottom: "52px"
                }}>
                    {[
                        {
                            heading: "İstanbul'da Kurumsal Web Sitesi Tasarımı",
                            body: "İstanbul merkezli işletmeniz için SEO uyumlu, hızlı açılan ve mobil dostu kurumsal web siteleri tasarlıyoruz. Landing page'den admin panelli dinamik sitelere kadar her ölçekte çözüm. Web tasarım fiyatlarımız 8.900₺'den başlar, net kapsamlı ve şeffaf fiyatlandırma ile çalışırız."
                        },
                        {
                            heading: "Admin Panelli Web Uygulamaları",
                            body: "Sitenizin içeriklerini, ürünlerinizi ve kampanyalarınızı teknik bilgi gerekmeden kendiniz yönetin. Admin panelli web sitesi ile blog yazıları, galeri, fiyat güncellemelerini panelden dakikalar içinde yapabilirsiniz. Her güncelleme için geliştirici beklemenize gerek kalmaz."
                        },
                        {
                            heading: "Özel Yazılım & B2B Çözümler",
                            body: "Standart şablonların yetmediği işletmeler için sıfırdan özel yazılım geliştiriyoruz. B2B ürün katalog sistemleri, servis yönetim yazılımları ve iş süreçleri için React + Spring Boot teknolojileriyle güvenli ve ölçeklenebilir çözümler. Örnek: 25.835 ürünlü rulmanlistesi.com."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                padding: "24px",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "16px"
                            }}
                        >
                            <h3 style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "var(--brand-main)",
                                marginBottom: "10px",
                                lineHeight: "1.4"
                            }}>
                                {item.heading}
                            </h3>
                            <p style={{
                                fontSize: "14px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.75",
                                margin: 0
                            }}>
                                {item.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Uzun metin bloğu — Google için kritik */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{
                        padding: "32px 36px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "18px",
                        marginBottom: "36px"
                    }}
                >
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "var(--text-primary)",
                        marginBottom: "16px"
                    }}>
                        Neden Algorixa ile Çalışmalısınız?
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px"
                    }}>
                        {[
                            {
                                title: "Doğrudan Geliştirici",
                                text: "Ajans karmaşası olmadan, tek muhatapla çalışırsınız. Tasarım, geliştirme, sunucu kurulumu ve SEO'yu tek kişi yönetir. İletişim hızlı, süreç şeffaftır."
                            },
                            {
                                title: "Web Tasarım Fiyatları 2026",
                                text: "Landing page 8.900₺, kurumsal statik site 14.900₺, admin panelli dinamik site 22.900₺'den başlar. Aylık bakım paketleri 1.500₺/aydan. KDV hariç, net fiyat, sürpriz maliyet yok."
                            },
                            {
                                title: "İstanbul & Türkiye Geneli",
                                text: "İstanbul başta olmak üzere Türkiye'nin her yerinden projelere uzaktan hizmet veriyoruz. Online toplantılar ve düzenli güncellemelerle projeler zamanında teslim edilir."
                            },
                            {
                                title: "SEO Uyumlu Altyapı",
                                text: "Her proje teknik SEO standartlarına göre geliştirilir. Hızlı açılma, mobil uyumluluk, schema markup, sitemap ve canonical URL'ler varsayılan olarak dahildir."
                            },
                            {
                                title: "Sanayi & KOBİ Sektörü",
                                text: "İstanbul İkitelli başta olmak üzere sanayi firmalarına, toptan satış şirketlerine ve KOBİ'lere özel B2B katalog sistemleri ve kurumsal web siteleri geliştiriyoruz."
                            },
                            {
                                title: "Teslim Sonrası Destek",
                                text: "Tüm paketlerde 30-90 gün ücretsiz teknik destek. Uzun vadeli aylık bakım paketleriyle hosting, güncelleme, SEO takibi ve teknik destek aynı çatı altında."
                            }
                        ].map((item, i) => (
                            <div key={i}>
                                <h3 style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "var(--brand-main)",
                                    marginBottom: "6px"
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontSize: "13px",
                                    color: "var(--text-secondary)",
                                    lineHeight: "1.7",
                                    margin: 0
                                }}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Hizmet verilen sektörler */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    style={{
                        padding: "24px 32px",
                        background: "rgba(212,182,118,0.06)",
                        border: "1px solid rgba(212,182,118,0.15)",
                        borderRadius: "16px"
                    }}
                >
                    <h3 style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        marginBottom: "14px"
                    }}>
                        Hizmet Verdiğimiz Sektörler
                    </h3>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}>
                        {[
                            "Sanayi Firmaları", "İnşaat & Yapı", "Otomotiv & Yedek Parça",
                            "Elektronik Servis", "Restoran & Kafe", "Danışmanlık Firmaları",
                            "B2B Toptan Satış", "Lojistik & Nakliye", "Sağlık & Klinik",
                            "Hukuk & Avukatlık", "Muhasebe & Mali Müşavirlik", "Eğitim & Kurs",
                            "Gayrimenkul", "Turizm & Otelcilik", "Tekstil & Hazır Giyim"
                        ].map((sector, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: "6px 14px",
                                    background: "rgba(212,182,118,0.1)",
                                    border: "1px solid rgba(212,182,118,0.2)",
                                    borderRadius: "999px",
                                    fontSize: "12px",
                                    color: "var(--text-secondary)",
                                    fontWeight: "500"
                                }}
                            >
                                {sector}
                            </span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default SeoContent;
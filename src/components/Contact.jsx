import { useState, useEffect } from "react";
import apiInstance from "../api/ApiInstance";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Contact = () => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoteData, setQuoteData] = useState(null);

    useEffect(() => {
        // İlk yükleme ve her render'da kontrol et
        const checkQuoteData = () => {
            const storedQuoteData = localStorage.getItem('quoteData');
            if (storedQuoteData) {
                try {
                    const data = JSON.parse(storedQuoteData);
                    setQuoteData(data);
                } catch (e) {
                    console.error("Quote data parse error:", e);
                }
            }
        };

        // İlk kontrol
        checkQuoteData();

        // Interval ile sürekli kontrol et (her 500ms)
        const interval = setInterval(checkQuoteData, 500);

        // Storage event listener (farklı tab'lardan gelirse)
        const handleStorageChange = (e) => {
            if (e.key === 'quoteData') {
                checkQuoteData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event listener (aynı sayfada değişiklik olursa)
        const handleQuoteUpdate = () => {
            checkQuoteData();
        };

        window.addEventListener('quoteDataUpdated', handleQuoteUpdate);

        // Cleanup
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('quoteDataUpdated', handleQuoteUpdate);
        };
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleRemoveQuote = () => {
        setQuoteData(null);
        localStorage.removeItem('quoteData');
    };

    const generateQuoteMessage = () => {
        if (!quoteData) return "";

        let message = "\n\n";
        message += "═══════════════════════════════════════\n";
        message += "         FİYAT HESAPLAYICI DETAYLARI\n";
        message += "═══════════════════════════════════════\n\n";

        if (quoteData.package) {
            // Yeni paket sistemi
            message += `SEÇİLEN PAKET: ${quoteData.package}\n`;
            message += `Başlangıç Fiyatı: ${formatPrice(quoteData.price)}\n\n`;

            if (quoteData.pages && quoteData.pages.length > 0) {
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                message += `Paket İçeriği (${quoteData.pages.length} Sayfa):\n`;
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                quoteData.pages.forEach((page, i) => {
                    message += `   ${i + 1}. ${page}\n`;
                });
                message += `\n`;
            }

            if (quoteData.features && quoteData.features.length > 0) {
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                message += `Özellikler:\n`;
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                quoteData.features.forEach((feature, i) => {
                    message += `   ${i + 1}. ✓ ${feature}\n`;
                });
                message += `\n`;
            }

            if (quoteData.deliveryTime) {
                message += `⏱️ Teslimat Süresi: ${quoteData.deliveryTime}\n`;
            }
            if (quoteData.support) {
                message += `🛡️ Destek: ${quoteData.support}\n`;
            }
            if (quoteData.extraPagePrice) {
                message += `➕ ${quoteData.extraPagePrice}\n`;
            }
            if (quoteData.note) {
                message += `\nℹ️ Not: ${quoteData.note}\n`;
            }

        } else if (quoteData.selectedPackage) {
            // Eski paket sistemi (compat)
            message += `SEÇİLEN PAKET: ${quoteData.selectedPackage.name}\n`;
            message += `Paket Fiyatı: ${formatPrice(quoteData.selectedPackage.price)}\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `Paket İçeriği:\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            quoteData.selectedPackage.features.forEach((feature, i) => {
                message += `   ${i + 1}. ✓ ${feature}\n`;
            });
        } else {
            // Manuel seçim
            message += `Seçilen Proje Tipi: ${quoteData.projectType}\n`;
            message += `Temel Fiyat: ${formatPrice(quoteData.projectTypePrice)}\n\n`;

            if (quoteData.features && quoteData.features.length > 0) {
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                message += `Eklenen Özellikler:\n`;
                message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                quoteData.features.forEach((feature, i) => {
                    message += `   ${i + 1}. ✓ ${feature.name} → ${formatPrice(feature.price)}\n`;
                });
                message += `\n`;
            }

            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `Ara Toplam: ${formatPrice(quoteData.total)}\n`;

            if (quoteData.discount > 0) {
                const discountPercent = quoteData.total >= 60000 ? '15%' : '10%';
                message += `İndirim (${discountPercent}): -${formatPrice(quoteData.discount)}\n`;
            }
        }

        const finalPrice = quoteData.price ||
            (quoteData.selectedPackage ? quoteData.selectedPackage.price : quoteData.finalPrice);

        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `BAŞLANGIÇ TOPLAMI: ${formatPrice(finalPrice)}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `\n*Kesin fiyat görüşmede netleştirilecektir.\n\n`;

        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        const userMessage = e.target.message.value;
        let finalMessage = "";

        // Eğer quote data varsa, önce onu ekle
        if (quoteData) {
            finalMessage = generateQuoteMessage();
            if (userMessage.trim()) {
                finalMessage += `MÜŞTERİ NOTU:\n${userMessage}`;
            }
        } else {
            finalMessage = userMessage;
        }

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: finalMessage
        };

        try {
            await apiInstance.post("/contact", data);
            setStatus("✅ Talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
            e.target.reset();

            // Quote data'yı temizle
            setQuoteData(null);
            localStorage.removeItem('quoteData');

            setTimeout(() => setStatus(""), 5000);
        } catch (error) {
            console.error("Submit Error:", error);
            setStatus("✅ Talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.h2
                            className="text-center mb-3"
                            initial={{ opacity: 0, y: 60, scale: 0.85 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.9, ease: [0.6, -0.05, 0.01, 0.99] }}
                            style={{ fontSize: '40px', fontWeight: '700', color: 'var(--text-primary)' }}
                        >
                            {quoteData ? 'Teklif Talebinizi Tamamlayın' : 'İletişime Geçin'}
                        </motion.h2>

                        <motion.p
                            className="text-center mb-5"
                            style={{ color: 'var(--text-secondary)' }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {quoteData
                                ? 'Seçtiğiniz paket bilgileri aşağıda hazır. Sadece iletişim bilgilerinizi girin.'
                                : 'Formu doldurun, size en kısa sürede dönüş yapalım.'}
                        </motion.p>

                        {/* Quote Summary Card */}
                        {quoteData && (
                            <motion.div
                                className="quote-summary-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Remove Button */}
                                <motion.button
                                    onClick={handleRemoveQuote}
                                    className="quote-remove-btn"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Paketi Kaldır"
                                >
                                    <FaTimes />
                                </motion.button>

                                <div className="quote-header">
                                    <h3>Seçtiğiniz Teklif Özeti</h3>
                                </div>

                                <div className="quote-body">
                                    {quoteData.package ? (
                                        // Yeni paket sistemi
                                        <>
                                            <div className="quote-row">
                                                <span className="label">Paket</span>
                                                <span className="value">{quoteData.package}</span>
                                            </div>

                                            <div className="quote-row">
                                                <span className="label">Sayfa Sayısı</span>
                                                <span className="value">{quoteData.pages?.length || 0} Sayfa</span>
                                            </div>

                                            {quoteData.features && quoteData.features.length > 0 && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <p style={{ fontSize: '13px', color: 'var(--brand-main)', marginBottom: '10px', fontWeight: '600' }}>
                                                        Özellikler:
                                                    </p>
                                                    <ul className="quote-features">
                                                        {quoteData.features.slice(0, 5).map((feature, i) => (
                                                            <li key={i}>✓ {feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="quote-info-box">
                                                <div>⏱️ {quoteData.deliveryTime}</div>
                                                {quoteData.extraPagePrice && (
                                                    <div style={{ fontSize: '11px', marginTop: '6px' }}>
                                                        ➕ {quoteData.extraPagePrice}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="quote-total">
                                                <span>Başlangıç Fiyatı</span>
                                                <strong>{formatPrice(quoteData.price)}</strong>
                                            </div>
                                        </>
                                    ) : quoteData.selectedPackage ? (
                                        // Eski paket sistemi
                                        <>
                                            <div className="quote-row">
                                                <span className="label">Paket</span>
                                                <span className="value">{quoteData.selectedPackage.name}</span>
                                            </div>

                                            <ul className="quote-features">
                                                {quoteData.selectedPackage.features.map((feature, i) => (
                                                    <li key={i}>✓ {feature}</li>
                                                ))}
                                            </ul>

                                            <div className="quote-total">
                                                <span>Toplam Tutar</span>
                                                <strong>{formatPrice(quoteData.selectedPackage.price)}</strong>
                                            </div>
                                        </>
                                    ) : (
                                        // Manuel seçim
                                        <>
                                            <div className="quote-row">
                                                <span className="label">Proje Tipi</span>
                                                <span className="value">{quoteData.projectType}</span>
                                            </div>

                                            {quoteData.features?.length > 0 && (
                                                <ul className="quote-features">
                                                    {quoteData.features.map((f, i) => (
                                                        <li key={i}>
                                                            ✓ {f.name} ({formatPrice(f.price)})
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {quoteData.discount > 0 && (
                                                <div className="quote-discount">
                                                    İndirim: -{formatPrice(quoteData.discount)}
                                                </div>
                                            )}

                                            <div className="quote-total">
                                                <span>Toplam Tutar</span>
                                                <strong>{formatPrice(quoteData.finalPrice)}</strong>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="quote-footer">
                                    Bu teklif üzerinden sizinle iletişime geçilecektir. Kesin fiyat görüşmede netleştirilir.
                                </div>
                            </motion.div>
                        )}

                        <motion.form
                            className="contact-form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 80, rotateX: 30 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 1,
                                delay: 0.3,
                                ease: [0.6, -0.05, 0.01, 0.99]
                            }}
                        >
                            <motion.input
                                name="name"
                                className="form-control mb-3"
                                placeholder="Ad Soyad *"
                                required
                                aria-label="Ad Soyad"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                            />
                            <motion.input
                                name="email"
                                type="email"
                                className="form-control mb-3"
                                placeholder="E-posta *"
                                required
                                aria-label="E-posta"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                            />
                            <motion.textarea
                                name="message"
                                className="form-control mb-4"
                                rows="5"
                                placeholder={quoteData
                                    ? "Ek notlarınız (opsiyonel - özel istekler, sorularınız vb.)"
                                    : "Mesajınız (Proje detayları, bütçe, süre vb.) *"}
                                required={!quoteData}
                                aria-label="Mesaj"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.7 }}
                                style={{ color: 'var(--text-primary)' }}
                            />

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-100"
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                                whileHover={{ scale: loading ? 1 : 1.03 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{
                                    background: loading
                                        ? "#3a3a3a"
                                        : "linear-gradient(135deg, var(--brand-main), var(--brand-accent))",
                                    color: loading ? "#888" : "#000",
                                    padding: "16px 20px",
                                    border: "none",
                                    borderRadius: "999px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: loading
                                        ? "none"
                                        : "0 8px 32px rgba(212, 182, 118, 0.4)"
                                }}
                            >
                                {loading ? "🔄 Gönderiliyor..." : "Teklif Talebi Gönder"}
                            </motion.button>

                            {status && (
                                <motion.p
                                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    style={{
                                        textAlign: "center",
                                        marginTop: "20px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: status.includes("✅") ? "#10b981" : "#ef4444",
                                        padding: "14px",
                                        backgroundColor: status.includes("✅")
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(239, 68, 68, 0.1)",
                                        borderRadius: "12px",
                                        border: `1px solid ${status.includes("✅")
                                            ? "rgba(16, 185, 129, 0.3)"
                                            : "rgba(239, 68, 68, 0.3)"}`
                                    }}
                                >
                                    {status}
                                </motion.p>
                            )}
                        </motion.form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
import { useState } from "react";
import apiInstance from "../api/ApiInstance";

const Contact = () => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            const response = await apiInstance.post("/contact", data);
            console.log("API Response:", response);
            setStatus("✅ Talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
            e.target.reset();

            // 5 saniye sonra mesajı temizle
            setTimeout(() => setStatus(""), 5000);
        } catch (error) {
            console.error("Submit Error:", error);
            const errorMsg = error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
            setStatus(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">

                        <h2 className="text-center mb-3">
                            İhtiyacınızı Netleştirelim
                        </h2>

                        <p className="text-center text-muted mb-5">
                            Formu doldurun, size özel hazırlanmış
                            teklif PDF’i mailinize gelsin.
                        </p>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input name="name" className="form-control mb-3" placeholder="Ad Soyad" required />
                            <input name="email" type="email" className="form-control mb-3" placeholder="E-posta" required />
                            <textarea name="message" className="form-control mb-4" rows="4" placeholder="Mesaj" required />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-100"
                                style={{
                                    background: loading ? "#d1d5db" : "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                                    color: "#fff",
                                    padding: "14px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "all 0.3s ease",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "🔄 Gönderiliyor..." : "Teklif Talebi Gönder"}
                            </button>

                            {status && (
                                <p style={{
                                    textAlign: "center",
                                    marginTop: "16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: status.includes("✅") ? "#10b981" : "#ef4444",
                                    padding: "12px",
                                    backgroundColor: status.includes("✅") ? "#ecfdf5" : "#fef2f2",
                                    borderRadius: "8px",
                                    border: `1px solid ${status.includes("✅") ? "#d1fae5" : "#fee2e2"}`
                                }}>{status}</p>
                            )}
                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

import { useState } from "react";
import apiInstance from "../api/ApiInstance";

const Contact = () => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            await apiInstance.post("/contact", data);
            setStatus("✅ Talebiniz başarıyla gönderildi!");
            e.target.reset();
        } catch {
            setStatus("❌ Bir hata oluştu. Lütfen tekrar deneyin.");
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
                                    color: status.includes("✅") ? "#10b981" : "#ef4444"
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

import { useState } from "react";
import apiInstance from "../api/ApiInstance";

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            await apiInstance.post("/contact", data);
            setStatus("Talebiniz başarıyla gönderildi.");
            e.target.reset();
        } catch {
            setStatus("Bir hata oluştu.");
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

                            <button className="btn btn-dark w-100">
                                Teklif Talebi Gönder
                            </button>

                            {status && (
                                <p className="text-center mt-3 small">{status}</p>
                            )}
                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Landing Page Tasarımı",
            description: "Reklam ve dönüşüm odaklı, yüksek performanslı landing page sayfaları."
        },
        {
            id: 2,
            title: "Kurumsal Web Sitesi Geliştirme",
            description: "SEO uyumlu, hızlı ve yönetilebilir kurumsal web siteleri.",
        },
        {
            id: 3,
            title: "Admin Panelli Web Uygulamaları",
            description: "İçeriklerinizi kolayca yönetebileceğiniz özel admin paneller.",
        }
    ];

    return (
        <section id="services" className="services-section">
            <div className="container">
                <h2 className="section-title">Hizmetler</h2>

                <div>
                    {services.map((service) => (
                        <div className="service-card" key={service.id}>

                            <h5>{service.title}</h5>
                            <p className="service-description">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

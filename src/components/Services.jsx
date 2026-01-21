const Services = () => {
    const services = [
        {
            id: 1,
            title: "Landing Page Çözümleri",
            description: "Tek bir hedef için tasarlanmış, sade ve etkili sayfalar.",
        },
        {
            id: 2,
            title: "Kurumsal Web Sitesi",
            description: "Markanızı dijitalde doğru ve güvenilir şekilde temsil edin.",
        },
        {
            id: 3,
            title: "Admin Panelli Kurumsal Web Sitesi",
            description: "İçeriğinizi teknik bilgiye ihtiyaç duymadan yönetin.",
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

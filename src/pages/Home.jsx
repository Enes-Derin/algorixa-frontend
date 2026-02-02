import Navbar from "../components/Navbar";
import Why from "../components/Why";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import SeoContent from "../components/SeoContent";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import FloatingSocial from "../components/FloatingSocial";
import SEO from "../components/Seo";
import LiveChatWidget from "../components/LiveChatWidget";
import HeroPremium from "../components/HeroPremium";
import PortfolioShowcase from "../components/PortfolioShowcase";
import PricingCalculator from "../components/PricingCalculator";
import Projects from "../components/Projects";

const Home = () => {
    return (
        <>
            <SEO
                title="Algorixa - Kurumsal Web Sitesi, Yazılım ve Admin Panel Çözümleri | İstanbul"
                description="İstanbul'da kurumsal web sitesi tasarımı, admin panelli web uygulamaları ve özel yazılım geliştirme hizmetleri. SEO uyumlu, hızlı, güvenilir ve satış odaklı dijital çözümler. İşletmenizi dijitalde büyütün."
                keywords="kurumsal web sitesi, web tasarım istanbul, yazılım şirketi istanbul, admin panel geliştirme, landing page tasarımı, SEO uyumlu web sitesi, e-ticaret sitesi, özel yazılım geliştirme, react web sitesi, dijital ajans istanbul, web yazılım hizmetleri, kurumsal web tasarım, responsive web tasarım, mobil uyumlu web sitesi, profesyonel web tasarım, web sitesi yaptırma, freelance yazılım geliştirici, web uygulama geliştirme, online sipariş sistemi, randevu sistemi, üye yönetim sistemi, CRM yazılımı, işletme yazılımı, dijital dönüşüm, web tabanlı yazılım, bulut tabanlı sistem, API entegrasyonu, modern web teknolojileri, full stack geliştirme"
                url="https://www.algorixa.com.tr"
            />

            <Navbar />
            <FloatingSocial />
            <LiveChatWidget />

            <main>
                <HeroPremium />

                <Why />
                <Services />
                <PortfolioShowcase />
                <Projects />
                {/* <Testimonials /> */}
                <PricingCalculator />
                <SeoContent />
                <Contact />
            </main>

            <Footer />
        </>
    );
};

export default Home;
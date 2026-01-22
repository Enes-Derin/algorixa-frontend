import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import SeoContent from "../components/SeoContent";
import Services from "../components/Services";
import Why from "../components/Why";


const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <SeoContent />
            <Why />
            <Services />
            <Projects />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
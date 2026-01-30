import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Why from "../components/Why";
import SeoContent from "../components/SeoContent";

const Home = () => {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <Why />
                <Services />
                <Projects />
                <SeoContent />
                <Contact />
            </main>

            <Footer />
        </>
    );
};

export default Home;

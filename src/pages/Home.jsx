import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Value from "../components/Value";
import Why from "../components/Why";


const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Value />
            <Services />
            <Projects />
            <Why />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
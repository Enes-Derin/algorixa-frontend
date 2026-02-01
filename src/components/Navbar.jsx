import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenu = () => setOpen(false);

    return (
        <motion.nav
            className={`navbar fixed-top ${scrolled ? "scrolled" : ""}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container">
                <motion.a
                    className="navbar-brand"
                    href="/"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <h1 className="navbar-logo-text">ALGORIXA</h1>
                    <span className="navbar-logo-tagline">Dijital Çözüm Ortağınız</span>
                </motion.a>

                <button
                    className="navbar-toggler text-white"
                    onClick={() => setOpen(!open)}
                    aria-label="Menü"
                >
                    {open ? '✕' : '☰'}
                </button>

                <div className={`navbar-menu ${open ? "show" : ""}`}>
                    <a href="#why" onClick={closeMenu}>Neden Biz</a>
                    <a href="#services" onClick={closeMenu}>Hizmetler</a>
                    <a href="#portfolio" onClick={closeMenu}>Portföy</a>
                    <a href="#pricing" onClick={closeMenu}>Fiyatlar</a>
                    <a href="#contact" className="nav-cta" onClick={closeMenu}>
                        Teklif Al
                    </a>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
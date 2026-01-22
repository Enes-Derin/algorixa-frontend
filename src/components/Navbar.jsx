import Algorixa from "../assets/Algorixa.png";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="container">
                <a className="navbar-brand fw-semibold" href="/">
                    <img src={Algorixa} alt="Algorixa Logo" style={{ height: '36px', marginRight: '8px' }} />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav gap-2">
                        <li className="nav-item">
                            <a className="nav-link" href="#services" onClick={handleNavClick}>Hizmetler</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#projects" onClick={handleNavClick}>Projeler</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#why" onClick={handleNavClick}>Neden Algorixa</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact" onClick={handleNavClick}>İletişim</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

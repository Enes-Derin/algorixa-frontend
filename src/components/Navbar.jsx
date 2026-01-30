import Algorixa from "../assets/Algorixa.png";
import { useState } from "react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar fixed-top">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={Algorixa} alt="Algorixa" />
                </a>

                <button
                    className="navbar-toggler"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                <div className={`navbar-menu ${open ? "show" : ""}`}>
                    <a href="#services">Hizmetler</a>
                    <a href="#projects">Projeler</a>
                    <a href="#why">Neden Algorixa</a>
                    <a href="#contact" className="nav-cta">
                        Teklif Al
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

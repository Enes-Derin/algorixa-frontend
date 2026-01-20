import Algorixa from "../assets/Algorixa.png";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top bg-white border-bottom">
            <div className="container">
                <a className="navbar-brand fw-semibold" href="#">
                    <img src={Algorixa} alt="Algorixa Logo" style={{ height: '40px', marginRight: '10px' }} />

                </a>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="nav" className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav gap-3">
                        <li className="nav-item">
                            <a className="nav-link" href="#services">Hizmetler</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#projects">Projeler</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#why">Neden Softra</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">İletişim</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

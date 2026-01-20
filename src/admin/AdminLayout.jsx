import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "./admin.css";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-wrapper">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">Algorixa</div>

                <ul className="sidebar-menu">
                    <li>
                        <a
                            href="/admin"
                            className={isActive("/admin")}
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/projects"
                            className={isActive("/admin/projects")}
                        >
                            Projeler
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/messages"
                            className={isActive("/admin/messages")}
                        >
                            İletişim Mesajları
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                            style={{ marginTop: "30px", color: "#ff6b6b" }}
                        >
                            Çıkış Yap
                        </a>
                    </li>
                </ul>
            </aside>

            {/* MAIN */}
            <main className="admin-main">
                <header className="admin-header">
                    <span>Yönetim Paneli</span>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

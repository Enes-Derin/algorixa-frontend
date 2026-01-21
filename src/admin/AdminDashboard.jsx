import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactMessages } from "../redux/contactSlice";
import { fetchProjects } from "../redux/projectSlice";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { items: messages = [] } = useSelector(state => state.contact);
    const { projects = [] } = useSelector(state => state.project);

    useEffect(() => {
        dispatch(fetchContactMessages());
        dispatch(fetchProjects());
    }, [dispatch]);

    const messageCount = messages.length;
    const projectCount = projects.length;

    return (
        <>
            <h1 className="page-title">📊 Dashboard</h1>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="stat-card">
                        <h6>💬 Gelen Mesajlar</h6>
                        <span className="stat-number">{messageCount}</span>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <h6>📱 Yayınlanan Projeler</h6>
                        <span className="stat-number">{projectCount}</span>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h4 style={{ marginBottom: "20px" }}>⚡ Hızlı Erişim</h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="card p-4 text-center" style={{ borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                            <h5>➕ Yeni Proje Ekle</h5>
                            <p style={{ color: "#777", marginBottom: "12px" }}>Portföyünüze yeni proje ekleyin</p>
                            <a href="/admin/projects" className="btn btn-dark">Projelere Git</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 text-center" style={{ borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                            <h5>📧 İletişim Mesajları</h5>
                            <p style={{ color: "#777", marginBottom: "12px" }}>Gelen mesajları görüntüleyin</p>
                            <a href="/admin/messages" className="btn btn-dark">Mesajlara Git</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
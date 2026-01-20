import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../redux/dashboardSlice";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { totalVisits, messageCount, projectCount, loading } =
        useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="page-title">Dashboard</h1>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="stat-card">
                        <h6>Toplam Ziyaretçi</h6>
                        <span className="stat-number">{totalVisits || 0}</span>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <h6>Gelen Mesajlar</h6>
                        <span className="stat-number">{messageCount || 0}</span>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <h6>Yayınlanan Projeler</h6>
                        <span className="stat-number">{projectCount || 0}</span>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h4 style={{ marginBottom: "20px" }}>Hızlı Erişim</h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="card p-4 text-center">
                            <h5>Yeni Proje Ekle</h5>
                            <p style={{ color: "#777", marginBottom: "12px" }}>Portföyünüze yeni proje ekleyin</p>
                            <a href="/admin/projects" className="btn btn-dark">Projelere Git</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 text-center">
                            <h5>İletişim Mesajları</h5>
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
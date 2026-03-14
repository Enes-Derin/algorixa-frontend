// pages/admin/AdminDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../redux/dashboardSlice";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector(state => state.dashboard);

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

            {/* Blog Stats */}
            <div className="stat-section">
                <h5 style={{ marginBottom: "16px", color: "#666" }}>Blog İstatistikleri</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Toplam Yazı</h6>
                            <span className="stat-number">{stats.totalBlogPosts || 0}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Yayında</h6>
                            <span className="stat-number" style={{ color: "#10b981" }}>
                                {stats.publishedPosts || 0}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Taslak</h6>
                            <span className="stat-number" style={{ color: "#f59e0b" }}>
                                {stats.draftPosts || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Stats */}
            <div className="stat-section" style={{ marginTop: "32px" }}>
                <h5 style={{ marginBottom: "16px", color: "#666" }}>Portföy İstatistikleri</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Toplam Proje</h6>
                            <span className="stat-number">{stats.totalProjects || 0}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Yayında</h6>
                            <span className="stat-number" style={{ color: "#10b981" }}>
                                {stats.publishedProjects || 0}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Öne Çıkan</h6>
                            <span className="stat-number" style={{ color: "#c8a84b" }}>
                                {stats.featuredProjects || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Stats */}
            <div className="stat-section" style={{ marginTop: "32px" }}>
                <h5 style={{ marginBottom: "16px", color: "#666" }}>İletişim İstatistikleri</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Yeni Mesaj</h6>
                            <span className="stat-number" style={{ color: "#3b82f6" }}>
                                {stats.newContactSubmissions || 0}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Okunmamış</h6>
                            <span className="stat-number" style={{ color: "#ef4444" }}>
                                {stats.unreadContacts || 0}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <h6>Aktif Kampanya</h6>
                            <span className="stat-number" style={{ color: "#8b5cf6" }}>
                                {stats.activeCampaigns || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Blog Posts */}
            {stats.popularBlogPosts && stats.popularBlogPosts.length > 0 && (
                <div className="stat-section" style={{ marginTop: "32px" }}>
                    <h5 style={{ marginBottom: "16px", color: "#666" }}>Popüler Blog Yazıları</h5>
                    <div className="card" style={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
                        <div className="card-body" style={{ padding: "20px" }}>
                            {stats.popularBlogPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom: index < stats.popularBlogPosts.length - 1 ? "1px solid #f3f4f6" : "none"
                                    }}
                                >
                                    <div>
                                        <strong style={{ fontSize: "14px" }}>{post.title}</strong>
                                        <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                            {post.category}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "18px", fontWeight: "600", color: "#c8a84b" }}>
                                            {post.viewCount}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#999" }}>görüntülenme</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity && stats.recentActivity.length > 0 && (
                <div className="stat-section" style={{ marginTop: "32px" }}>
                    <h5 style={{ marginBottom: "16px", color: "#666" }}>Son Aktiviteler</h5>
                    <div className="card" style={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
                        <div className="card-body" style={{ padding: "20px" }}>
                            {stats.recentActivity.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        padding: "12px 0",
                                        borderBottom: index < stats.recentActivity.length - 1 ? "1px solid #f3f4f6" : "none"
                                    }}
                                >
                                    <div style={{ fontSize: "20px" }}>
                                        {activity.actionType === "CREATE" && "➕"}
                                        {activity.actionType === "UPDATE" && "✏️"}
                                        {activity.actionType === "DELETE" && "🗑️"}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "14px" }}>
                                            <strong>{activity.actionType}</strong> - {activity.entityType}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                            {new Date(activity.createdAt).toLocaleString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-5">
                <h4 style={{ marginBottom: "20px" }}>Hızlı Erişim</h4>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/blog" className="quick-action-card">
                            <h5>Blog Yönetimi</h5>
                            <p>Yazı ekle, düzenle</p>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/portfolio" className="quick-action-card">
                            <h5>Portföy</h5>
                            <p>Proje yönetimi</p>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/pricing" className="quick-action-card">
                            <h5>Fiyatlandırma</h5>
                            <p>Paket yönetimi</p>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/messages" className="quick-action-card">
                            <h5>Mesajlar</h5>
                            <p>İletişim mesajları</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
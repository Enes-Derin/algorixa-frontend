// pages/admin/AdminSettings.jsx - ✅ YENİ
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSetting, deleteSetting } from "../redux/settingsSlice";

// Ayar kategorileri
const SETTING_CATEGORIES = {
    contact: {
        title: "📧 İletişim Bilgileri",
        settings: [
            { key: "site.email", label: "E-posta", placeholder: "info@algorixa.com.tr" },
            { key: "site.phone", label: "Telefon", placeholder: "+90 546 970 54 51" },
            { key: "site.address", label: "Adres", placeholder: "İstanbul, Türkiye" },
        ]
    },
    social: {
        title: "📱 Sosyal Medya",
        settings: [
            { key: "site.social.instagram", label: "Instagram URL", placeholder: "https://instagram.com/algorixa" },
            { key: "site.social.linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/algorixa" },
            { key: "site.social.whatsapp", label: "WhatsApp", placeholder: "+90 546 970 54 51" },
        ]
    },
    homeStats: {
        title: "📊 Ana Sayfa İstatistikleri",
        settings: [
            { key: "home.stats.projects", label: "Tamamlanan Proje", placeholder: "150+" },
            { key: "home.stats.clients", label: "Mutlu Müşteri", placeholder: "80+" },
            { key: "home.stats.experience", label: "Deneyim (Yıl)", placeholder: "7+" },
            { key: "home.stats.satisfaction", label: "Müşteri Memnuniyeti", placeholder: "100%" },
        ]
    },
    about: {
        title: "ℹ️ Hakkımızda Sayfası",
        settings: [
            { key: "about.hero.title", label: "Hero Başlık", placeholder: "Kurumsal Dijital Çözüm Ortağı", type: "text" },
            { key: "about.hero.subtitle", label: "Hero Alt Başlık", placeholder: "2018'den beri...", type: "textarea" },
            { key: "about.founder.name", label: "Kurucu Adı", placeholder: "Enes Derin" },
            { key: "about.founder.title", label: "Kurucu Ünvanı", placeholder: "Kurucu & Yazılım Geliştirici" },
            { key: "about.founder.bio", label: "Kurucu Biyografi", placeholder: "...", type: "textarea" },
        ]
    },
    seo: {
        title: "🔍 SEO Ayarları",
        settings: [
            { key: "seo.defaultTitle", label: "Varsayılan Başlık", placeholder: "Algorixa - Web Yazılım Çözümleri" },
            { key: "seo.defaultDescription", label: "Varsayılan Açıklama", placeholder: "...", type: "textarea" },
            { key: "seo.keywords", label: "Anahtar Kelimeler", placeholder: "web yazılım, istanbul, ...", type: "textarea" },
        ]
    }
};

const AdminSettings = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector(state => state.settings);

    const [editingKey, setEditingKey] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Tüm ayar key'lerini topla
        const allKeys = Object.values(SETTING_CATEGORIES)
            .flatMap(cat => cat.settings.map(s => s.key));

        dispatch(fetchSettings(allKeys));
    }, [dispatch]);

    const handleEdit = (key, currentValue) => {
        setEditingKey(key);
        setEditValue(currentValue || "");
    };

    const handleSave = async () => {
        if (!editingKey) return;

        setError(null);
        setSuccess(null);

        try {
            await dispatch(updateSetting({ key: editingKey, value: editValue })).unwrap();
            setSuccess("Ayar başarıyla güncellendi!");
            setEditingKey(null);
            setEditValue("");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + err);
        }
    };

    const handleCancel = () => {
        setEditingKey(null);
        setEditValue("");
    };

    const handleDelete = async (key) => {
        if (!confirm(`"${key}" ayarını silmek istediğinizden emin misiniz?`)) return;

        try {
            await dispatch(deleteSetting(key)).unwrap();
            setSuccess("Ayar başarıyla silindi!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Silme hatası: " + err);
        }
    };

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
            <h1 className="page-title">⚙️ Genel Ayarlar</h1>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {Object.entries(SETTING_CATEGORIES).map(([catKey, category]) => (
                <div key={catKey} className="admin-form" style={{ marginBottom: "32px" }}>
                    <h5 style={{ marginBottom: "20px" }}>{category.title}</h5>

                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th style={{ width: "30%" }}>Ayar</th>
                                <th style={{ width: "50%" }}>Değer</th>
                                <th style={{ width: "20%" }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.settings.map(setting => {
                                const currentValue = settings[setting.key];
                                const isEditing = editingKey === setting.key;

                                return (
                                    <tr key={setting.key}>
                                        <td>
                                            <strong>{setting.label}</strong>
                                            <div style={{ fontSize: "11px", color: "#999", fontFamily: "monospace" }}>
                                                {setting.key}
                                            </div>
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                setting.type === "textarea" ? (
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        placeholder={setting.placeholder}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        placeholder={setting.placeholder}
                                                    />
                                                )
                                            ) : (
                                                <div style={{
                                                    padding: "8px 12px",
                                                    background: currentValue ? "#f9fafb" : "#fff3cd",
                                                    borderRadius: "6px",
                                                    fontSize: "14px"
                                                }}>
                                                    {currentValue || (
                                                        <em style={{ color: "#856404" }}>
                                                            Ayarlanmamış (Varsayılan: {setting.placeholder})
                                                        </em>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-dark"
                                                        onClick={handleSave}
                                                        style={{ marginRight: "4px" }}
                                                    >
                                                        💾 Kaydet
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={handleCancel}
                                                    >
                                                        ✕ İptal
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() => handleEdit(setting.key, currentValue)}
                                                        style={{ marginRight: "4px" }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    {currentValue && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(setting.key)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}

            <div className="alert alert-info" style={{ marginTop: "40px" }}>
                <strong>💡 Not:</strong> Boş bırakılan ayarlar için varsayılan değerler kullanılır.
                Ayarları sildiğinizde sistem otomatik olarak varsayılan değerlere döner.
            </div>
        </>
    );
};

export default AdminSettings;
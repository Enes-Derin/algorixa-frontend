// pages/admin/AdminMaintenance.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPlans,
    createPlan,
    updatePlan,
    deletePlan
} from "../redux/maintenanceSlice";

const AdminMaintenance = () => {
    const dispatch = useDispatch();
    const { plans, loading } = useSelector(state => state.maintenance);

    const [form, setForm] = useState({
        planCode: "",
        iconName: "",
        badgeText: "",
        name: "",
        monthlyPrice: "",
        idealFor: "",
        isBestSeller: false,
        displayOrder: 0,
        status: "ACTIVE",
        features: []
    });

    const [editingId, setEditingId] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Geçici input state
    const [featureInput, setFeatureInput] = useState("");

    useEffect(() => {
        dispatch(fetchAllPlans());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Feature ekle
    const addFeature = () => {
        if (featureInput.trim()) {
            setForm({
                ...form,
                features: [...form.features, {
                    featureText: featureInput,
                    displayOrder: form.features.length
                }]
            });
            setFeatureInput("");
        }
    };

    const removeFeature = (index) => {
        setForm({
            ...form,
            features: form.features.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.planCode || !form.name || !form.monthlyPrice) {
            setError("Plan kodu, isim ve fiyat zorunludur");
            return;
        }

        try {
            if (editingId) {
                await dispatch(updatePlan({ id: editingId, planData: form })).unwrap();
                setSuccess("Plan başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createPlan(form)).unwrap();
                setSuccess("Plan başarıyla oluşturuldu!");
            }
            resetForm();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + err.message);
        }
    };

    const resetForm = () => {
        setForm({
            planCode: "",
            iconName: "",
            badgeText: "",
            name: "",
            monthlyPrice: "",
            idealFor: "",
            isBestSeller: false,
            displayOrder: 0,
            status: "ACTIVE",
            features: []
        });
    };

    const handleEdit = (plan) => {
        setEditingId(plan.id);
        setForm({
            planCode: plan.planCode,
            iconName: plan.iconName || "",
            badgeText: plan.badgeText || "",
            name: plan.name,
            monthlyPrice: plan.monthlyPrice,
            idealFor: plan.idealFor || "",
            isBestSeller: plan.isBestSeller || false,
            displayOrder: plan.displayOrder || 0,
            status: plan.status || "ACTIVE",
            features: plan.features || []
        });
    };

    const handleDelete = (id) => {
        if (confirm("Bu planı silmek istediğinizden emin misiniz?")) {
            dispatch(deletePlan(id));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    return (
        <>
            <h1 className="page-title">Bakım Planları Yönetimi</h1>

            {/* CREATE/UPDATE FORM */}
            <div className="admin-form">
                <h5 style={{ marginBottom: "20px" }}>
                    {editingId ? "Planı Düzenle" : "Yeni Plan Ekle"}
                </h5>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Plan Kodu * (Unique)</label>
                                <input
                                    type="text"
                                    name="planCode"
                                    className="form-control"
                                    placeholder="BASIC_SUPPORT"
                                    value={form.planCode}
                                    onChange={handleChange}
                                    required
                                    disabled={editingId}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Plan Adı *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Temel Bakım"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Aylık Fiyat (₺) *</label>
                                <input
                                    type="text"
                                    name="monthlyPrice"
                                    className="form-control"
                                    placeholder="990"
                                    value={form.monthlyPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">İdeal Kullanıcı</label>
                                <input
                                    type="text"
                                    name="idealFor"
                                    className="form-control"
                                    placeholder="Küçük ve orta ölçekli işletmeler"
                                    value={form.idealFor}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Badge Metni</label>
                                <input
                                    type="text"
                                    name="badgeText"
                                    className="form-control"
                                    placeholder="En Popüler"
                                    value={form.badgeText}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">İkon Adı</label>
                                <input
                                    type="text"
                                    name="iconName"
                                    className="form-control"
                                    placeholder="Shield"
                                    value={form.iconName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Özellikler */}
                    <div className="mb-3">
                        <label className="form-label">Özellikler</label>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Aylık güvenlik güncellemeleri"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-dark"
                                onClick={addFeature}
                            >
                                Ekle
                            </button>
                        </div>
                        <div className="tag-list">
                            {form.features.map((feature, index) => (
                                <span key={index} className="tag-item">
                                    {feature.featureText}
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="tag-remove"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Ayarlar */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Sıralama</label>
                                <input
                                    type="number"
                                    name="displayOrder"
                                    className="form-control"
                                    value={form.displayOrder}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Durum</label>
                                <select
                                    name="status"
                                    className="form-control"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="INACTIVE">Pasif</option>
                                    <option value="ARCHIVED">Arşiv</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <div className="form-check" style={{ marginTop: "32px" }}>
                                    <input
                                        type="checkbox"
                                        name="isBestSeller"
                                        className="form-check-input"
                                        id="planBestSeller"
                                        checked={form.isBestSeller}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="planBestSeller">
                                        En Çok Satan
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-dark">
                        {editingId ? "Güncelle" : " Plan Ekle"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={handleCancel}
                            style={{ marginLeft: "8px" }}
                        >
                            ✕ İptal
                        </button>
                    )}
                </form>
            </div>

            {/* PLANS LIST */}
            <h5 style={{ marginTop: "40px", marginBottom: "20px" }}>
                Bakım Planları ({plans.length})
            </h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            ) : plans.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz plan eklenmemiş</h5>
                    <p>Yukarıdaki formu kullanarak yeni bir plan ekleyiniz</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Plan Kodu</th>
                                <th>Plan Adı</th>
                                <th>Aylık Fiyat</th>
                                <th>Durum</th>
                                <th>Best Seller</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map(plan => (
                                <tr key={plan.id}>
                                    <td>
                                        <code style={{ fontSize: "12px" }}>{plan.planCode}</code>
                                    </td>
                                    <td>
                                        <strong>{plan.name}</strong>
                                        {plan.badgeText && (
                                            <span className="badge bg-success ms-2" style={{ fontSize: "10px" }}>
                                                {plan.badgeText}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <strong style={{ color: "#c8a84b" }}>₺{plan.monthlyPrice}</strong>
                                        <span style={{ fontSize: "12px", color: "#999" }}> /ay</span>
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                background:
                                                    plan.status === "ACTIVE" ? "#10b981" :
                                                        plan.status === "INACTIVE" ? "#f59e0b" : "#6b7280"
                                            }}
                                        >
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td>
                                        {plan.isBestSeller ? "⭐" : "—"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={() => handleEdit(plan)}
                                            style={{ marginRight: "4px" }}
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(plan.id)}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default AdminMaintenance;
// pages/admin/AdminPricing.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPackages,
    createPackage,
    updatePackage,
    deletePackage
} from "../redux/pricingSlice";

const AdminPricing = () => {
    const dispatch = useDispatch();
    const { packages, loading } = useSelector(state => state.pricing);

    const [form, setForm] = useState({
        packageCode: "",
        iconName: "",
        badgeText: "",
        name: "",
        tagline: "",
        originalPrice: "",
        currentPrice: "",
        priceNote: "",
        discountPercentage: 0,
        deliveryTime: "",
        revisionCount: 0,
        supportDays: 0,
        isFeatured: false,
        displayOrder: 0,
        status: "ACTIVE",
        features: [],
        notes: []
    });

    const [editingId, setEditingId] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Geçici input state'leri
    const [featureInput, setFeatureInput] = useState("");
    const [isMainFeature, setIsMainFeature] = useState(false);
    const [noteInput, setNoteInput] = useState("");
    const [noteType, setNoteType] = useState("NEUTRAL");

    useEffect(() => {
        dispatch(fetchAllPackages());
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
                    isMainFeature: isMainFeature,
                    displayOrder: form.features.length
                }]
            });
            setFeatureInput("");
            setIsMainFeature(false);
        }
    };

    const removeFeature = (index) => {
        setForm({
            ...form,
            features: form.features.filter((_, i) => i !== index)
        });
    };

    // Note ekle
    const addNote = () => {
        if (noteInput.trim()) {
            setForm({
                ...form,
                notes: [...form.notes, {
                    noteType: noteType,
                    noteText: noteInput
                }]
            });
            setNoteInput("");
            setNoteType("NEUTRAL");
        }
    };

    const removeNote = (index) => {
        setForm({
            ...form,
            notes: form.notes.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.packageCode || !form.name || !form.currentPrice) {
            setError("Paket kodu, isim ve fiyat zorunludur");
            return;
        }

        try {
            if (editingId) {
                await dispatch(updatePackage({ id: editingId, packageData: form })).unwrap();
                setSuccess("Paket başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createPackage(form)).unwrap();
                setSuccess("Paket başarıyla oluşturuldu!");
            }
            resetForm();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + err.message);
        }
    };

    const resetForm = () => {
        setForm({
            packageCode: "",
            iconName: "",
            badgeText: "",
            name: "",
            tagline: "",
            originalPrice: "",
            currentPrice: "",
            priceNote: "",
            discountPercentage: 0,
            deliveryTime: "",
            revisionCount: 0,
            supportDays: 0,
            isFeatured: false,
            displayOrder: 0,
            status: "ACTIVE",
            features: [],
            notes: []
        });
    };

    const handleEdit = (pkg) => {
        setEditingId(pkg.id);
        setForm({
            packageCode: pkg.packageCode,
            iconName: pkg.iconName || "",
            badgeText: pkg.badgeText || "",
            name: pkg.name,
            tagline: pkg.tagline || "",
            originalPrice: pkg.originalPrice || "",
            currentPrice: pkg.currentPrice,
            priceNote: pkg.priceNote || "",
            discountPercentage: pkg.discountPercentage || 0,
            deliveryTime: pkg.deliveryTime || "",
            revisionCount: pkg.revisionCount || 0,
            supportDays: pkg.supportDays || 0,
            isFeatured: pkg.isFeatured || false,
            displayOrder: pkg.displayOrder || 0,
            status: pkg.status || "ACTIVE",
            features: pkg.features || [],
            notes: pkg.notes || []
        });
    };

    const handleDelete = (id) => {
        if (confirm("Bu paketi silmek istediğinizden emin misiniz?")) {
            dispatch(deletePackage(id));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    return (
        <>
            <h1 className="page-title">Fiyatlandırma Yönetimi</h1>

            {/* CREATE/UPDATE FORM */}
            <div className="admin-form">
                <h5 style={{ marginBottom: "20px" }}>
                    {editingId ? "Paketi Düzenle" : "Yeni Paket Ekle"}
                </h5>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Paket Kodu * (Unique)</label>
                                <input
                                    type="text"
                                    name="packageCode"
                                    className="form-control"
                                    placeholder="LANDING_BASIC"
                                    value={form.packageCode}
                                    onChange={handleChange}
                                    required
                                    disabled={editingId} // Kod değiştirilemez
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Paket Adı *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Landing Page"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
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
                                    placeholder="Hızlı Başlangıç"
                                    value={form.badgeText}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tagline</label>
                        <input
                            type="text"
                            name="tagline"
                            className="form-control"
                            placeholder="Tek sayfa. Net mesaj. Hızlı dönüşüm."
                            value={form.tagline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Eski Fiyat (₺)</label>
                                <input
                                    type="text"
                                    name="originalPrice"
                                    className="form-control"
                                    placeholder="10900"
                                    value={form.originalPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Güncel Fiyat (₺) *</label>
                                <input
                                    type="text"
                                    name="currentPrice"
                                    className="form-control"
                                    placeholder="7900"
                                    value={form.currentPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">İndirim %</label>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    className="form-control"
                                    value={form.discountPercentage}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Fiyat Notu</label>
                                <input
                                    type="text"
                                    name="priceNote"
                                    className="form-control"
                                    placeholder="başlayan fiyatlarla"
                                    value={form.priceNote}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Teslimat Süresi</label>
                                <input
                                    type="text"
                                    name="deliveryTime"
                                    className="form-control"
                                    placeholder="5-7 iş günü"
                                    value={form.deliveryTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Revizyon Sayısı</label>
                                <input
                                    type="number"
                                    name="revisionCount"
                                    className="form-control"
                                    value={form.revisionCount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Destek Günü</label>
                                <input
                                    type="number"
                                    name="supportDays"
                                    className="form-control"
                                    placeholder="30"
                                    value={form.supportDays}
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
                                placeholder="Markanıza özel modern tasarım"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    checked={isMainFeature}
                                    onChange={(e) => setIsMainFeature(e.target.checked)}
                                    style={{ marginRight: "6px" }}
                                />
                                Ana Özellik
                            </div>
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
                                <span
                                    key={index}
                                    className="tag-item"
                                    style={{
                                        background: feature.isMainFeature ? "#c8a84b" : "#f3f4f6",
                                        color: feature.isMainFeature ? "#fff" : "#111"
                                    }}
                                >
                                    {feature.isMainFeature && "⭐ "}
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

                    {/* Notlar */}
                    <div className="mb-3">
                        <label className="form-label">Notlar</label>
                        <div className="input-group mb-2">
                            <select
                                className="form-control"
                                style={{ maxWidth: "150px" }}
                                value={noteType}
                                onChange={(e) => setNoteType(e.target.value)}
                            >
                                <option value="NEUTRAL">Neutral</option>
                                <option value="SUCCESS">Success</option>
                                <option value="WARN">Warning</option>
                            </select>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Not metni"
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNote())}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-dark"
                                onClick={addNote}
                            >
                                Ekle
                            </button>
                        </div>
                        <div className="tag-list">
                            {form.notes.map((note, index) => (
                                <span
                                    key={index}
                                    className="tag-item"
                                    style={{
                                        background:
                                            note.noteType === "SUCCESS" ? "#d1fae5" :
                                                note.noteType === "WARN" ? "#fed7aa" : "#f3f4f6",
                                        color: "#111"
                                    }}
                                >
                                    [{note.noteType}] {note.noteText}
                                    <button
                                        type="button"
                                        onClick={() => removeNote(index)}
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
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">İkon Adı</label>
                                <input
                                    type="text"
                                    name="iconName"
                                    className="form-control"
                                    placeholder="Zap"
                                    value={form.iconName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
                            <div className="mb-3">
                                <div className="form-check" style={{ marginTop: "32px" }}>
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        className="form-check-input"
                                        id="packageFeatured"
                                        checked={form.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="packageFeatured">
                                        Öne Çıkan Paket
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-dark">
                        {editingId ? "Güncelle" : "Paket Ekle"}
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

            {/* PACKAGES LIST */}
            <h5 style={{ marginTop: "40px", marginBottom: "20px" }}>
                Paketler ({packages.length})
            </h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            ) : packages.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz paket eklenmemiş</h5>
                    <p>Yukarıdaki formu kullanarak yeni bir paket ekleyiniz</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Paket Kodu</th>
                                <th>Paket Adı</th>
                                <th>Fiyat</th>
                                <th>Durum</th>
                                <th>Öne Çıkan</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(pkg => (
                                <tr key={pkg.id}>
                                    <td>
                                        <code style={{ fontSize: "12px" }}>{pkg.packageCode}</code>
                                    </td>
                                    <td>
                                        <strong>{pkg.name}</strong>
                                        {pkg.badgeText && (
                                            <span className="badge bg-warning ms-2" style={{ fontSize: "10px" }}>
                                                {pkg.badgeText}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {pkg.originalPrice && (
                                            <del style={{ color: "#999", marginRight: "8px" }}>
                                                ₺{pkg.originalPrice}
                                            </del>
                                        )}
                                        <strong style={{ color: "#c8a84b" }}>₺{pkg.currentPrice}</strong>
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                background:
                                                    pkg.status === "ACTIVE" ? "#10b981" :
                                                        pkg.status === "INACTIVE" ? "#f59e0b" : "#6b7280"
                                            }}
                                        >
                                            {pkg.status}
                                        </span>
                                    </td>
                                    <td>
                                        {pkg.isFeatured ? "⭐" : "—"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={() => handleEdit(pkg)}
                                            style={{ marginRight: "4px" }}
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(pkg.id)}
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

export default AdminPricing;
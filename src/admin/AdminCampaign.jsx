import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    activateCampaign,
    deactivateCampaign
} from "../redux/campaignSlice";

// "2024-01-15" → "2024-01-15T00:00:00" (LocalDateTime için)
const toLocalDateTime = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("T")) return dateStr;
    return dateStr + "T00:00:00";
};

// "2024-01-15T00:00:00" → "2024-01-15" (input[type=date] için)
const toDateInput = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    return dateTimeStr.split("T")[0];
};

const AdminCampaign = () => {
    const dispatch = useDispatch();
    const { campaigns, loading } = useSelector(state => state.campaign);

    const [form, setForm] = useState({
        campaignName: "",
        description: "",
        startDate: "",
        endDate: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        isActive: false,
        promoBarTitle: "",
        promoBarDescription: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchAllCampaigns());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.campaignName || !form.startDate || !form.endDate) {
            setError("Kampanya adı, başlangıç ve bitiş tarihi zorunludur");
            return;
        }

        // startDate/endDate → LocalDateTime formatına çevir
        const payload = {
            ...form,
            startDate: toLocalDateTime(form.startDate),
            endDate: toLocalDateTime(form.endDate),
            discountValue: Number(form.discountValue)
        };

        try {
            if (editingId) {
                await dispatch(updateCampaign({ id: editingId, campaignData: payload })).unwrap();
                setSuccess("Kampanya başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createCampaign(payload)).unwrap();
                setSuccess("Kampanya başarıyla oluşturuldu!");
            }
            resetForm();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + (err?.message || err));
        }
    };

    const resetForm = () => {
        setForm({
            campaignName: "",
            description: "",
            startDate: "",
            endDate: "",
            discountType: "PERCENTAGE",
            discountValue: 0,
            isActive: false,
            promoBarTitle: "",
            promoBarDescription: ""
        });
    };

    const handleEdit = (campaign) => {
        setEditingId(campaign.id);
        setForm({
            campaignName: campaign.campaignName,
            description: campaign.description || "",
            startDate: toDateInput(campaign.startDate),
            endDate: toDateInput(campaign.endDate),
            discountType: campaign.discountType,
            discountValue: campaign.discountValue,
            isActive: campaign.isActive,
            promoBarTitle: campaign.promoBarTitle || "",
            promoBarDescription: campaign.promoBarDescription || ""
        });
    };

    const handleDelete = (id) => {
        if (confirm("Bu kampanyayı silmek istediğinizden emin misiniz?")) {
            dispatch(deleteCampaign(id));
        }
    };

    const handleToggleActive = (id, isActive) => {
        if (isActive) {
            dispatch(deactivateCampaign(id));
        } else {
            dispatch(activateCampaign(id));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    return (
        <>
            <h1 className="page-title"> Kampanya Yönetimi</h1>

            <div className="admin-form">
                <h5 style={{ marginBottom: "20px" }}>
                    {editingId ? " Kampanyayı Düzenle" : " Yeni Kampanya Ekle"}
                </h5>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Kampanya Adı *</label>
                                <input type="text" name="campaignName" className="form-control"
                                    placeholder="Yaz Kampanyası 2025" value={form.campaignName}
                                    onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Açıklama</label>
                                <input type="text" name="description" className="form-control"
                                    placeholder="Tüm paketlerde %30 indirim" value={form.description}
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Başlangıç Tarihi *</label>
                                <input type="date" name="startDate" className="form-control"
                                    value={form.startDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Bitiş Tarihi *</label>
                                <input type="date" name="endDate" className="form-control"
                                    value={form.endDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">İndirim Tipi</label>
                                <select name="discountType" className="form-control"
                                    value={form.discountType} onChange={handleChange}>
                                    <option value="PERCENTAGE">Yüzde (%)</option>
                                    <option value="FIXED_AMOUNT">Sabit Tutar (₺)</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">İndirim Değeri</label>
                                <input type="number" name="discountValue" className="form-control"
                                    placeholder={form.discountType === "PERCENTAGE" ? "30" : "500"}
                                    value={form.discountValue} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Promo Bar Başlığı</label>
                                <input type="text" name="promoBarTitle" className="form-control"
                                    placeholder=" Özel Kampanya" value={form.promoBarTitle}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Promo Bar Açıklaması</label>
                                <input type="text" name="promoBarDescription" className="form-control"
                                    placeholder="Tüm paketlerde %30 indirim!" value={form.promoBarDescription}
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="form-check">
                            <input type="checkbox" name="isActive" className="form-check-input"
                                id="campaignActive" checked={form.isActive} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="campaignActive">
                                Kampanyayı Aktifleştir
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-dark">
                        {editingId ? " Güncelle" : " Kampanya Ekle"}
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-outline-dark"
                            onClick={handleCancel} style={{ marginLeft: "8px" }}>
                            İptal
                        </button>
                    )}
                </form>
            </div>

            <h5 style={{ marginTop: "40px", marginBottom: "20px" }}>
                Kampanyalar ({campaigns.length})
            </h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                </div>
            ) : campaigns.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz kampanya eklenmemiş</h5>
                    <p>Yukarıdaki formu kullanarak yeni bir kampanya ekleyiniz</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Kampanya Adı</th>
                                <th>Tarih Aralığı</th>
                                <th>İndirim</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map(campaign => (
                                <tr key={campaign.id}>
                                    <td>
                                        <strong>{campaign.campaignName}</strong>
                                        {campaign.description && (
                                            <div style={{ fontSize: "12px", color: "#999" }}>
                                                {campaign.description}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ fontSize: "13px" }}>
                                        {toDateInput(campaign.startDate)} — {toDateInput(campaign.endDate)}
                                    </td>
                                    <td>
                                        {campaign.discountType === "PERCENTAGE"
                                            ? `%${campaign.discountValue}`
                                            : `₺${campaign.discountValue}`}
                                    </td>
                                    <td>
                                        <span className="badge" style={{
                                            background: campaign.isActive ? "#10b981" : "#6b7280"
                                        }}>
                                            {campaign.isActive ? "AKTİF" : "PASİF"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-dark"
                                            onClick={() => handleEdit(campaign)}
                                            style={{ marginRight: "4px" }}>Düzenle</button>
                                        <button className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(campaign.id)}>Sil</button>
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

export default AdminCampaign;
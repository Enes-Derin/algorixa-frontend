import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectFeatured
} from "../redux/portfolioSlice";

const AdminPortfolio = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector(state => state.portfolio);

    const emptyForm = {
        category: "",
        title: "",
        projectType: "",
        description: "",
        problemStatement: "",
        solutionStatement: "",
        backgroundGradientA: "#1b1916",
        backgroundGradientB: "#2a2518",
        liveUrl: "",
        isFeatured: false,
        displayOrder: 0,
        status: "PUBLISHED",
        results: [],
        features: [],
        techStack: [],
        imageUrl: null
    };

    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const [resultInput, setResultInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [techInput, setTechInput] = useState("");

    useEffect(() => {
        dispatch(fetchAllProjects());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Dosya boyutu 2MB'dan küçük olmalıdır");
            e.target.value = "";
            return;
        }
        setForm(f => ({ ...f, imageUrl: file }));
    };

    const addResult = () => {
        if (!resultInput.trim()) return;
        setForm(f => ({ ...f, results: [...f.results, { resultText: resultInput.trim(), displayOrder: f.results.length }] }));
        setResultInput("");
    };
    const removeResult = (i) => setForm(f => ({ ...f, results: f.results.filter((_, idx) => idx !== i) }));

    const addFeature = () => {
        if (!featureInput.trim()) return;
        setForm(f => ({ ...f, features: [...f.features, { featureText: featureInput.trim(), displayOrder: f.features.length }] }));
        setFeatureInput("");
    };
    const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

    const addTech = () => {
        if (!techInput.trim()) return;
        setForm(f => ({ ...f, techStack: [...f.techStack, { technology: techInput.trim(), displayOrder: f.techStack.length }] }));
        setTechInput("");
    };
    const removeTech = (i) => setForm(f => ({ ...f, techStack: f.techStack.filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.title || !form.category) {
            setError("Başlık ve kategori zorunludur");
            return;
        }

        try {
            if (editingId) {
                await dispatch(updateProject({ id: editingId, projectData: form })).unwrap();
                setSuccess("Proje başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createProject(form)).unwrap();
                setSuccess("Proje başarıyla oluşturuldu!");
            }
            setForm(emptyForm);
            setShowForm(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + (err?.message || err));
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setForm({
            category: project.category || "",
            title: project.title || "",
            projectType: project.projectType || "",
            description: project.description || "",
            problemStatement: project.problemStatement || "",
            solutionStatement: project.solutionStatement || "",
            backgroundGradientA: project.backgroundGradientA || "#1b1916",
            backgroundGradientB: project.backgroundGradientB || "#2a2518",
            liveUrl: project.liveUrl || "",
            isFeatured: project.isFeatured || false,
            displayOrder: project.displayOrder || 0,
            status: project.status || "PUBLISHED",
            results: project.results || [],
            features: project.features || [],
            techStack: project.techStack || [],
            imageUrl: null
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
            dispatch(deleteProject(id));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(false);
    };

    const currentProjectImage = editingId
        ? projects.find(p => p.id === editingId)?.imageUrl
        : null;

    const gradientPreview = `linear-gradient(135deg, ${form.backgroundGradientA}, ${form.backgroundGradientB})`;

    return (
        <>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "24px", flexWrap: "wrap", gap: "12px"
            }}>
                <h1 className="page-title" style={{ margin: 0 }}>Portföy Yönetimi</h1>
                {!showForm && (
                    <button className="btn btn-dark btn-sm" onClick={() => setShowForm(true)}>
                        Yeni Proje
                    </button>
                )}
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {showForm && (
                <div className="admin-form" style={{ marginBottom: "40px" }}>
                    <h5 style={{ marginBottom: "20px" }}>
                        {editingId ? " Projeyi Düzenle" : "➕ Yeni Proje Ekle"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        {/* Başlık / Kategori / Tip */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Başlık *</label>
                                    <input type="text" name="title" className="form-control"
                                        placeholder="Proje başlığı" value={form.title}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Kategori *</label>
                                    <input type="text" name="category" className="form-control"
                                        placeholder="Kurumsal, E-Ticaret..." value={form.category}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Proje Tipi</label>
                                    <input type="text" name="projectType" className="form-control"
                                        placeholder="Web Uygulaması" value={form.projectType}
                                        onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Kapak Görseli */}
                        <div className="mb-3">
                            <label className="form-label">Kapak Görseli</label>
                            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>
                                PNG, JPG, WEBP – maks 2 MB. Görsel yoksa gradient arka plan kullanılır.
                            </div>
                            {editingId && form.imageUrl === null && currentProjectImage && (
                                <div style={{ marginBottom: "10px" }}>
                                    <img src={currentProjectImage} alt="Mevcut görsel"
                                        style={{
                                            width: "100%", maxHeight: "180px", objectFit: "cover",
                                            borderRadius: "10px", border: "1px solid #e5e7eb"
                                        }} />
                                    <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                                        Mevcut görsel — yeni dosya seçmezseniz korunur
                                    </div>
                                </div>
                            )}
                            {form.imageUrl instanceof File && (
                                <div style={{ marginBottom: "10px", position: "relative" }}>
                                    <img src={URL.createObjectURL(form.imageUrl)} alt="Önizleme"
                                        style={{
                                            width: "100%", maxHeight: "180px", objectFit: "cover",
                                            borderRadius: "10px", border: "2px solid #10b981"
                                        }} />
                                    <button type="button"
                                        onClick={() => setForm(f => ({ ...f, imageUrl: null }))}
                                        style={{
                                            position: "absolute", top: "8px", right: "8px",
                                            background: "#ef4444", color: "#fff", border: "none",
                                            borderRadius: "6px", padding: "4px 10px", fontSize: "12px",
                                            cursor: "pointer", fontWeight: 600
                                        }}>
                                        ✕ Kaldır
                                    </button>
                                </div>
                            )}
                            <input type="file" accept="image/png,image/jpeg,image/webp"
                                className="form-control" onChange={handleImageChange} />
                        </div>

                        {/* Açıklama */}
                        <div className="mb-3">
                            <label className="form-label">Açıklama</label>
                            <textarea name="description" className="form-control" rows="3"
                                placeholder="Proje açıklaması" value={form.description}
                                onChange={handleChange} />
                        </div>

                        {/* Problem / Çözüm */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Sorun İfadesi</label>
                                    <textarea name="problemStatement" className="form-control" rows="2"
                                        placeholder="Müşterinin karşılaştığı sorun"
                                        value={form.problemStatement} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Çözüm İfadesi</label>
                                    <textarea name="solutionStatement" className="form-control" rows="2"
                                        placeholder="Sunulan çözüm"
                                        value={form.solutionStatement} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Gradient */}
                        <div className="mb-3">
                            <label className="form-label">Arka Plan Gradient</label>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                                <div>
                                    <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>Renk A</div>
                                    <input type="color" name="backgroundGradientA" className="form-control"
                                        style={{ width: "70px", height: "44px", padding: "2px", cursor: "pointer" }}
                                        value={form.backgroundGradientA} onChange={handleChange} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>Renk B</div>
                                    <input type="color" name="backgroundGradientB" className="form-control"
                                        style={{ width: "70px", height: "44px", padding: "2px", cursor: "pointer" }}
                                        value={form.backgroundGradientB} onChange={handleChange} />
                                </div>
                                <div style={{ flex: 1, minWidth: "120px" }}>
                                    <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>Önizleme</div>
                                    <div style={{
                                        height: "44px", borderRadius: "8px",
                                        background: gradientPreview, border: "1px solid #e5e7eb"
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Canlı URL */}
                        <div className="mb-3">
                            <label className="form-label">Canlı URL (opsiyonel)</label>
                            <input type="url" name="liveUrl" className="form-control"
                                placeholder="https://example.com"
                                value={form.liveUrl} onChange={handleChange} />
                            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                                Girilmezse modal'da "Canlı Demo" butonu görünmez
                            </div>
                        </div>

                        {/* Sonuçlar */}
                        <div className="mb-3">
                            <label className="form-label">Sonuçlar</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <input type="text" className="form-control"
                                    placeholder="+340% organik trafik"
                                    value={resultInput} onChange={e => setResultInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addResult())} />
                                <button type="button" className="btn btn-outline-dark"
                                    onClick={addResult} style={{ whiteSpace: "nowrap" }}>
                                    Ekle
                                </button>
                            </div>
                            <div className="tag-list">
                                {form.results.map((r, i) => (
                                    <span key={i} className="tag-item">
                                        {r.resultText}
                                        <button type="button" className="tag-remove" onClick={() => removeResult(i)}>✕</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Özellikler */}
                        <div className="mb-3">
                            <label className="form-label">Özellikler</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <input type="text" className="form-control"
                                    placeholder="Mobil Uyumluluk"
                                    value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} />
                                <button type="button" className="btn btn-outline-dark"
                                    onClick={addFeature} style={{ whiteSpace: "nowrap" }}>
                                    Ekle
                                </button>
                            </div>
                            <div className="tag-list">
                                {form.features.map((f, i) => (
                                    <span key={i} className="tag-item">
                                        {f.featureText}
                                        <button type="button" className="tag-remove" onClick={() => removeFeature(i)}>✕</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Teknoloji Stack */}
                        <div className="mb-3">
                            <label className="form-label">Teknoloji Stack</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <input type="text" className="form-control"
                                    placeholder="Next.js, PostgreSQL..."
                                    value={techInput} onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())} />
                                <button type="button" className="btn btn-outline-dark"
                                    onClick={addTech} style={{ whiteSpace: "nowrap" }}>
                                    Ekle
                                </button>
                            </div>
                            <div className="tag-list">
                                {form.techStack.map((t, i) => (
                                    <span key={i} className="tag-item">
                                        {t.technology}
                                        <button type="button" className="tag-remove" onClick={() => removeTech(i)}>✕</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Sıra / Durum / Öne Çıkan */}
                        <div className="row">
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">Sıralama</label>
                                    <input type="number" name="displayOrder" className="form-control"
                                        value={form.displayOrder} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">Durum</label>
                                    <select name="status" className="form-control"
                                        value={form.status} onChange={handleChange}>
                                        <option value="PUBLISHED">Yayında</option>
                                        <option value="DRAFT">Taslak</option>
                                        <option value="ARCHIVED">Arşiv</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <div className="form-check" style={{ marginTop: "32px" }}>
                                        <input type="checkbox" name="isFeatured" className="form-check-input"
                                            id="projectFeatured" checked={form.isFeatured}
                                            onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="projectFeatured">
                                            Öne Çıkan Proje
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                            <button type="submit" className="btn btn-dark">
                                {editingId ? "Güncelle" : "Proje Ekle"}
                            </button>
                            <button type="button" className="btn btn-outline-dark" onClick={handleCancel}>
                                ✕ İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h5 style={{ marginBottom: "20px" }}>Projeler ({projects.length})</h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                </div>
            ) : projects.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz proje eklenmemiş</h5>
                    <p>"Yeni Proje" butonunu kullanarak proje ekleyiniz</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive desktop-only">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>Görsel</th>
                                    <th>Başlık</th>
                                    <th>Kategori</th>
                                    <th>Canlı URL</th>
                                    <th>Durum</th>
                                    <th>Sıra</th>
                                    <th>Öne Çıkan</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(project => (
                                    <tr key={project.id}>
                                        <td>
                                            {project.imageUrl ? (
                                                <img src={project.imageUrl} alt=""
                                                    style={{
                                                        width: 60, height: 42, objectFit: "cover",
                                                        borderRadius: 6, border: "1px solid #e5e7eb", display: "block"
                                                    }} />
                                            ) : (
                                                <div style={{
                                                    width: 60, height: 42, borderRadius: 6,
                                                    background: `linear-gradient(135deg, ${project.backgroundGradientA || "#1b1916"}, ${project.backgroundGradientB || "#2a2518"})`,
                                                    border: "1px solid rgba(255,255,255,0.1)"
                                                }} />
                                            )}
                                        </td>
                                        <td>
                                            <strong>{project.title}</strong>
                                            <div style={{ fontSize: "12px", color: "#999" }}>
                                                {project.projectType || ""}
                                            </div>
                                        </td>
                                        <td>{project.category}</td>
                                        <td>
                                            {project.liveUrl ? (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                                                    style={{ fontSize: "12px", color: "#10b981" }}
                                                    onClick={e => e.stopPropagation()}>
                                                    Görüntüle
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: "12px", color: "#6b7280" }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge" style={{
                                                background:
                                                    project.status === "PUBLISHED" ? "#10b981" :
                                                        project.status === "DRAFT" ? "#f59e0b" : "#6b7280"
                                            }}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td>{project.displayOrder}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-dark"
                                                onClick={() => dispatch(toggleProjectFeatured(project.id))}>
                                                {project.isFeatured ? "⭐" : "☆"}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn btn-sm btn-outline-dark"
                                                    onClick={() => handleEdit(project)}>Düzenle</button>
                                                <button className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(project.id)}>Sil</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-card-list">
                        {projects.map(project => (
                            <div key={project.id} className="mobile-card">
                                <div className="mobile-card__header">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt=""
                                            className="mobile-card__thumb"
                                            style={{ objectFit: "cover" }} />
                                    ) : (
                                        <div className="mobile-card__thumb"
                                            style={{ background: `linear-gradient(135deg, ${project.backgroundGradientA || "#1b1916"}, ${project.backgroundGradientB || "#2a2518"})` }} />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: "14px",
                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                        }}>
                                            {project.title}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                                            {project.category} {project.projectType ? `· ${project.projectType}` : ""}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", marginTop: "6px", alignItems: "center", flexWrap: "wrap" }}>
                                            <span className="badge" style={{
                                                background:
                                                    project.status === "PUBLISHED" ? "#10b981" :
                                                        project.status === "DRAFT" ? "#f59e0b" : "#6b7280",
                                                fontSize: "10px"
                                            }}>
                                                {project.status}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                                                Sıra: {project.displayOrder}
                                            </span>
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                                                    style={{ fontSize: "11px", color: "#10b981" }}
                                                    onClick={e => e.stopPropagation()}>
                                                    Canlı
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-card__actions">
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => handleEdit(project)}>Düzenle</button>
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => dispatch(toggleProjectFeatured(project.id))}>
                                        {project.isFeatured ? "Öne Çıkan" : "Öne Çıkar"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(project.id)}>Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default AdminPortfolio;
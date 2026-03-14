import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPosts, createPost, updatePost,
    deletePost, updatePostStatus, toggleFeatured
} from "../redux/blogSlice";

const AdminBlog = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector(state => state.blog);

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        title: "", slug: "", excerpt: "", content: "",
        category: "", author: "Algorixa", readTime: "",
        metaTitle: "", metaDescription: "",
        publishedDate: today,
        status: "DRAFT", isFeatured: false,
        imageUrl: null
    });

    const [editingId, setEditingId] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    const generateSlug = (title) =>
        title.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm({ ...form, title, slug: generateSlug(title) });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.title || !form.slug || !form.content || !form.category || !form.publishedDate) {
            setError("Başlık, slug, içerik, kategori ve yayın tarihi zorunludur");
            return;
        }

        try {
            if (editingId) {
                await dispatch(updatePost({ id: editingId, postData: form })).unwrap();
                setSuccess("Yazı başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createPost(form)).unwrap();
                setSuccess("Yazı başarıyla oluşturuldu!");
            }
            resetForm();
            setShowForm(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + (err?.message || err));
        }
    };

    const resetForm = () => {
        setForm({
            title: "", slug: "", excerpt: "", content: "",
            category: "", author: "Algorixa", readTime: "",
            metaTitle: "", metaDescription: "",
            publishedDate: today,
            status: "DRAFT", isFeatured: false,
            imageUrl: null
        });
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content: post.content,
            category: post.category || "",
            author: post.author || "Algorixa",
            readTime: post.readTime || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            publishedDate: post.publishedDate || today,
            status: post.status,
            isFeatured: post.isFeatured || false,
            imageUrl: null
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
            dispatch(deletePost(id));
        }
    };

    const handleStatusChange = (id, currentStatus) => {
        const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        dispatch(updatePostStatus({ id, status: newStatus }));
    };

    const handleCancel = () => {
        setEditingId(null);
        setShowForm(false);
        resetForm();
    };

    // Düzenleme modunda mevcut görseli bul
    const currentPostImage = editingId
        ? posts.find(p => p.id === editingId)?.imageUrl
        : null;

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <h1 className="page-title" style={{ margin: 0 }}> Blog Yönetimi</h1>
                {!showForm && (
                    <button className="btn btn-dark btn-sm" onClick={() => setShowForm(true)}>
                        Yeni Yazı
                    </button>
                )}
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {showForm && (
                <div className="admin-form" style={{ marginBottom: "40px" }}>
                    <h5 style={{ marginBottom: "20px" }}>
                        {editingId ? " Yazıyı Düzenle" : " Yeni Yazı Ekle"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        {/* Başlık + Slug */}
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label className="form-label">Başlık *</label>
                                    <input type="text" name="title" className="form-control"
                                        placeholder="Yazı başlığı" value={form.title}
                                        onChange={handleTitleChange} required />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">Slug *</label>
                                    <input type="text" name="slug" className="form-control"
                                        placeholder="yazi-slug" value={form.slug}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Kapak Görseli */}
                        <div className="mb-3">
                            <label className="form-label">Kapak Görseli</label>
                            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>
                                PNG, JPG, WEBP – maks 2 MB
                            </div>

                            {/* Düzenleme modunda mevcut görsel */}
                            {editingId && form.imageUrl === null && currentPostImage && (
                                <div style={{ marginBottom: "10px" }}>
                                    <img
                                        src={currentPostImage}
                                        alt="Mevcut görsel"
                                        style={{
                                            width: "100%", maxHeight: "200px", objectFit: "cover",
                                            borderRadius: "10px", border: "1px solid #e5e7eb"
                                        }}
                                    />
                                    <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                                        Mevcut görsel — yeni dosya seçmezseniz korunur
                                    </div>
                                </div>
                            )}

                            {/* Yeni seçilen dosya önizleme */}
                            {form.imageUrl instanceof File && (
                                <div style={{ marginBottom: "10px", position: "relative" }}>
                                    <img
                                        src={URL.createObjectURL(form.imageUrl)}
                                        alt="Önizleme"
                                        style={{
                                            width: "100%", maxHeight: "200px", objectFit: "cover",
                                            borderRadius: "10px", border: "2px solid #10b981"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, imageUrl: null }))}
                                        style={{
                                            position: "absolute", top: "8px", right: "8px",
                                            background: "#ef4444", color: "#fff", border: "none",
                                            borderRadius: "6px", padding: "4px 10px", fontSize: "12px",
                                            cursor: "pointer", fontWeight: 600
                                        }}
                                    >
                                        ✕ Kaldır
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Özet */}
                        <div className="mb-3">
                            <label className="form-label">Özet</label>
                            <textarea name="excerpt" className="form-control" rows="2"
                                placeholder="Kısa açıklama" value={form.excerpt} onChange={handleChange} />
                        </div>

                        {/* İçerik */}
                        <div className="mb-3">
                            <label className="form-label">İçerik *</label>
                            <textarea name="content" className="form-control" rows="10"
                                placeholder="Markdown destekler" value={form.content}
                                onChange={handleChange} required />
                        </div>

                        {/* Kategori / Yazar / Okuma Süresi / Tarih */}
                        <div className="row">
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Kategori *</label>
                                    <input type="text" name="category" className="form-control"
                                        placeholder="Rehber" value={form.category} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Yazar</label>
                                    <input type="text" name="author" className="form-control"
                                        placeholder="Algorixa" value={form.author} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Okuma Süresi</label>
                                    <input type="text" name="readTime" className="form-control"
                                        placeholder="5 dk okuma" value={form.readTime} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Yayın Tarihi *</label>
                                    <input type="date" name="publishedDate" className="form-control"
                                        value={form.publishedDate} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Meta Başlık (SEO)</label>
                                    <input type="text" name="metaTitle" className="form-control"
                                        placeholder="SEO başlığı" value={form.metaTitle} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Meta Açıklama (SEO)</label>
                                    <input type="text" name="metaDescription" className="form-control"
                                        placeholder="SEO açıklaması" value={form.metaDescription} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Durum + Öne Çıkan */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Durum</label>
                                    <select name="status" className="form-control"
                                        value={form.status} onChange={handleChange}>
                                        <option value="DRAFT">Taslak</option>
                                        <option value="PUBLISHED">Yayında</option>
                                        <option value="ARCHIVED">Arşiv</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <div className="form-check" style={{ marginTop: "32px" }}>
                                        <input type="checkbox" name="isFeatured" className="form-check-input"
                                            id="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="isFeatured">
                                            Öne Çıkan Yazı
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                            <button type="submit" className="btn btn-dark">
                                {editingId ? "🔄 Güncelle" : "➕ Yazı Ekle"}
                            </button>
                            <button type="button" className="btn btn-outline-dark" onClick={handleCancel}>
                                ✕ İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h5 style={{ marginBottom: "20px" }}>Yazılar ({posts.length})</h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz yazı eklenmemiş</h5>
                    <p>Yukarıdaki "Yeni Yazı" butonunu kullanarak yazı ekleyiniz</p>
                </div>
            ) : (
                <>
                    {/* Masaüstü Tablo */}
                    <div className="table-responsive desktop-only">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>Görsel</th>
                                    <th>Başlık</th>
                                    <th>Kategori</th>
                                    <th>Yayın Tarihi</th>
                                    <th>Durum</th>
                                    <th>Görüntülenme</th>
                                    <th>Öne Çıkan</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td>
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt=""
                                                    style={{
                                                        width: 52, height: 36, objectFit: "cover",
                                                        borderRadius: 6, border: "1px solid #e5e7eb", display: "block"
                                                    }} />
                                            ) : (
                                                <div style={{
                                                    width: 52, height: 36, borderRadius: 6,
                                                    background: "#f3f4f6", display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontSize: 18, color: "#d1d5db"
                                                }}>
                                                    🖼️
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{post.title}</strong>
                                            <div style={{ fontSize: "12px", color: "#999" }}>/{post.slug}</div>
                                        </td>
                                        <td>{post.category || "-"}</td>
                                        <td style={{ fontSize: "13px" }}>{post.publishedDate || "-"}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background:
                                                    post.status === "PUBLISHED" ? "#10b981" :
                                                        post.status === "DRAFT" ? "#f59e0b" : "#6b7280"
                                            }}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td>{post.viewCount || 0}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-dark"
                                                onClick={() => dispatch(toggleFeatured(post.id))}>
                                                {post.isFeatured ? "⭐" : "☆"}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn btn-sm btn-outline-dark"
                                                    onClick={() => handleEdit(post)}>Düzenle</button>

                                                <button className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(post.id)}>Sil</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobil Kart Listesi */}
                    <div className="mobile-card-list">
                        {posts.map(post => (
                            <div key={post.id} className="mobile-card">
                                <div className="mobile-card__header">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt=""
                                            className="mobile-card__thumb" />
                                    ) : (
                                        <div className="mobile-card__thumb"
                                            style={{
                                                background: "#f3f4f6", display: "flex",
                                                alignItems: "center", justifyContent: "center",
                                                fontSize: 22, color: "#d1d5db"
                                            }}>
                                            🖼️
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: "14px",
                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                        }}>
                                            {post.title}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                                            /{post.slug}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                            <span className="badge" style={{
                                                background:
                                                    post.status === "PUBLISHED" ? "#10b981" :
                                                        post.status === "DRAFT" ? "#f59e0b" : "#6b7280",
                                                fontSize: "10px"
                                            }}>
                                                {post.status}
                                            </span>
                                            {post.category && (
                                                <span style={{ fontSize: "11px", color: "#6b7280" }}>
                                                    {post.category}
                                                </span>
                                            )}
                                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                                                {post.publishedDate || ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-card__actions">
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => handleEdit(post)}>✏️ Düzenle</button>
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => handleStatusChange(post.id, post.status)}>
                                        {post.status === "PUBLISHED" ? "📥 Taslak" : "📤 Yayınla"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => dispatch(toggleFeatured(post.id))}>
                                        {post.isFeatured ? "⭐ Öne Çıkan" : "☆ Öne Çıkar"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(post.id)}>🗑️ Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default AdminBlog;
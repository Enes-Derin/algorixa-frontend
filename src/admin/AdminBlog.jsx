import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPosts, createPost, updatePost,
    deletePost, updatePostStatus, toggleFeatured
} from "../redux/blogSlice";

const AdminBlog = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector(state => state.blog);
    const editorRef = useRef(null);

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

        const content = editorRef.current?.innerHTML || "";
        if (!form.title || !form.slug || !content.trim() || !form.category || !form.publishedDate) {
            setError("Başlık, slug, içerik, kategori ve yayın tarihi zorunludur");
            return;
        }

        const submitData = { ...form, content };

        try {
            if (editingId) {
                await dispatch(updatePost({ id: editingId, postData: submitData })).unwrap();
                setSuccess("Yazı başarıyla güncellendi!");
                setEditingId(null);
            } else {
                await dispatch(createPost(submitData)).unwrap();
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
        if (editorRef.current) editorRef.current.innerHTML = "";
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
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = post.content || "";
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
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

    const openNewForm = () => {
        setShowForm(true);
        setTimeout(() => {
            if (editorRef.current) editorRef.current.innerHTML = "";
        }, 50);
    };

    const execCmd = (cmd, value = null) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    const currentPostImage = editingId
        ? posts.find(p => p.id === editingId)?.imageUrl
        : null;

    const ToolBtn = ({ onClick, children, title, style = {} }) => (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            style={{
                minWidth: 30, height: 28,
                padding: "0 7px",
                background: "var(--bg-3)",
                border: "1px solid var(--b-faint)",
                borderRadius: "2px",
                color: "var(--t-2)",
                cursor: "pointer",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .15s",
                ...style
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "var(--gold-glow)";
                e.currentTarget.style.borderColor = "var(--b-mid)";
                e.currentTarget.style.color = "var(--gold)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "var(--bg-3)";
                e.currentTarget.style.borderColor = "var(--b-faint)";
                e.currentTarget.style.color = "var(--t-2)";
            }}
        >
            {children}
        </button>
    );

    const Divider = () => (
        <div style={{ width: 1, background: "var(--b-soft)", margin: "0 3px", alignSelf: "stretch" }} />
    );

    return (
        <>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "28px", flexWrap: "wrap", gap: "12px"
            }}>
                <h1 className="page-title" style={{ margin: 0 }}>Blog Yönetimi</h1>
                {!showForm && (
                    <button className="btn btn-dark btn-sm" onClick={openNewForm}>
                        + Yeni Yazı
                    </button>
                )}
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {showForm && (
                <div className="admin-form" style={{ marginBottom: "40px" }}>
                    <h5>{editingId ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}</h5>

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
                            <div style={{ fontSize: "11px", color: "var(--t-4)", marginBottom: "8px" }}>
                                PNG, JPG, WEBP – maks 2 MB
                            </div>
                            {editingId && form.imageUrl === null && currentPostImage && (
                                <div style={{ marginBottom: "10px" }}>
                                    <img src={currentPostImage} alt="Mevcut görsel"
                                        style={{
                                            width: "100%", maxHeight: "200px", objectFit: "cover",
                                            borderRadius: "4px", border: "1px solid var(--b-faint)"
                                        }} />
                                    <div style={{ fontSize: "11px", color: "var(--t-4)", marginTop: "4px" }}>
                                        Mevcut görsel — yeni dosya seçmezseniz korunur
                                    </div>
                                </div>
                            )}
                            {form.imageUrl instanceof File && (
                                <div style={{ marginBottom: "10px", position: "relative" }}>
                                    <img src={URL.createObjectURL(form.imageUrl)} alt="Önizleme"
                                        style={{
                                            width: "100%", maxHeight: "200px", objectFit: "cover",
                                            borderRadius: "4px", border: "2px solid #10b981"
                                        }} />
                                    <button type="button"
                                        onClick={() => setForm(f => ({ ...f, imageUrl: null }))}
                                        style={{
                                            position: "absolute", top: "8px", right: "8px",
                                            background: "#ef4444", color: "#fff", border: "none",
                                            borderRadius: "3px", padding: "4px 10px", fontSize: "12px",
                                            cursor: "pointer", fontWeight: 600
                                        }}>
                                        ✕ Kaldır
                                    </button>
                                </div>
                            )}
                            <input type="file" accept="image/png,image/jpeg,image/webp"
                                className="form-control" onChange={handleImageChange} />
                        </div>

                        {/* Özet */}
                        <div className="mb-3">
                            <label className="form-label">Özet</label>
                            <textarea name="excerpt" className="form-control" rows="2"
                                placeholder="Kısa açıklama" value={form.excerpt} onChange={handleChange} />
                        </div>

                        {/* WYSIWYG İçerik Editörü */}
                        <div className="mb-3">
                            <label className="form-label">İçerik *</label>
                            <div style={{
                                border: "1px solid var(--b-faint)",
                                borderRadius: "2px",
                                overflow: "hidden",
                                background: "var(--bg-1)"
                            }}>
                                {/* Toolbar */}
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "2px",
                                    padding: "8px 10px",
                                    background: "var(--bg-2)",
                                    borderBottom: "1px solid var(--b-faint)",
                                    alignItems: "center"
                                }}>
                                    <ToolBtn onClick={() => execCmd("bold")} title="Kalın (Ctrl+B)">
                                        <strong>B</strong>
                                    </ToolBtn>
                                    <ToolBtn onClick={() => execCmd("italic")} title="İtalik (Ctrl+I)">
                                        <em style={{ fontStyle: "italic" }}>I</em>
                                    </ToolBtn>
                                    <ToolBtn onClick={() => execCmd("underline")} title="Altı Çizili (Ctrl+U)">
                                        <span style={{ textDecoration: "underline" }}>U</span>
                                    </ToolBtn>
                                    <ToolBtn onClick={() => execCmd("strikeThrough")} title="Üstü Çizili">
                                        <span style={{ textDecoration: "line-through" }}>S</span>
                                    </ToolBtn>

                                    <Divider />

                                    <ToolBtn onClick={() => execCmd("formatBlock", "h1")} title="Başlık 1" style={{ fontSize: "11px", fontWeight: 700 }}>H1</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("formatBlock", "h2")} title="Başlık 2" style={{ fontSize: "11px", fontWeight: 700 }}>H2</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("formatBlock", "h3")} title="Başlık 3" style={{ fontSize: "11px", fontWeight: 700 }}>H3</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("formatBlock", "p")} title="Paragraf" style={{ fontSize: "13px" }}>¶</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("formatBlock", "blockquote")} title="Alıntı" style={{ fontSize: "13px" }}>"</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("formatBlock", "pre")} title="Kod Bloğu" style={{ fontSize: "11px", fontFamily: "monospace" }}>{`</>`}</ToolBtn>

                                    <Divider />

                                    <ToolBtn onClick={() => execCmd("insertUnorderedList")} title="Madde İşaretli Liste">•≡</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("insertOrderedList")} title="Numaralı Liste">1≡</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("indent")} title="Girinti Arttır">→</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("outdent")} title="Girinti Azalt">←</ToolBtn>

                                    <Divider />

                                    <ToolBtn onClick={() => execCmd("justifyLeft")} title="Sola Hizala">⬅</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("justifyCenter")} title="Ortala">⬛</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("justifyRight")} title="Sağa Hizala">➡</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("justifyFull")} title="İki Yana Yasla">⬜</ToolBtn>

                                    <Divider />

                                    <ToolBtn
                                        onClick={() => {
                                            const url = prompt("Link URL:");
                                            if (url) execCmd("createLink", url);
                                        }}
                                        title="Link Ekle"
                                    >
                                        🔗
                                    </ToolBtn>
                                    <ToolBtn onClick={() => execCmd("unlink")} title="Link Kaldır">🔗✕</ToolBtn>

                                    <Divider />

                                    {/* Yazı rengi */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                        <span style={{
                                            fontSize: "11px", color: "var(--t-3)",
                                            fontFamily: "var(--f-mono)", letterSpacing: ".05em"
                                        }}>A</span>
                                        <input
                                            type="color"
                                            defaultValue="#c8a84b"
                                            title="Yazı Rengi"
                                            onChange={e => execCmd("foreColor", e.target.value)}
                                            style={{
                                                width: 24, height: 24, border: "1px solid var(--b-faint)",
                                                borderRadius: "2px", padding: 2, cursor: "pointer",
                                                background: "var(--bg-3)"
                                            }}
                                        />
                                    </div>

                                    {/* Arka plan rengi */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                        <span style={{
                                            fontSize: "11px", color: "var(--t-3)",
                                            fontFamily: "var(--f-mono)", letterSpacing: ".05em"
                                        }}>BG</span>
                                        <input
                                            type="color"
                                            defaultValue="#18160f"
                                            title="Arka Plan Rengi"
                                            onChange={e => execCmd("backColor", e.target.value)}
                                            style={{
                                                width: 24, height: 24, border: "1px solid var(--b-faint)",
                                                borderRadius: "2px", padding: 2, cursor: "pointer",
                                                background: "var(--bg-3)"
                                            }}
                                        />
                                    </div>

                                    <Divider />

                                    <ToolBtn onClick={() => execCmd("undo")} title="Geri Al (Ctrl+Z)">↩</ToolBtn>
                                    <ToolBtn onClick={() => execCmd("redo")} title="İleri Al (Ctrl+Y)">↪</ToolBtn>

                                    <Divider />

                                    <ToolBtn onClick={() => execCmd("removeFormat")} title="Formatı Temizle" style={{ fontSize: "11px" }}>✕fmt</ToolBtn>
                                </div>

                                {/* Editable Alan */}
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={e => setForm(f => ({ ...f, content: e.currentTarget.innerHTML }))}
                                    data-placeholder="İçeriğinizi buraya yazın... Markdown yerine doğrudan toolbar ile formatlayabilirsiniz."
                                    style={{
                                        minHeight: "320px",
                                        padding: "20px",
                                        background: "var(--bg-1)",
                                        color: "var(--t-1)",
                                        fontSize: "15px",
                                        lineHeight: "1.8",
                                        fontFamily: "var(--f-body)",
                                        outline: "none",
                                        overflowY: "auto"
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--t-4)", marginTop: "6px" }}>
                                Toolbar ile formatlayın — yazılar blogda birebir aynı görünümde yayınlanır
                            </div>
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

                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <button type="submit" className="btn btn-dark">
                                {editingId ? "Güncelle" : "Yazı Ekle"}
                            </button>
                            <button type="button" className="btn btn-outline-dark" onClick={handleCancel}>
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h5 style={{ margin: 0, fontFamily: "var(--f-mono)", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--t-4)" }}>
                    Yazılar ({posts.length})
                </h5>
            </div>

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
                                                        borderRadius: 4, border: "1px solid var(--b-faint)", display: "block"
                                                    }} />
                                            ) : (
                                                <div style={{
                                                    width: 52, height: 36, borderRadius: 4,
                                                    background: "var(--bg-2)", display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontSize: 16, color: "var(--t-4)"
                                                }}>
                                                    🖼
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: "var(--t-1)", fontSize: "13px" }}>{post.title}</div>
                                            <div style={{ fontSize: "11px", color: "var(--t-4)", fontFamily: "var(--f-mono)", marginTop: "2px" }}>/{post.slug}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: "inline-block", padding: "2px 10px",
                                                background: "var(--bg-2)", border: "1px solid var(--b-faint)",
                                                borderRadius: "2px", fontSize: "11px", color: "var(--t-3)",
                                                fontFamily: "var(--f-mono)"
                                            }}>
                                                {post.category || "—"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "12px", color: "var(--t-3)", fontFamily: "var(--f-mono)" }}>
                                            {post.publishedDate || "—"}
                                        </td>
                                        <td>
                                            <span className="badge" style={{
                                                background:
                                                    post.status === "PUBLISHED" ? "#10b981" :
                                                        post.status === "DRAFT" ? "#f59e0b" : "#6b7280"
                                            }}>
                                                {post.status === "PUBLISHED" ? "Yayında" :
                                                    post.status === "DRAFT" ? "Taslak" : "Arşiv"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "13px", color: "var(--t-3)", fontFamily: "var(--f-mono)" }}>
                                            {post.viewCount || 0}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-dark"
                                                onClick={() => dispatch(toggleFeatured(post.id))}
                                                style={{ fontSize: "16px", padding: "4px 10px" }}
                                            >
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
                                        <img src={post.imageUrl} alt="" className="mobile-card__thumb" />
                                    ) : (
                                        <div className="mobile-card__thumb" style={{
                                            background: "var(--bg-2)", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 20, color: "var(--t-4)"
                                        }}>
                                            🖼
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: "14px", color: "var(--t-1)",
                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                        }}>
                                            {post.title}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "var(--t-4)", marginTop: "2px", fontFamily: "var(--f-mono)" }}>
                                            /{post.slug}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                            <span className="badge" style={{
                                                background: post.status === "PUBLISHED" ? "#10b981" :
                                                    post.status === "DRAFT" ? "#f59e0b" : "#6b7280",
                                                fontSize: "9px"
                                            }}>
                                                {post.status === "PUBLISHED" ? "Yayında" :
                                                    post.status === "DRAFT" ? "Taslak" : "Arşiv"}
                                            </span>
                                            {post.category && (
                                                <span style={{ fontSize: "11px", color: "var(--t-3)", fontFamily: "var(--f-mono)" }}>
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-card__actions">
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => handleEdit(post)}>Düzenle</button>
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => handleStatusChange(post.id, post.status)}>
                                        {post.status === "PUBLISHED" ? "Taslağa Al" : "Yayınla"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-dark"
                                        onClick={() => dispatch(toggleFeatured(post.id))}>
                                        {post.isFeatured ? "⭐ Öne Çıkan" : "☆ Öne Çıkar"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(post.id)}>Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Editor placeholder stili */}
            <style>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: var(--t-4);
                    pointer-events: none;
                    font-style: italic;
                }
                [contenteditable]:focus {
                    box-shadow: inset 0 0 0 2px var(--gold-glow);
                }
                [contenteditable] h1 { font-family: var(--f-display); font-size: 28px; font-weight: 600; color: var(--t-1); margin: 20px 0 10px; }
                [contenteditable] h2 { font-family: var(--f-display); font-size: 22px; font-weight: 500; color: var(--t-1); margin: 18px 0 8px; border-bottom: 1px solid var(--b-faint); padding-bottom: 5px; }
                [contenteditable] h3 { font-family: var(--f-display); font-size: 18px; font-weight: 500; color: var(--t-2); margin: 14px 0 6px; }
                [contenteditable] p { margin: 0 0 12px; line-height: 1.8; }
                [contenteditable] ul { padding-left: 22px; margin: 0 0 12px; list-style: disc; }
                [contenteditable] ol { padding-left: 22px; margin: 0 0 12px; list-style: decimal; }
                [contenteditable] li { margin-bottom: 5px; line-height: 1.7; }
                [contenteditable] blockquote { border-left: 3px solid var(--gold); padding: 10px 16px; margin: 14px 0; background: var(--gold-glow); color: var(--t-2); font-style: italic; border-radius: 0 2px 2px 0; }
                [contenteditable] pre { background: var(--bg-0); border: 1px solid var(--b-soft); border-radius: 2px; padding: 14px 16px; font-family: var(--f-mono); font-size: 13px; overflow-x: auto; margin: 14px 0; color: var(--gold); }
                [contenteditable] a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
                [contenteditable] strong { font-weight: 700; color: var(--t-1); }
                [contenteditable] em { font-style: italic; }
            `}</style>
        </>
    );
};

export default AdminBlog;
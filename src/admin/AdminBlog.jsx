import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPosts, createPost, updatePost,
    deletePost, updatePostStatus, toggleFeatured
} from "../redux/blogSlice";

/* ═══════════════════════════════════════════
   WYSIWYG EDITOR COMPONENT
═══════════════════════════════════════════ */
function WysiwygEditor({ value, onChange }) {
    const ref = useRef(null);
    const lastHTML = useRef("");
    const skipNextEffect = useRef(false);

    /* İlk mount */
    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = value || "";
            lastHTML.current = value || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Dışarıdan value değişince (reset / edit) */
    useEffect(() => {
        if (!ref.current) return;
        if (skipNextEffect.current) {
            skipNextEffect.current = false;
            return;
        }
        if (value !== lastHTML.current) {
            ref.current.innerHTML = value || "";
            lastHTML.current = value || "";
        }
    }, [value]);

    const emit = useCallback(() => {
        if (!ref.current) return;
        const html = ref.current.innerHTML;
        lastHTML.current = html;
        skipNextEffect.current = true;
        onChange(html);
    }, [onChange]);

    /* Enter tuşu: <p> tabanlı satır sonu */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const sel = window.getSelection();
            if (!sel || !sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            range.deleteContents();

            /* Yeni <p> oluştur */
            const newP = document.createElement("p");
            newP.appendChild(document.createElement("br"));
            range.insertNode(newP);

            /* İmleci yeni paragrafa taşı */
            const newRange = document.createRange();
            newRange.setStart(newP, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);

            emit();
            return;
        }

        /* Shift+Enter → <br> */
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            document.execCommand("insertLineBreak");
            emit();
        }
    };

    const exec = (cmd, val = null) => {
        ref.current?.focus();
        document.execCommand(cmd, false, val);
        emit();
    };

    /* ── Toolbar buton bileşeni ── */
    const T = ({ onClick, children, title, style = {} }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            style={{
                minWidth: 30, height: 28, padding: "0 7px",
                background: "var(--bg-3)", border: "1px solid var(--b-faint)",
                borderRadius: "2px", color: "var(--t-2)", cursor: "pointer",
                fontSize: "13px", display: "inline-flex", alignItems: "center",
                justifyContent: "center", transition: "all .15s", flexShrink: 0,
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

    const Sep = () => (
        <div style={{
            width: 1, alignSelf: "stretch",
            background: "var(--b-soft)", margin: "0 3px"
        }} />
    );

    return (
        <div style={{ border: "1px solid var(--b-faint)", borderRadius: "2px", overflow: "hidden" }}>
            {/* ── Toolbar ── */}
            <div style={{
                display: "flex", flexWrap: "wrap", gap: "2px",
                padding: "8px 10px", background: "var(--bg-2)",
                borderBottom: "1px solid var(--b-faint)", alignItems: "center"
            }}>
                <T onClick={() => exec("bold")} title="Kalın (Ctrl+B)">
                    <strong style={{ fontWeight: 700 }}>B</strong>
                </T>
                <T onClick={() => exec("italic")} title="İtalik (Ctrl+I)">
                    <em style={{ fontStyle: "italic" }}>I</em>
                </T>
                <T onClick={() => exec("underline")} title="Altı Çizili">
                    <span style={{ textDecoration: "underline" }}>U</span>
                </T>
                <T onClick={() => exec("strikeThrough")} title="Üstü Çizili">
                    <span style={{ textDecoration: "line-through" }}>S</span>
                </T>

                <Sep />

                <T onClick={() => exec("formatBlock", "h1")} title="Başlık 1"
                    style={{ fontSize: "11px", fontWeight: 700 }}>H1</T>
                <T onClick={() => exec("formatBlock", "h2")} title="Başlık 2"
                    style={{ fontSize: "11px", fontWeight: 700 }}>H2</T>
                <T onClick={() => exec("formatBlock", "h3")} title="Başlık 3"
                    style={{ fontSize: "11px", fontWeight: 700 }}>H3</T>
                <T onClick={() => exec("formatBlock", "p")} title="Paragraf"
                    style={{ fontSize: "13px" }}>¶</T>
                <T onClick={() => exec("formatBlock", "blockquote")} title="Alıntı"
                    style={{ fontSize: "15px", fontFamily: "Georgia, serif" }}>"</T>
                <T onClick={() => exec("formatBlock", "pre")} title="Kod Bloğu"
                    style={{ fontSize: "11px", fontFamily: "monospace" }}>{`</>`}</T>

                <Sep />

                <T onClick={() => exec("insertUnorderedList")} title="Madde İşaretli Liste">• ≡</T>
                <T onClick={() => exec("insertOrderedList")} title="Numaralı Liste"
                    style={{ fontSize: "11px" }}>1. ≡</T>
                <T onClick={() => exec("indent")} title="Girinti Artır">⇥</T>
                <T onClick={() => exec("outdent")} title="Girinti Azalt">⇤</T>

                <Sep />

                <T onClick={() => exec("justifyLeft")} title="Sola Hizala" style={{ fontSize: "12px" }}>⬅</T>
                <T onClick={() => exec("justifyCenter")} title="Ortala" style={{ fontSize: "12px" }}>⬛</T>
                <T onClick={() => exec("justifyRight")} title="Sağa Hizala" style={{ fontSize: "12px" }}>➡</T>

                <Sep />

                <T onClick={() => {
                    const url = prompt("Link URL:");
                    if (url) exec("createLink", url);
                }} title="Link Ekle">🔗</T>
                <T onClick={() => exec("unlink")} title="Link Kaldır"
                    style={{ fontSize: "11px" }}>🔗✕</T>

                <Sep />

                {/* Yazı rengi */}
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}
                    title="Yazı Rengi">
                    <span style={{ fontSize: "11px", color: "var(--t-3)", fontFamily: "var(--f-mono)" }}>A</span>
                    <input type="color" defaultValue="#c8a84b"
                        onChange={e => exec("foreColor", e.target.value)}
                        style={{
                            width: 24, height: 24, border: "1px solid var(--b-faint)",
                            borderRadius: "2px", padding: 2, cursor: "pointer",
                            background: "var(--bg-3)"
                        }} />
                </div>

                {/* Arka plan rengi */}
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}
                    title="Arka Plan Rengi">
                    <span style={{ fontSize: "10px", color: "var(--t-3)", fontFamily: "var(--f-mono)" }}>BG</span>
                    <input type="color" defaultValue="#18160f"
                        onChange={e => exec("backColor", e.target.value)}
                        style={{
                            width: 24, height: 24, border: "1px solid var(--b-faint)",
                            borderRadius: "2px", padding: 2, cursor: "pointer",
                            background: "var(--bg-3)"
                        }} />
                </div>

                <Sep />

                <T onClick={() => exec("undo")} title="Geri Al (Ctrl+Z)">↩</T>
                <T onClick={() => exec("redo")} title="İleri Al (Ctrl+Y)">↪</T>
                <T onClick={() => exec("removeFormat")} title="Formatı Temizle"
                    style={{ fontSize: "10px" }}>✕fmt</T>
            </div>

            {/* ── Editable Alan ── */}
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={emit}
                onKeyDown={handleKeyDown}
                onBlur={emit}
                style={{
                    minHeight: "320px",
                    padding: "20px",
                    background: "var(--bg-1)",
                    color: "var(--t-1)",
                    fontSize: "15px",
                    lineHeight: "1.8",
                    fontFamily: "var(--f-body)",
                    outline: "none",
                    overflowY: "auto",
                    wordBreak: "break-word"
                }}
            />

            {/* Editör içi stiller */}
            <style>{`
                [contenteditable]:empty:before {
                    content: 'İçeriğinizi buraya yazın... Enter ile yeni paragraf, Shift+Enter ile satır sonu.';
                    color: var(--t-4);
                    pointer-events: none;
                    font-style: italic;
                    font-size: 14px;
                }
                [contenteditable]:focus-within {
                    box-shadow: inset 0 0 0 2px var(--gold-glow);
                }
                [contenteditable] p {
                    margin: 0 0 10px;
                    line-height: 1.8;
                }
                [contenteditable] p:last-child { margin-bottom: 0; }
                [contenteditable] h1 {
                    font-family: var(--f-display);
                    font-size: 26px; font-weight: 600;
                    color: var(--t-1); margin: 20px 0 10px;
                    letter-spacing: -.015em;
                }
                [contenteditable] h2 {
                    font-family: var(--f-display);
                    font-size: 21px; font-weight: 500;
                    color: var(--t-1); margin: 18px 0 8px;
                    border-bottom: 1px solid var(--b-faint);
                    padding-bottom: 5px;
                }
                [contenteditable] h3 {
                    font-family: var(--f-display);
                    font-size: 17px; font-weight: 500;
                    color: var(--t-2); margin: 14px 0 6px;
                }
                [contenteditable] ul {
                    padding-left: 22px; margin: 0 0 12px;
                    list-style: disc;
                }
                [contenteditable] ol {
                    padding-left: 22px; margin: 0 0 12px;
                    list-style: decimal;
                }
                [contenteditable] li { margin-bottom: 5px; line-height: 1.7; }
                [contenteditable] blockquote {
                    border-left: 3px solid var(--gold);
                    padding: 10px 16px; margin: 14px 0;
                    background: var(--gold-glow); color: var(--t-2);
                    font-style: italic; border-radius: 0 2px 2px 0;
                }
                [contenteditable] pre {
                    background: var(--bg-0); border: 1px solid var(--b-soft);
                    border-radius: 2px; padding: 14px 16px;
                    font-family: var(--f-mono); font-size: 13px;
                    overflow-x: auto; margin: 14px 0; color: var(--gold);
                    white-space: pre-wrap;
                }
                [contenteditable] a {
                    color: var(--gold); text-decoration: underline;
                    text-underline-offset: 3px;
                }
                [contenteditable] strong { font-weight: 700; color: var(--t-1); }
                [contenteditable] em { font-style: italic; }
            `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ADMIN BLOG
═══════════════════════════════════════════ */
const AdminBlog = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector(state => state.blog);

    const today = new Date().toISOString().split("T")[0];

    const emptyForm = {
        title: "", slug: "", excerpt: "", content: "",
        category: "", author: "Algorixa", readTime: "",
        metaTitle: "", metaDescription: "",
        publishedDate: today,
        status: "DRAFT", isFeatured: false,
        imageUrl: null
    };

    const [form, setForm] = useState(emptyForm);
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
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm(f => ({ ...f, title, slug: generateSlug(title) }));
    };

    const handleContentChange = useCallback((html) => {
        setForm(f => ({ ...f, content: html }));
    }, []);

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

        const content = form.content || "";
        const plainText = content.replace(/<[^>]*>/g, "").trim();

        if (!form.title || !form.slug || !plainText || !form.category || !form.publishedDate) {
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
            closeForm();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Bir hata oluştu: " + (err?.message || err));
        }
    };

    const closeForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content: post.content || "",
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

    const currentPostImage = editingId
        ? posts.find(p => p.id === editingId)?.imageUrl
        : null;

    return (
        <>
            {/* ── Başlık ── */}
            <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "28px", flexWrap: "wrap", gap: "12px"
            }}>
                <h1 className="page-title" style={{ margin: 0 }}>Blog Yönetimi</h1>
                {!showForm && (
                    <button className="btn btn-dark btn-sm"
                        onClick={() => setShowForm(true)}>
                        + Yeni Yazı
                    </button>
                )}
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* ── Form ── */}
            {showForm && (
                <div className="admin-form" style={{ marginBottom: "40px" }}>
                    <h5 style={{ marginBottom: "24px" }}>
                        {editingId ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}
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
                            <div style={{ fontSize: "11px", color: "var(--t-4)", marginBottom: "8px" }}>
                                PNG, JPG, WEBP – maks 2 MB
                            </div>
                            {editingId && form.imageUrl === null && currentPostImage && (
                                <div style={{ marginBottom: "10px" }}>
                                    <img src={currentPostImage} alt="Mevcut görsel"
                                        style={{
                                            width: "100%", maxHeight: "200px",
                                            objectFit: "cover", borderRadius: "4px",
                                            border: "1px solid var(--b-faint)"
                                        }} />
                                    <div style={{ fontSize: "11px", color: "var(--t-4)", marginTop: "4px" }}>
                                        Mevcut görsel — yeni dosya seçmezseniz korunur
                                    </div>
                                </div>
                            )}
                            {form.imageUrl instanceof File && (
                                <div style={{ marginBottom: "10px", position: "relative" }}>
                                    <img
                                        src={URL.createObjectURL(form.imageUrl)}
                                        alt="Önizleme"
                                        style={{
                                            width: "100%", maxHeight: "200px",
                                            objectFit: "cover", borderRadius: "4px",
                                            border: "2px solid #10b981"
                                        }} />
                                    <button type="button"
                                        onClick={() => setForm(f => ({ ...f, imageUrl: null }))}
                                        style={{
                                            position: "absolute", top: 8, right: 8,
                                            background: "#ef4444", color: "#fff",
                                            border: "none", borderRadius: "3px",
                                            padding: "4px 10px", fontSize: "12px",
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
                                placeholder="Kısa açıklama"
                                value={form.excerpt} onChange={handleChange} />
                        </div>

                        {/* WYSIWYG İçerik */}
                        <div className="mb-3">
                            <label className="form-label">İçerik *</label>
                            <WysiwygEditor
                                value={form.content}
                                onChange={handleContentChange}
                            />
                            <div style={{
                                fontSize: "11px", color: "var(--t-4)", marginTop: "6px"
                            }}>
                                Enter → yeni paragraf &nbsp;·&nbsp; Shift+Enter → satır sonu &nbsp;·&nbsp;
                                Toolbar ile formatlayın
                            </div>
                        </div>

                        {/* Kategori / Yazar / Okuma Süresi / Tarih */}
                        <div className="row">
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Kategori *</label>
                                    <input type="text" name="category" className="form-control"
                                        placeholder="Rehber" value={form.category}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Yazar</label>
                                    <input type="text" name="author" className="form-control"
                                        placeholder="Algorixa" value={form.author}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Okuma Süresi</label>
                                    <input type="text" name="readTime" className="form-control"
                                        placeholder="5 dk okuma" value={form.readTime}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">Yayın Tarihi *</label>
                                    <input type="date" name="publishedDate" className="form-control"
                                        value={form.publishedDate}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Meta Başlık (SEO)</label>
                                    <input type="text" name="metaTitle" className="form-control"
                                        placeholder="SEO başlığı" value={form.metaTitle}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Meta Açıklama (SEO)</label>
                                    <input type="text" name="metaDescription" className="form-control"
                                        placeholder="SEO açıklaması" value={form.metaDescription}
                                        onChange={handleChange} />
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
                                        <input type="checkbox" name="isFeatured"
                                            className="form-check-input" id="isFeatured"
                                            checked={form.isFeatured} onChange={handleChange} />
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
                            <button type="button" className="btn btn-outline-dark"
                                onClick={closeForm}>
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Liste başlığı ── */}
            <div style={{ marginBottom: "16px" }}>
                <h5 style={{
                    margin: 0, fontFamily: "var(--f-mono)", fontSize: "10px",
                    letterSpacing: ".18em", textTransform: "uppercase", color: "var(--t-4)"
                }}>
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
                                    <th style={{ width: 60 }}>Görsel</th>
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
                                                        borderRadius: 4,
                                                        border: "1px solid var(--b-faint)",
                                                        display: "block"
                                                    }} />
                                            ) : (
                                                <div style={{
                                                    width: 52, height: 36, borderRadius: 4,
                                                    background: "var(--bg-2)", display: "flex",
                                                    alignItems: "center", justifyContent: "center",
                                                    fontSize: 16, color: "var(--t-4)"
                                                }}>🖼</div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{
                                                fontWeight: 600, color: "var(--t-1)",
                                                fontSize: "13px"
                                            }}>
                                                {post.title}
                                            </div>
                                            <div style={{
                                                fontSize: "11px", color: "var(--t-4)",
                                                fontFamily: "var(--f-mono)", marginTop: 2
                                            }}>
                                                /{post.slug}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: "inline-block", padding: "2px 10px",
                                                background: "var(--bg-2)",
                                                border: "1px solid var(--b-faint)",
                                                borderRadius: "2px", fontSize: "11px",
                                                color: "var(--t-3)", fontFamily: "var(--f-mono)"
                                            }}>
                                                {post.category || "—"}
                                            </span>
                                        </td>
                                        <td style={{
                                            fontSize: "12px", color: "var(--t-3)",
                                            fontFamily: "var(--f-mono)"
                                        }}>
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
                                        <td style={{
                                            fontSize: "13px", color: "var(--t-3)",
                                            fontFamily: "var(--f-mono)"
                                        }}>
                                            {post.viewCount || 0}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-dark"
                                                style={{ fontSize: 16, padding: "4px 10px" }}
                                                onClick={() => dispatch(toggleFeatured(post.id))}>
                                                {post.isFeatured ? "⭐" : "☆"}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn btn-sm btn-outline-dark"
                                                    onClick={() => handleEdit(post)}>
                                                    Düzenle
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(post.id)}>
                                                    Sil
                                                </button>
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
                                        <div className="mobile-card__thumb" style={{
                                            background: "var(--bg-2)", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 20, color: "var(--t-4)"
                                        }}>🖼</div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600, fontSize: "14px", color: "var(--t-1)",
                                            whiteSpace: "nowrap", overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {post.title}
                                        </div>
                                        <div style={{
                                            fontSize: "11px", color: "var(--t-4)",
                                            marginTop: 2, fontFamily: "var(--f-mono)"
                                        }}>
                                            /{post.slug}
                                        </div>
                                        <div style={{
                                            display: "flex", gap: 6, marginTop: 6,
                                            flexWrap: "wrap", alignItems: "center"
                                        }}>
                                            <span className="badge" style={{
                                                background:
                                                    post.status === "PUBLISHED" ? "#10b981" :
                                                        post.status === "DRAFT" ? "#f59e0b" : "#6b7280",
                                                fontSize: "9px"
                                            }}>
                                                {post.status === "PUBLISHED" ? "Yayında" :
                                                    post.status === "DRAFT" ? "Taslak" : "Arşiv"}
                                            </span>
                                            {post.category && (
                                                <span style={{
                                                    fontSize: "11px", color: "var(--t-3)",
                                                    fontFamily: "var(--f-mono)"
                                                }}>
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
        </>
    );
};

export default AdminBlog;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchContactMessages,
    markMessageAsRead,
    deleteContactMessage
} from "../redux/contactSlice";

const AdminContactMessages = () => {
    const dispatch = useDispatch();
    const { messages = [], loading } = useSelector(state => state.contact);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState("all"); // all | unread | read

    useEffect(() => {
        dispatch(fetchContactMessages());
    }, [dispatch]);

    const unreadCount = messages.filter(m => !m.read).length;

    const filtered = messages.filter(m => {
        if (filter === "unread") return !m.read;
        if (filter === "read") return m.read;
        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return "Az önce";
        if (mins < 60) return `${mins} dakika önce`;
        if (hours < 24) return `${hours} saat önce`;
        if (days < 7) return `${days} gün önce`;
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const handleRead = (id) => {
        dispatch(markMessageAsRead(id));
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
            dispatch(deleteContactMessage(id));
            if (expandedId === id) setExpandedId(null);
        }
    };

    const toggleExpand = (m) => {
        if (!m.read) handleRead(m.id);
        setExpandedId(prev => prev === m.id ? null : m.id);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <>
            <style>{`
                /* ── Header ── */
                .msg-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 28px;
                }
                .msg-title-area { display: flex; align-items: center; gap: 14px; }
                .msg-unread-badge {
                    display: inline-flex; align-items: center; justify-content: center;
                    min-width: 26px; height: 26px; padding: 0 8px;
                    background: #3b82f6; color: #fff;
                    border-radius: 100px; font-size: 12px; font-weight: 700;
                }

                /* ── Filter tabs ── */
                .msg-filters {
                    display: flex; gap: 6px; flex-wrap: wrap;
                }
                .msg-filter-btn {
                    padding: 7px 16px; border-radius: 20px;
                    border: 1.5px solid var(--border);
                    background: transparent; color: var(--text-muted);
                    font-size: 13px; font-weight: 500; cursor: pointer;
                    transition: all 0.2s;
                }
                .msg-filter-btn:hover { border-color: var(--primary); color: var(--primary); }
                .msg-filter-btn.active {
                    background: var(--primary); border-color: var(--primary);
                    color: #fff;
                }

                /* ── Message list ── */
                .msg-list { display: flex; flex-direction: column; gap: 10px; }

                /* ── Message card ── */
                .msg-card {
                    background: #fff;
                    border-radius: 14px;
                    border: 1.5px solid var(--border);
                    overflow: hidden;
                    transition: all 0.25s;
                    cursor: pointer;
                }
                .msg-card:hover { border-color: #93c5fd; box-shadow: 0 4px 12px rgba(59,130,246,0.1); }
                .msg-card.unread {
                    border-left: 4px solid var(--primary);
                    background: rgba(59,130,246,0.02);
                }
                .msg-card.expanded { border-color: var(--primary); }

                /* ── Card header ── */
                .msg-card__head {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px 20px;
                }
                @media (max-width: 600px) {
                    .msg-card__head { padding: 14px 16px; gap: 10px; flex-wrap: wrap; }
                }

                /* ── Avatar ── */
                .msg-avatar {
                    width: 42px; height: 42px; border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #1e40af);
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 15px; font-weight: 700;
                    flex-shrink: 0; text-transform: uppercase;
                }
                .msg-avatar.read {
                    background: linear-gradient(135deg, #9ca3af, #6b7280);
                }

                /* ── Card info ── */
                .msg-card__info { flex: 1; min-width: 0; }
                .msg-card__name-row {
                    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
                    margin-bottom: 3px;
                }
                .msg-card__name {
                    font-size: 15px; font-weight: 700;
                    color: var(--dark); white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis;
                }
                .msg-card__new-badge {
                    display: inline-flex; align-items: center;
                    padding: 2px 8px; background: #3b82f6; color: #fff;
                    border-radius: 100px; font-size: 10px; font-weight: 700;
                    letter-spacing: 0.05em; text-transform: uppercase;
                }
                .msg-card__meta {
                    font-size: 12px; color: var(--text-muted);
                    display: flex; gap: 12px; flex-wrap: wrap;
                }
                .msg-card__preview {
                    font-size: 13px; color: var(--text-muted);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    max-width: 400px; margin-top: 4px;
                }
                @media (max-width: 600px) {
                    .msg-card__preview { max-width: 200px; }
                }

                /* ── Card actions ── */
                .msg-card__actions {
                    display: flex; align-items: center; gap: 8px;
                    flex-shrink: 0;
                }
                .msg-card__time {
                    font-size: 12px; color: var(--text-muted);
                    white-space: nowrap;
                }
                @media (max-width: 480px) {
                    .msg-card__time { display: none; }
                }

                /* ── Expanded body ── */
                .msg-card__body {
                    padding: 0 20px 20px;
                    border-top: 1px solid var(--border);
                    animation: slideDown 0.2s ease;
                }
                @media (max-width: 600px) {
                    .msg-card__body { padding: 0 16px 16px; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── Body grid ── */
                .msg-body-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 12px;
                    padding: 16px 0;
                    margin-bottom: 16px;
                }
                .msg-body-field {}
                .msg-body-field__label {
                    font-size: 10px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 4px;
                }
                .msg-body-field__value {
                    font-size: 13px; color: var(--text); font-weight: 500;
                }
                .msg-body-field__value a {
                    color: var(--primary); text-decoration: none;
                }
                .msg-body-field__value a:hover { text-decoration: underline; }

                /* ── Message text ── */
                .msg-body-message {
                    background: var(--bg-1); border-radius: 12px;
                    padding: 16px; font-size: 14px; line-height: 1.7;
                    color: var(--text); white-space: pre-wrap; word-break: break-word;
                    border: 1px solid var(--border);
                }

                /* ── Footer actions ── */
                .msg-body-footer {
                    display: flex; align-items: center;
                    justify-content: space-between; flex-wrap: wrap;
                    gap: 10px; padding-top: 16px;
                }
                .msg-body-footer__left {
                    font-size: 12px; color: var(--text-muted);
                }
                .msg-body-footer__right { display: flex; gap: 8px; }

                /* ── Quick reply ── */
                .msg-reply-link {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 8px 16px; border-radius: 8px;
                    background: var(--primary); color: #fff;
                    font-size: 13px; font-weight: 600;
                    text-decoration: none; transition: all 0.2s;
                }
                .msg-reply-link:hover { background: var(--primary-dark); }

                /* ── Divider ── */
                .msg-card__divider {
                    height: 1px; background: var(--border); margin: 0 20px;
                }

                /* ── Empty ── */
                .msg-empty {
                    text-align: center; padding: 80px 20px;
                    background: #fff; border-radius: 16px;
                    border: 1px solid var(--border);
                }
                .msg-empty__icon {
                    font-size: 48px; margin-bottom: 16px; opacity: 0.4;
                }
                .msg-empty h5 { color: var(--text-muted); font-weight: 600; margin-bottom: 8px; }
                .msg-empty p { color: #bbb; font-size: 14px; margin: 0; }

                /* ── Stats bar ── */
                .msg-stats {
                    display: flex; gap: 16px; flex-wrap: wrap;
                    margin-bottom: 20px;
                }
                .msg-stat {
                    display: flex; flex-direction: column;
                    padding: 14px 20px; border-radius: 12px;
                    background: #fff; border: 1px solid var(--border);
                    min-width: 100px; flex: 1;
                }
                .msg-stat__num {
                    font-size: 24px; font-weight: 700; color: var(--primary);
                    line-height: 1;
                }
                .msg-stat__label { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
            `}</style>

            {/* ── Header ── */}
            <div className="msg-header">
                <div className="msg-title-area">
                    <h1 className="page-title" style={{ margin: 0 }}>İletişim Mesajları</h1>
                    {unreadCount > 0 && (
                        <span className="msg-unread-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="msg-filters">
                    {[
                        { key: "all", label: `Tümü (${messages.length})` },
                        { key: "unread", label: `Okunmamış (${unreadCount})` },
                        { key: "read", label: `Okunmuş (${messages.length - unreadCount})` }
                    ].map(f => (
                        <button key={f.key}
                            className={`msg-filter-btn ${filter === f.key ? "active" : ""}`}
                            onClick={() => setFilter(f.key)}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="msg-stats">
                <div className="msg-stat">
                    <span className="msg-stat__num">{messages.length}</span>
                    <span className="msg-stat__label">Toplam Mesaj</span>
                </div>
                <div className="msg-stat">
                    <span className="msg-stat__num" style={{ color: "#3b82f6" }}>{unreadCount}</span>
                    <span className="msg-stat__label">Okunmamış</span>
                </div>
                <div className="msg-stat">
                    <span className="msg-stat__num" style={{ color: "#10b981" }}>{messages.length - unreadCount}</span>
                    <span className="msg-stat__label">Okunmuş</span>
                </div>
            </div>

            {/* ── Liste ── */}
            {filtered.length === 0 ? (
                <div className="msg-empty">
                    <div className="msg-empty__icon">📭</div>
                    <h5>
                        {filter === "unread" ? "Okunmamış mesaj yok" :
                            filter === "read" ? "Okunmuş mesaj yok" :
                                "Henüz mesaj gelmemiş"}
                    </h5>
                    <p>
                        {filter === "all"
                            ? "İletişim formundan gelen mesajlar burada görüntülenecek"
                            : "Filtreni değiştirmeyi dene"}
                    </p>
                </div>
            ) : (
                <div className="msg-list">
                    {filtered.map(m => {
                        const isExpanded = expandedId === m.id;
                        const initials = m.name
                            ? m.name.split(" ").map(w => w[0]).slice(0, 2).join("")
                            : "?";

                        return (
                            <div key={m.id}
                                className={`msg-card ${!m.read ? "unread" : ""} ${isExpanded ? "expanded" : ""}`}
                                onClick={() => toggleExpand(m)}>

                                {/* ── Card Head ── */}
                                <div className="msg-card__head">
                                    <div className={`msg-avatar ${m.read ? "read" : ""}`}>
                                        {initials}
                                    </div>
                                    <div className="msg-card__info">
                                        <div className="msg-card__name-row">
                                            <span className="msg-card__name">{m.name}</span>
                                            {!m.read && <span className="msg-card__new-badge">Yeni</span>}
                                            {m.service && (
                                                <span style={{
                                                    fontSize: "11px", padding: "2px 8px",
                                                    background: "#f3f4f6", borderRadius: "100px",
                                                    color: "#6b7280"
                                                }}>
                                                    {m.service}
                                                </span>
                                            )}
                                        </div>
                                        <div className="msg-card__meta">
                                            <span> {m.email}</span>
                                            {m.phone && <span> {m.phone}</span>}
                                            {m.company && <span> {m.company}</span>}
                                        </div>
                                        {!isExpanded && (
                                            <div className="msg-card__preview">
                                                {m.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="msg-card__actions">
                                        <span className="msg-card__time">{formatDate(m.createdAt)}</span>
                                        <button
                                            onClick={(e) => handleDelete(e, m.id)}
                                            className="btn btn-sm btn-outline-danger"
                                            title="Sil"
                                        >
                                            Sil
                                        </button>
                                        <span style={{
                                            fontSize: "16px", color: "#9ca3af",
                                            transition: "transform 0.2s",
                                            transform: isExpanded ? "rotate(180deg)" : "none",
                                            display: "inline-block"
                                        }}>▾</span>
                                    </div>
                                </div>

                                {/* ── Expanded Body ── */}
                                {isExpanded && (
                                    <>
                                        <div className="msg-card__divider" />
                                        <div className="msg-card__body" onClick={e => e.stopPropagation()}>

                                            {/* Meta bilgiler grid */}
                                            <div className="msg-body-grid">
                                                <div className="msg-body-field">
                                                    <div className="msg-body-field__label">Ad Soyad</div>
                                                    <div className="msg-body-field__value">{m.name}</div>
                                                </div>
                                                <div className="msg-body-field">
                                                    <div className="msg-body-field__label">E-Posta</div>
                                                    <div className="msg-body-field__value">
                                                        <a href={`mailto:${m.email}`}>{m.email}</a>
                                                    </div>
                                                </div>
                                                {m.phone && (
                                                    <div className="msg-body-field">
                                                        <div className="msg-body-field__label">Telefon</div>
                                                        <div className="msg-body-field__value">
                                                            <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>
                                                        </div>
                                                    </div>
                                                )}
                                                {m.company && (
                                                    <div className="msg-body-field">
                                                        <div className="msg-body-field__label">Şirket</div>
                                                        <div className="msg-body-field__value">{m.company}</div>
                                                    </div>
                                                )}
                                                {m.service && (
                                                    <div className="msg-body-field">
                                                        <div className="msg-body-field__label">İstenen Hizmet</div>
                                                        <div className="msg-body-field__value">{m.service}</div>
                                                    </div>
                                                )}
                                                {m.budget && (
                                                    <div className="msg-body-field">
                                                        <div className="msg-body-field__label">Bütçe</div>
                                                        <div className="msg-body-field__value">{m.budget}</div>
                                                    </div>
                                                )}
                                                <div className="msg-body-field">
                                                    <div className="msg-body-field__label">Gönderim Tarihi</div>
                                                    <div className="msg-body-field__value">{formatDate(m.createdAt)}</div>
                                                </div>
                                                <div className="msg-body-field">
                                                    <div className="msg-body-field__label">Durum</div>
                                                    <div className="msg-body-field__value">
                                                        <span style={{
                                                            padding: "3px 10px", borderRadius: "100px",
                                                            fontSize: "12px", fontWeight: "600",
                                                            background: m.read ? "#d1fae5" : "#dbeafe",
                                                            color: m.read ? "#065f46" : "#1e40af"
                                                        }}>
                                                            {m.read ? "✓ Okundu" : "● Okunmamış"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mesaj içeriği */}
                                            <div style={{ marginBottom: "16px" }}>
                                                <div className="msg-body-field__label" style={{ marginBottom: "8px" }}>
                                                    Mesaj İçeriği
                                                </div>
                                                <div className="msg-body-message">{m.message}</div>
                                            </div>

                                            {/* Footer */}
                                            <div className="msg-body-footer">
                                                <div className="msg-body-footer__left">
                                                    ID: #{m.id}
                                                </div>
                                                <div className="msg-body-footer__right">
                                                    {m.phone && (
                                                        <a href={`https://wa.me/9${m.phone.replace(/\D/g, "")}`}
                                                            target="_blank" rel="noreferrer"
                                                            className="msg-reply-link"
                                                            style={{ background: "#25d366" }}>
                                                            WhatsApp
                                                        </a>
                                                    )}
                                                    <a href={`mailto:${m.email}`}
                                                        className="msg-reply-link">
                                                        Yanıtla
                                                    </a>
                                                    <button
                                                        onClick={(e) => handleDelete(e, m.id)}
                                                        className="btn btn-sm btn-outline-danger">
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default AdminContactMessages;
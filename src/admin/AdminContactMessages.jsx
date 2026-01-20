import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchContactMessages,
    markAsRead
} from "../redux/contactSlice";

const AdminContactMessages = () => {
    const dispatch = useDispatch();
    const { messages, loading } = useSelector(state => state.contact);

    useEffect(() => {
        dispatch(fetchContactMessages());
    }, [dispatch]);

    const unreadCount = messages.filter(m => !m.read).length;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <h1 className="page-title">İletişim Mesajları</h1>

            {unreadCount > 0 && (
                <div className="alert alert-warning">
                    <strong>{unreadCount}</strong> okunmamış mesajınız bulunmaktadır.
                </div>
            )}

            {messages.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz mesaj gelmemiş</h5>
                    <p>İletişim formundan gelen mesajlar burada görüntülenecek</p>
                </div>
            ) : (
                <div className="message-list">
                    {messages.map(m => (
                        <div
                            key={m.id}
                            className={`message-card ${!m.read ? "unread" : ""}`}
                            onClick={() => {
                                if (!m.read) {
                                    try {
                                        dispatch(markAsRead(m.id)).then(result => {
                                            if (result.payload) {
                                                console.log("Mesaj okundu olarak işaretlendi:", m.id);
                                            }
                                        }).catch(err => {
                                            console.error("Hata:", err);
                                        });
                                    } catch (err) {
                                        console.error("Dispatch hatası:", err);
                                    }
                                }
                            }}
                            style={{ cursor: !m.read ? "pointer" : "default" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <div style={{ flex: 1 }}>
                                    <h6>{m.name}</h6>
                                    <small>{m.email}</small>
                                    <p>{m.message}</p>
                                </div>
                                <div style={{ marginLeft: "20px", textAlign: "right", whiteSpace: "nowrap" }}>
                                    <small style={{ color: "#999", display: "block", marginBottom: "8px" }}>
                                        {formatDate(m.createdAt)}
                                    </small>
                                    {!m.read && (
                                        <span style={{
                                            display: "inline-block",
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: "#111",
                                            borderRadius: "50%"
                                        }}></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default AdminContactMessages;
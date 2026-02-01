import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiGoogleassistant } from "react-icons/si";

const LiveChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Merhaba! Ben Algorixa Asistanınızım.\n\nSize nasıl yardımcı olabilirim?",
            sender: "bot",
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const quickReplies = [
        { text: "Fiyat bilgisi", key: "fiyat" },
        { text: "İletişim", key: "iletisim" },
        { text: "Portföy", key: "portfolio" }
    ];

    const botResponses = {
        fiyat: {
            text: "Paket Fiyatlarımız:\n\nBaşlangıç: 18.900₺\nKurumsal: 32.900₺\nÖzel Yazılım: 54.900₺+\n\nDetaylı bilgi için fiyatlandırma bölümünü inceleyebilirsiniz!",
            delay: 1000,
            action: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
        },
        iletisim: {
            text: "Bize Ulaşın:\n\nWhatsApp: +90 546 970 54 51\nE-posta: enesderin.contact@gmail.com\n\nHemen WhatsApp'tan yazabilirsiniz!",
            delay: 800,
            action: () => window.open("https://wa.me/905469705451", "_blank")
        },
        portfolio: {
            text: "Projelerimizi görmek için portföy bölümüne bakabilirsiniz!\n\n50+ başarılı proje...",
            delay: 800,
            action: () => {
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => setIsOpen(false), 1500);
            }
        },
        default: {
            text: "Size nasıl yardımcı olabilirim? Aşağıdaki seçeneklerden birini kullanabilir veya doğrudan bana yazabilirsiniz!",
            delay: 800
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleQuickReply = (key) => {
        const replyText = quickReplies.find(q => q.key === key)?.text || "";
        handleSendMessage(replyText, key);
    };

    const handleSendMessage = (text = inputValue, actionKey = null) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: "user",
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Bot yanıtı
        const responseKey = Object.keys(botResponses).find(key =>
            text.toLowerCase().includes(key.toLowerCase())
        ) || actionKey || 'default';

        const response = botResponses[responseKey];

        setTimeout(() => {
            setIsTyping(false);
            const botMessage = {
                id: Date.now() + 1,
                text: response.text,
                sender: "bot",
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);

            if (response.action) {
                setTimeout(response.action, 1000);
            }
        }, response.delay);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                className="chat-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                    border: 'none',
                    color: '#000',
                    fontSize: '24px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(212, 182, 118, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: 90 }}
                        >
                            ✕
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: -90 }}
                        >
                            <SiGoogleassistant size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-widget-minimal"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '24px',
                            width: '360px',
                            maxWidth: 'calc(100vw - 48px)',
                            height: '500px',
                            maxHeight: 'calc(100vh - 140px)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 999
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid var(--border-subtle)',
                            background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-card))'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    fontWeight: '700'
                                }}>
                                    A
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                                        Algorixa Asistan
                                    </h4>
                                    <span style={{ fontSize: '12px', color: 'var(--brand-main)' }}>
                                        Size Yardımcı Oluyorum
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'flex-start',
                                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                                    }}
                                >
                                    {message.sender === 'bot' && (
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            flexShrink: 0,
                                            color: '#000'
                                        }}>
                                            A
                                        </div>
                                    )}
                                    <div style={{ maxWidth: '70%' }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            background: message.sender === 'bot'
                                                ? 'rgba(212, 182, 118, 0.12)'
                                                : 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                                            color: message.sender === 'bot' ? 'var(--text-primary)' : '#000',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            whiteSpace: 'pre-line'
                                        }}>
                                            {message.text}
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            color: 'var(--text-dimmed)',
                                            display: 'block',
                                            marginTop: '4px',
                                            textAlign: message.sender === 'user' ? 'right' : 'left'
                                        }}>
                                            {message.time}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#000'
                                    }}>
                                        A
                                    </div>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        background: 'rgba(212, 182, 118, 0.12)',
                                        display: 'flex',
                                        gap: '4px'
                                    }}>
                                        <span style={{ animation: 'pulse 1.5s infinite', color: 'var(--brand-main)' }}>●</span>
                                        <span style={{ animation: 'pulse 1.5s infinite 0.2s', color: 'var(--brand-main)' }}>●</span>
                                        <span style={{ animation: 'pulse 1.5s infinite 0.4s', color: 'var(--brand-main)' }}>●</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <div style={{
                            padding: '12px 20px',
                            borderTop: '1px solid var(--border-subtle)',
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                        }}>
                            {quickReplies.map((reply) => (
                                <button
                                    key={reply.key}
                                    onClick={() => handleQuickReply(reply.key)}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '999px',
                                        border: '1px solid var(--border-medium)',
                                        background: 'rgba(212, 182, 118, 0.08)',
                                        color: 'var(--brand-main)',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(212, 182, 118, 0.15)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(212, 182, 118, 0.08)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {reply.text}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border-subtle)',
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <input
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '999px',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'rgba(10, 10, 10, 0.6)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: inputValue.trim()
                                        ? 'linear-gradient(135deg, var(--brand-main), var(--brand-accent))'
                                        : 'rgba(100, 100, 100, 0.3)',
                                    color: inputValue.trim() ? '#000' : 'var(--text-muted)',
                                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700'
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default LiveChatWidget;
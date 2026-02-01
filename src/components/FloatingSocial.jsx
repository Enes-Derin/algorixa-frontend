import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const FloatingSocial = () => {
    const socials = [
        { href: "https://wa.me/905469705451", icon: <FaWhatsapp />, label: "WhatsApp" },
        { href: "https://instagram.com/algorixa_", icon: <FaInstagram />, label: "Instagram" },
        { href: "mailto:enesderin.contact@gmail.com", icon: <FaEnvelope />, label: "Email" }
    ];

    return (
        <div className="floating-social">
            {socials.map((social, i) => (
                <motion.a
                    key={i}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span style={{ fontSize: '22px' }}>{social.icon}</span>
                </motion.a>
            ))}
        </div>
    );
};

export default FloatingSocial;
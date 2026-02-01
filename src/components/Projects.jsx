import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

const Projects = () => {
    const dispatch = useDispatch();
    const { projects = [], loading } = useSelector((state) => state.project) || {};

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.9 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        })
    };

    // Eğer proje yoksa bölümü gösterme
    if (!loading && projects.length === 0) {
        return null;
    }

    return (
        <section id="projects" className="projects-modern-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 70, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    Diğer Referanslarımız
                </motion.h2>

                {/* Loading State */}
                {loading && (
                    <motion.div
                        className="projects-loading-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="loading-spinner-modern"></div>
                        <p>Projeler yükleniyor...</p>
                    </motion.div>
                )}

                {/* Projects Grid */}
                <div className="projects-modern-grid">
                    <AnimatePresence mode="wait">
                        {projects.map((project, index) => (
                            <motion.article
                                key={project.id}
                                className="project-modern-card"
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                variants={cardVariants}
                            >
                                {/* Image Container with Overlay */}
                                <div className="project-image-container">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            loading="lazy"
                                            className="project-image"
                                        />
                                    ) : (
                                        <div className="project-no-image">
                                            <div className="no-image-icon">🖼️</div>
                                            <p>Proje Görseli</p>
                                        </div>
                                    )}

                                    {/* Hover Overlay with Content */}
                                    <div className="project-overlay-content">
                                        <div className="overlay-inner">
                                            <h3 className="project-title">{project.title}</h3>

                                            {project.description && (
                                                <p className="project-description">{project.description}</p>
                                            )}

                                            {project.link && (
                                                <motion.a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="project-visit-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaExternalLinkAlt />
                                                    <span>Siteyi Ziyaret Et</span>
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Projects;
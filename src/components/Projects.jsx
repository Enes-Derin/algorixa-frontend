import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectSlice";

const Projects = () => {
    const dispatch = useDispatch();
    const { projects = [], loading } =
        useSelector((state) => state.project) || {};

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Referanslar</h2>

                {loading && (
                    <p className="text-center text-muted">Yükleniyor...</p>
                )}

                {!loading && projects.length === 0 && (
                    <p className="text-center text-muted">
                        Henüz proje eklenmedi.
                    </p>
                )}

                <div className="projects-grid">
                    {projects.map((project) => (
                        <article className="project-card" key={project.id}>
                            {/* IMAGE */}
                            <div
                                className="project-cover"
                                style={{
                                    backgroundImage: project.imageUrl
                                        ? `url(${project.imageUrl})`
                                        : "none",
                                }}
                            >
                                {!project.imageUrl && (
                                    <div className="project-no-image">
                                        Görsel yok
                                    </div>
                                )}

                                {/* DESKTOP OVERLAY */}
                                <div className="project-overlay desktop-only">
                                    <div className="project-meta">
                                        <h5>{project.title}</h5>

                                        {project.description && (
                                            <p className="project-desc">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-btn"
                                            >
                                                Siteyi İncele
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE CONTENT */}
                            <div className="project-mobile-content mobile-only">
                                <h5>{project.title}</h5>

                                {project.description && (
                                    <p className="project-desc">
                                        {project.description}
                                    </p>
                                )}

                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-btn"
                                    >
                                        Siteyi İncele
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;

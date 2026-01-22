import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectSlice";

const Projects = () => {
    const dispatch = useDispatch();

    const { projects = [], loading } = useSelector(
        (state) => state.project
    ) || {};

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Referanslar</h2>

                {loading && (
                    <p className="text-center text-muted">
                        Yükleniyor...
                    </p>
                )}

                {!loading && projects.length === 0 && (
                    <p className="text-center text-muted">
                        Henüz proje eklenmedi.
                    </p>
                )}

                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            className="project-item"
                            key={project.id}
                            style={{ position: "relative" }}
                        >
                            {project.imageUrl ? (
                                <div
                                    className="project-image"
                                    style={{
                                        backgroundImage: `url(${project.imageUrl})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}
                                />
                            ) : (
                                <div className="project-image">
                                    📸 Görsel yok
                                </div>
                            )}

                            <div
                                className="project-content"
                                style={{ paddingBottom: "64px" }}
                            >
                                <h5>{project.title}</h5>
                                <p>{project.description}</p>

                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link"
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        bottom: "16px"
                                    }}   // 👈 sol alta sabitle
                                >
                                    Ziyaret Et
                                </a>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default Projects;

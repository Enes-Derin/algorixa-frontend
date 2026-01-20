import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectSlice";

const Projects = () => {
    const dispatch = useDispatch();

    const { projects, loading } = useSelector(
        (state) => state.project
    );

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Örnek Projeler</h2>

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

                <div className="row g-4">
                    {projects.map((project) => (
                        <div className="col-md-4" key={project.id}>
                            <div className="project-card">
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
                                    <div
                                        className="project-image"
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#999"
                                        }}
                                    >
                                        Görsel yok
                                    </div>
                                )}

                                <h5>{project.title}</h5>
                                <p>{project.description}</p>

                                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-dark"
                                            style={{ flex: 1, textAlign: "center" }}
                                        >
                                            Projeyi Gör
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;

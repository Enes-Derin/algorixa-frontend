import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProjects,
    createProject,
    deleteProject
} from "../redux/projectSlice";

const AdminProject = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector(state => state.project);

    const [form, setForm] = useState({
        title: "",
        description: "",
        link: "",
        image: null
    });

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.title || !form.description || !form.image) {
            setError("Lütfen tüm alanları doldurunuz");
            return;
        }

        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("link", form.link || "");
        fd.append("imageUrl", form.image); // Backend "imageUrl" field'ını bekliyor

        try {
            await dispatch(createProject(fd)).unwrap();
            setSuccess("Proje başarıyla eklendi!");
            setForm({ title: "", description: "", link: "", image: null });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Proje eklenirken bir hata oluştu");
        }
    };

    const handleDelete = (projectId) => {
        if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
            dispatch(deleteProject(projectId));
        }
    };

    return (
        <>
            <h1 className="page-title">Projeler</h1>

            {/* CREATE FORM */}
            <div className="admin-form">
                <h5 style={{ marginBottom: "20px" }}>Yeni Proje Ekle</h5>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Proje Başlığı *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Proje başlığını giriniz"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Açıklama *</label>
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="Proje açıklamasını giriniz"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Proje Linki</label>
                        <input

                            name="link"
                            className="form-control"
                            placeholder="https://example.com"
                            value={form.link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Proje Görseli *</label>
                        <input
                            type="file"
                            name="image"
                            className="form-control"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
                        <small className="text-muted">JPG, PNG formatında görsel yükleyiniz (Cloudinary'ye yüklenecek)</small>
                    </div>

                    <button type="submit" className="btn btn-dark">
                        Proje Ekle
                    </button>
                </form>
            </div>

            {/* PROJECTS LIST */}
            <h5 style={{ marginTop: "40px", marginBottom: "20px" }}>Yayınlanan Projeler ({projects.length})</h5>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            ) : projects.length === 0 ? (
                <div className="empty-state">
                    <h5>Henüz proje eklenmemiş</h5>
                    <p>Yukarıdaki formu kullanarak yeni bir proje ekleyiniz</p>
                </div>
            ) : (
                <div className="project-grid">
                    {projects.map(p => (
                        <div className="project-card" key={p.id}>
                            <img
                                src={p.imageUrl || "/placeholder.png"}
                                alt={p.title}
                                onError={(e) => e.target.src = "/placeholder.png"}
                            />
                            <div className="project-card-content">
                                <h6>{p.title}</h6>
                                <p>{p.description}</p>
                                {p.link && (
                                    <a
                                        href={p.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: "12px", color: "#111" }}
                                    >
                                        Projeyi Ziyaret Et →
                                    </a>
                                )}
                            </div>
                            <div className="project-card-actions">
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default AdminProject;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiInstance from "../api/ApiInstance";
import loginSuccess from "../redux/authSlice";
import "./login.css";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await apiInstance.post("/auth/login", form);

            const { accessToken, role } = res.data.data;

            // Token'ı Redux'a kaydet (memory'de)
            dispatch(
                loginSuccess({
                    accessToken,
                    role
                })
            );

            // Admin paneline yönlendir
            navigate("/admin");

        } catch (err) {
            setError(err.response?.data?.message || "Kullanıcı adı veya şifre hatalı");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-brand">Algorixa</span>
                    <p>Yönetim Paneli</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            required
                            value={form.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label>Şifre</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                        disabled={loading}
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

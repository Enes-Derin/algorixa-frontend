import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { getAccessToken } from "./utils/tokenService";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";

// Admin Layout & Components
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProject from "./admin/AdminProject";
import AdminContactMessages from "./admin/AdminContactMessages";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  // localStorage'daki token'ı kontrol et (page refresh'te kalması için)
  const localToken = getAccessToken();

  if (!token && !localToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  // Uygulama başladığında localStorage'dan token'ı Redux'a yükle
  useEffect(() => {
    const savedToken = getAccessToken();
    if (savedToken) {
      // Token Redux state'e yüklenmeli (authSlice'da initialState ayarlanmalı)
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProject />} />
          <Route path="messages" element={<AdminContactMessages />} />
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

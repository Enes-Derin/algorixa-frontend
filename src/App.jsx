// App.jsx - COMPLETE REVİZE
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingSocial from "./components/FloatingSocial";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";

// Admin Pages
import Login from "./pages/Login";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBlog from "./admin/AdminBlog";
import AdminPortfolio from "./admin/AdminPortfolio";
import AdminPricing from "./admin/AdminPricing";
import AdminMaintenance from "./admin/AdminMaintenance";
import AdminCampaign from "./admin/AdminCampaign";
import AdminContactMessages from "./admin/AdminContactMessages";


import "./App.css";
import ScrollToTop from "./components/ScrollToTop";

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/admin/login" replace />;
};

// Public Layout Wrapper
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <FloatingSocial />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/hizmetler" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/referanslar" element={<PublicLayout><Portfolio /></PublicLayout>} />
          <Route path="/fiyatlandirma" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/hakkimizda" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/iletisim" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><Blog /></PublicLayout>} />

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN PROTECTED ROUTES */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="maintenance" element={<AdminMaintenance />} />
            <Route path="campaign" element={<AdminCampaign />} />
            <Route path="messages" element={<AdminContactMessages />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
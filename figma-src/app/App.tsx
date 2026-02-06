import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";

// Layouts
import { CustomerLayout } from "./components/CustomerLayout";
import { AdminLayout } from "./components/AdminLayout";

// Customer Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import RequestQuote from "./pages/RequestQuote";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminCalendar from "./pages/admin/AdminCalendar";
import Appointments from "./pages/admin/Appointments";
import AdminQuotes from "./pages/admin/AdminQuotes";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import ContentAdmin from "./pages/admin/ContentAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import FeatureFlags from "./pages/admin/FeatureFlags";
import Settings from "./pages/admin/Settings";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Customer Routes */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />
        <Route
          path="/servicii"
          element={
            <CustomerLayout>
              <Services />
            </CustomerLayout>
          }
        />
        <Route
          path="/programare"
          element={
            <CustomerLayout>
              <Booking />
            </CustomerLayout>
          }
        />
        <Route
          path="/cere-oferta"
          element={
            <CustomerLayout>
              <RequestQuote />
            </CustomerLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <CustomerLayout>
              <Contact />
            </CustomerLayout>
          }
        />
        <Route
          path="/cont"
          element={
            <CustomerLayout>
              <Account />
            </CustomerLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <AdminLayout>
              <AdminCalendar />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <AdminLayout>
              <Appointments />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <AdminLayout>
              <AdminQuotes />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminLayout>
              <ServicesAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminLayout>
              <ContentAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UsersAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/feature-flags"
          element={
            <AdminLayout>
              <FeatureFlags />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

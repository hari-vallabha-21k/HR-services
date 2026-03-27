import './App.css'
import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/landingpage'
import LoginPage from './pages/LoginPage'
import ClientDashboard from './pages/ClientDashboard'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ServiceIntakePage from './pages/ServiceIntakePage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      {/* Landing - Explain what HV Consultancy does */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Services - Browse all available services (NO login required) */}
      <Route path="/services" element={<ServicesPage />} />
      
      {/* Service Detail - Learn about specific service before deciding */}
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      
      {/* Login - Only when user decides to take action */}
      <Route path="/login" element={<LoginPage />} />

      {/* ===== PROTECTED ROUTES (Login Required) ===== */}
      {/* Dashboard - Main hub for logged-in users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      {/* My Services - View and manage active services */}
      <Route path="/dashboard/services" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      {/* New Service Intake - Start a new service */}
      <Route path="/dashboard/services/new" element={
        <ProtectedRoute>
          <ServiceIntakePage />
        </ProtectedRoute>
      } />
      
      {/* Service Detail/Tracking - View specific service status */}
      <Route path="/dashboard/services/:id" element={
        <ProtectedRoute>
          <ServiceIntakePage />
        </ProtectedRoute>
      } />

      {/* Admin Dashboard - For admin users */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Legacy routes - redirect to new structure */}
      <Route path="/client-dashboard" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App

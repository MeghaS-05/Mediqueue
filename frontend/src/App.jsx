import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';

import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard  from './pages/doctor/DoctorDashboard';
import AdminOverview    from './pages/admin/AdminOverview';
import Analytics        from './pages/admin/Analytics';
import PatientHistory   from './pages/history/PatientHistory';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Navigate to="/login" replace />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient" element={
          <ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute role="PATIENT"><PatientHistory /></ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN"><AdminOverview /></ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="ADMIN"><Analytics /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
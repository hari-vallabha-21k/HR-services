import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (loading || (user && role === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // If not logged in, redirect to login with return URL
  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  // Role-based route protection
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isClientRoute = location.pathname.startsWith('/dashboard')

  if (role === 'admin' && isClientRoute) {
    return <Navigate to="/admin" replace />
  }

  if (role === 'client' && isAdminRoute) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

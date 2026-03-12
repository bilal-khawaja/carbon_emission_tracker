import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check admin access if required
    if (adminOnly && user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
                        <h2 className="text-2xl font-semibold text-red-800 mb-4">Access Denied</h2>
                        <p className="text-red-700 mb-6">
                            You need administrator privileges to access this page.
                        </p>
                        <Navigate to="/dashboard" replace />
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
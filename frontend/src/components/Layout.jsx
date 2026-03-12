import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Settings,
    Calendar,
    BarChart3,
    Info,
    LogOut,
    LogIn,
    Leaf,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Layout = ({ children }) => {
    const { logout, user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/dashboard'); // Redirect to dashboard after logout
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
        { name: 'Reports', href: '/reports', icon: BarChart3, current: location.pathname === '/reports' },
        { name: 'About', href: '/about', icon: Info, current: location.pathname === '/about' },
    ];

    // Admin-only navigation
    const adminNavigation = [
        { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
        { name: 'Daily Entry', href: '/daily-entry', icon: Calendar, current: location.pathname === '/daily-entry' },
    ];

    const NavItems = ({ mobile = false }) => (
        <>
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    className={`${item.current
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${mobile ? 'w-full' : ''
                        }`}
                    onClick={() => mobile && setSidebarOpen(false)}
                >
                    <item.icon
                        className={`${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                            } mr-3 h-5 w-5 flex-shrink-0`}
                    />
                    {item.name}
                </Link>
            ))}

            {isAuthenticated && user?.role === 'admin' && (
                <>
                    <div className="mt-6 mb-2">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Admin
                        </h3>
                    </div>
                    {adminNavigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`${item.current
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${mobile ? 'w-full' : ''
                                }`}
                            onClick={() => mobile && setSidebarOpen(false)}
                        >
                            <item.icon
                                className={`${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    } mr-3 h-5 w-5 flex-shrink-0`}
                            />
                            {item.name}
                        </Link>
                    ))}
                </>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex w-full max-w-xs flex-col bg-white shadow-xl">
                    <div className="flex h-16 flex-shrink-0 items-center justify-between px-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Carbon Tracker</span>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        <nav className="space-y-1">
                            <NavItems mobile />
                        </nav>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="w-full btn-primary flex items-center justify-center space-x-2"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Admin Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Carbon Tracker</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    <NavItems />
                                </ul>
                            </li>
                            <li className="mt-auto border-t border-gray-200 pt-6">
                                {isAuthenticated ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="w-full btn-primary flex items-center justify-center space-x-2"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span>Admin Login</span>
                                    </button>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="text-gray-700 hover:text-gray-900"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 items-center space-x-3">
                        <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Leaf className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Carbon Tracker</span>
                    </div>

                    {!isAuthenticated && (
                        <button
                            onClick={handleLogin}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Admin Login
                        </button>
                    )}

                    {!isAuthenticated && (
                        <button
                            onClick={handleLogin}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Admin Login
                        </button>
                    )}
                </div>

                {/* Page content */}
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
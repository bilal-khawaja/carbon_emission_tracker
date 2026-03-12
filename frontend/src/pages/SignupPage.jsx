import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Leaf, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const { signup, isLoading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component mounts
    useEffect(() => {
        clearError();
    }, []);

    const onSubmit = async (data) => {
        const result = await signup(data.name, data.email, data.password);
        if (result.success) {
            setSignupSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePassword = (value) => {
        if (value.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (!/(?=.*[a-z])/.test(value)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(value)) {
            return 'Password must contain at least one digit';
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
            return 'Password must contain at least one special character';
        }
        return true;
    };

    if (signupSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="card text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Created!</h2>
                        <p className="text-gray-600 mb-4">
                            Your account has been successfully created. You will be redirected to the login page shortly.
                        </p>
                        <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
                            <span>Go to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md">
                {/* Signup Form */}
                <div className="card">
                    <div className="mb-6">
                        <h2 className="text-2xl ml-27 font-semibold text-gray-900 mb-2">Create Account</h2>
                        <p className="ml-17 text-gray-600">Join the carbon reduction initiative</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters'
                                    }
                                })}
                                type="text"
                                id="name"
                                className="input-field"
                                placeholder="Your full name"
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.com$/i,
                                        message: 'Email must end with .com'
                                    }
                                })}
                                type="email"
                                id="email"
                                className="input-field"
                                placeholder="your.email@gmail.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        validate: validatePassword
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="input-field pr-12"
                                    placeholder="Create a strong password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                            )}
                            {/* <div className="text-xs text-gray-500 mt-1 space-y-1">
                                <p>Password must contain:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li>At least 8 characters</li>
                                    <li>One uppercase and lowercase letter</li>
                                    <li>One digit</li>
                                    <li>One special character (!@#$%^&*)</li>
                                </ul>
                            </div> */}
                        </div>

                        {/* Confirm Password Field */}
                        {/* <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="input-field pr-12"
                                    placeholder="Confirm your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div> */}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>&copy; 2026 University Carbon Footprint Tracker</p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
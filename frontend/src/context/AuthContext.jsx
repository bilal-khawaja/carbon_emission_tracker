import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Action types
const AuthActionTypes = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    SIGNUP_START: 'SIGNUP_START',
    SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
    SIGNUP_FAILURE: 'SIGNUP_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_START:
        case AuthActionTypes.SIGNUP_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };

        case AuthActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null
            };

        case AuthActionTypes.LOGIN_FAILURE:
        case AuthActionTypes.SIGNUP_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload
            };

        case AuthActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: null
            };

        case AuthActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case AuthActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for stored auth data on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                dispatch({
                    type: AuthActionTypes.LOGIN_SUCCESS,
                    payload: { user }
                });
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        }

        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    }, []);

    // Auth actions
    const login = async (email, password) => {
        dispatch({ type: AuthActionTypes.LOGIN_START });

        try {
            // Use real API for authentication
            const response = await authAPI.signin({ email, password });

            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);

                // Create user object - you might want to add user info to the signin response
                const user = {
                    email,
                    name: email.split('@')[0], // Extract name from email for now
                    role: 'admin' // Backend should provide this
                };
                localStorage.setItem('user', JSON.stringify(user));

                dispatch({
                    type: AuthActionTypes.LOGIN_SUCCESS,
                    payload: { user }
                });

                return { success: true };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            const errorMessage = error.message || 'Login failed';
            dispatch({
                type: AuthActionTypes.LOGIN_FAILURE,
                payload: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (name, email, password) => {
        dispatch({ type: AuthActionTypes.SIGNUP_START });

        try {
            await authAPI.signup({ name, email, password });

            dispatch({ type: AuthActionTypes.SIGNUP_SUCCESS });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            dispatch({
                type: AuthActionTypes.SIGNUP_FAILURE,
                payload: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        dispatch({ type: AuthActionTypes.LOGOUT });
    };

    const clearError = () => {
        dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    };

    const value = {
        ...state,
        login,
        signup,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        console.log('Token exists:', !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set');
        } else {
            console.log('No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        console.log('Response data:', response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url);
        console.error('Error details:', error.response?.data);
        console.error('Full error:', error);

        if (error.response?.status === 401) {
            console.log('401 Unauthorized - clearing tokens and redirecting to login');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signup: async (userData) => {
        const response = await apiClient.post('/auth/signup', userData);
        return response.data;
    },

    signin: async (credentials) => {
        const response = await apiClient.post('/auth/signin', credentials);
        return response.data;
    }
};

// Settings API functions (Admin only)
export const settingsAPI = {
    updateUniversityResources: async (resources) => {
        console.log('Calling updateUniversityResources with:', resources);
        try {
            const response = await apiClient.put('/settings/university_resources', resources);
            console.log('updateUniversityResources success:', response.data);
            return response.data;
        } catch (error) {
            console.error('updateUniversityResources failed:', error);
            throw error;
        }
    },

    logDailyConsumption: async (consumptionData) => {
        console.log('Calling logDailyConsumption with:', consumptionData);
        try {
            const response = await apiClient.put('/settings/daily_consumption', consumptionData);
            console.log('logDailyConsumption success:', response.data);
            return response.data;
        } catch (error) {
            console.error('logDailyConsumption failed:', error);
            throw error;
        }
    }
};

export const dataAPI = {
    getDashboardSummary: async () => {
        const response = await apiClient.get('/data/dashboard_summary');
        return response.data;
    },

    getLiveTracker: async (date) => {
        const params = {};
        if (date) params.consumption_date = date;

        const response = await apiClient.get('/data/daily_consumption', { params });
        return response.data;
    },

    getDailyConsumption: async (date) => {
        return await dataAPI.getLiveTracker(date);
    },

    getUniversityAssets: async () => {
        console.log('Calling getUniversityAssets...');
        try {
            const response = await apiClient.get('/data/university_assets');
            console.log('getUniversityAssets success:', response.data);
            return response.data;
        } catch (error) {
            console.error('getUniversityAssets failed:', error);
            throw error;
        }
    },

    getReports: async (reportType = 'weekly', startDate, endDate) => {
        const params = { report_type: reportType };
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const response = await apiClient.get('/data/reports', { params });
        return response.data;
    }
};

export default apiClient;
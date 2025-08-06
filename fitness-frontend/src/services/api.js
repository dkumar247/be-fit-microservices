import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add auth headers
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - clear storage and redirect to login
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Activity endpoints
export const getActivities = () => api.get('/activities');

export const addActivity = (activity) => api.post('/activities', activity);

export const getActivityById = (id) => api.get(`/activities/${id}`);

// Recommendation endpoints
export const getActivityRecommendation = (activityId) => api.get(`/recommendations/activity/${activityId}`);

export const getUserRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);

// Combined call for activity detail with recommendation
export const getActivityDetail = async (id) => {
    try {
        // First get the activity
        const activityResponse = await getActivityById(id);
        const activity = activityResponse.data;

        // Then try to get the recommendation
        try {
            const recommendationResponse = await getActivityRecommendation(id);
            const recommendation = recommendationResponse.data;

            // Merge the data
            return {
                data: {
                    ...activity,
                    recommendation: recommendation.recommendation,
                    improvements: recommendation.improvements,
                    suggestions: recommendation.suggestions,
                    safety: recommendation.safety
                }
            };
        } catch (recError) {
            // If recommendation fails, just return the activity
            console.log('No recommendation available for this activity');
            return { data: activity };
        }
    } catch (error) {
        throw error;
    }
};

// User endpoints
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

export const registerUser = (userData) => api.post('/users/register', userData);

export const validateUser = (userId) => api.get(`/users/${userId}/validate`);
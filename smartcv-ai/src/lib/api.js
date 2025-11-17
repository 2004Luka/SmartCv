import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/"/g, '');

const api = axios.create({
	baseURL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = Cookies.get('token') || localStorage.getItem('token');
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			Cookies.remove('token');
			Cookies.remove('user');
			localStorage.removeItem('token');
		}
		return Promise.reject(error);
	}
);

export default api;



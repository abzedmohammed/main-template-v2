import axios from 'axios';
import { url } from './utils';

const axiosInstance = axios.create({
	baseURL: url,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default axiosInstance;

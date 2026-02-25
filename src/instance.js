import axios from 'axios';
import { url } from './utils';
import { tokenService } from './services/tokenService';

const axiosInstance = axios.create({
    baseURL: url || '/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = tokenService.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;

import axios from 'axios';
import { url } from './utils';
import { tokenService } from './services/tokenService';
import { emitSessionExpired } from './services/sessionEvents';

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

// Surface a forced sign-out when the server rejects an authenticated request.
// Only fires when a session existed, so wrong-credential 401s on login don't
// trigger the expiry flow.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && tokenService.get()) {
            emitSessionExpired('forced-401');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

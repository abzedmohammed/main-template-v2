import axiosInstance from '../instance';

export const adminFetchInAppNotification = {
    queryKey: ['admin-fetch-in-app-notification'],
    queryFn: async () => axiosInstance.get('/fetch_in_app_notification'),
};

export const adminSave = {
    mutationFn: async (body) => {
        return axiosInstance.post('/save', body);
    },
};

export const updateInAppNotification = {
    mutationFn: async (body) => {
        return axiosInstance.put('/update_in_app_notification', body);
    },
};

export const adminRefreshToken = {
    mutationFn: async () => axiosInstance.post('/auth/refresh-session'),
};

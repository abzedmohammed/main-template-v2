import axiosInstance from '../instance';

// FETCH ACTIONS

export const adminFetch = {
	queryKey: ['admin-fetch'],
	queryFn: async (body) => await axiosInstance.post('/fetch', body),
};

export const adminFetchGet = {
	queryKey: ['admin-fetch-get'],
	queryFn: async () => await axiosInstance.get('/fetch_get'),
};

export const adminFetchInAppNotification = {
	queryKey: ['admin-fetch-in-app-notification'],
	queryFn: async () => await axiosInstance.get('/fetch_in_app_notification'),
};


// SAVE & UPDATE ACTIONS

export const adminSave = {
    mutationFn: async (body) => {
        return await axiosInstance.post('/save', body);
    },
};

export const updateInAppNotification = {
    mutationFn: async (body) => {
        return await axiosInstance.put('/update_in_app_notification', body);
    },
};

export const adminRefreshToken = {
	mutationFn: async () => await axiosInstance.post('/auth/refresh-session'),
};


// DELETE ACTIONS

export const adminDeleteNotification = {
	mutationFn: async (deleteId) => await axiosInstance.delete(`/notifications/${deleteId}`),
};

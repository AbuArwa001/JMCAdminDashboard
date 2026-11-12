import api from "../api";

export const getUserById = async (userId: string) => {
    const response = await api.get(`api/v1/users/${userId}/`);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('api/v1/users/me/');
    return response.data;
};

export const updateMe = async (userData: any) => {
    const response = await api.put('api/v1/users/me', userData);
    return response.data;
};

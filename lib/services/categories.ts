import api from "../api";
import { CategoryData } from "../types/finance";

export const getCategories = async (): Promise<CategoryData[]> => {
    try {
        const res = await api.get<any>('api/v1/categories/');
        return Array.isArray(res.data) ? res.data : (res.data?.results || []);
    } catch { return []; }
};

export const getCategoryById = async (id: string): Promise<CategoryData | null> => {
    try {
        const res = await api.get<CategoryData>(`api/v1/categories/${id}/`);
        return res.data;
    } catch { return null; }
};

export const createCategory = async (data: { category_name: string; color: string; }) => {
    const res = await api.post('api/v1/categories/', data);
    return res.data;
};

export const deleteCategory = async (id: string) => {
    await api.delete(`api/v1/categories/${id}/`);
};

export const updateCategory = async (id: string, data: { category_name: string; color: string; }) => {
    const res = await api.put(`api/v1/categories/${id}/`, data);
    return res.data;
};

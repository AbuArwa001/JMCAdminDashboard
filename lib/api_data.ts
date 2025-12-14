import { get } from "http";
import api from "./api";
import { CategoriesResponse, CategoryData, CreateDriveData } from "./data";


export const getCategories = async (): Promise<CategoryData[]> => {
    try {
        const response = await api.get<CategoriesResponse>('api/v1/categories/');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const createCategory = async (categoryData: { category_name: string; color: string; }) => {
    try {
        const response = await api.post('api/v1/categories/', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const deleteCategory = async (categoryId: string) => {
    try {
        await api.delete(`api/v1/categories/${categoryId}/`);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

export const updateCategory = async (categoryId: string, categoryData: { category_name: string; color: string; }) => {
    try {
        const response = await api.put(`api/v1/categories/${categoryId}/`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};


// Donation Drive Interfaces
export const createDonationDrive = async (driveData: CreateDriveData) => {
    try {
        const response = await api.post('api/v1/donations/', driveData);
        return response.data;
    } catch (error) {
        console.error('Error creating donation drive:', error);
        throw error;
    }
};
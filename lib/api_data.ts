import { get } from "http";
import api from "./api";
import { CategoriesResponse, CategoryData, CreateDriveData, DonationDrive } from "./data";


export const getCategories = async (): Promise<CategoryData[]> => {
    try {
        const response = await api.get<CategoriesResponse>('api/v1/categories/');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};
export const getCategoryById = async (categoryId: string): Promise<CategoryData | null> => {
    try {
        const response = await api.get<CategoryData>(`api/v1/categories/${categoryId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
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

export const getDonationDrives = async (): Promise<DonationDrive[]> => {
    try {
        const response = await api.get('api/v1/donations/');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching donation drives:', error);
        throw error;
    }
};

export const getDonationDriveById = async (driveId: string) => {
    try {
        const response = await api.get(`api/v1/donations/${driveId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching donation drive:', error);
        throw error;
    }
};

export const updateDonationDrive = async (driveId: string, driveData: Partial<CreateDriveData>) => {
    try {
        const response = await api.put(`api/v1/donations/${driveId}/`, driveData);
        return response.data;
    } catch (error) {
        console.error('Error updating donation drive:', error);
        throw error;
    }
};

// Data Fetching for Transactions

export const getTransactionsByDonationDrive = async (driveId: string) => {
    try {
        const response = await api.get(`api/v1/transactions/?donation=${driveId}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching transactions for donation drive:', error);
        throw error;
    }
};
export const getTransactions = async () => {
    try {
        const response = await api.get('api/v1/transactions/');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const getTransactionById = async (transactionId: string) => {
    try {
        const response = await api.get(`api/v1/transactions/${transactionId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};

export const createTransaction = async (transactionData: any) => {
    try {
        const response = await api.post('api/v1/transactions/', transactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

export const updateTransaction = async (transactionId: string, transactionData: any) => {
    try {
        const response = await api.put(`api/v1/transactions/${transactionId}/`, transactionData);
        return response.data;
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

// User Data Fetching
export const getUserById = async (userId: string) => {
    try {
        const response = await api.get(`api/v1/users/${userId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('auth/users/me/');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

export const updateMe = async (userData: any) => {
    try {
        const response = await api.put(`api/v1/users/${userData.id}/`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating current user:', error);
        throw error;
    }
};
import { get } from "http";
import api from "./api";
import { CategoriesResponse, CategoryData, CreateDriveData, DonationDrive, AnalyticsSummary, DonationTrend } from "./data";


export const getCategories = async (): Promise<CategoryData[]> => {
    try {
        const response = await api.get<any>('api/v1/categories/');
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data?.results || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};
export const getCategoryById = async (categoryId: string): Promise<CategoryData | null> => {
    try {
        console.log(`Calling getCategoryById for ${categoryId}`);
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
        const { uploaded_images, category, ...restData } = driveData;
        
        const submitData: any = {
            ...restData,
            category_id: category,
        };

        if (!submitData.end_date) {
            // Set a default far-future date or same as start_date if backend requires it
            submitData.end_date = submitData.start_date; // fallback
        }

        const response = await api.post('api/v1/donations/', submitData);
        const newDrive = response.data;

        if (uploaded_images && uploaded_images.length > 0 && newDrive?.id) {
            for (const file of uploaded_images) {
                try {
                    await uploadDonationImage(newDrive.id, file);
                } catch (imgErr) {
                    console.error('Error uploading initial drive image:', imgErr);
                }
            }
        }
        return newDrive;
    } catch (error) {
        console.error('Error creating donation drive:', error);
        throw error;
    }
};

export const getDonationDrives = async (): Promise<DonationDrive[]> => {
    try {
        let results: DonationDrive[] = [];
        let url: string | null = 'api/v1/donations/';

        while (url) {
            const res: any = await api.get(url);
            if (Array.isArray(res.data)) {
                return res.data;
            }
            results = [...results, ...(res.data?.results || [])];

            // Use HTTPS to avoid mixed content errors if backend returns HTTP
            if (res.data?.next) {
                url = res.data.next.replace(/^http:\/\//i, 'https://');
            } else {
                url = null;
            }
        }
        return results;
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
        const { uploaded_images, category, ...restData } = driveData;

        // Clean up empty date strings that cause 422 validation errors in FastAPI
        if (restData.start_date === "") (restData as any).start_date = null;
        if (restData.end_date === "") (restData as any).end_date = null;

        const updatePayload: any = { ...restData };
        if (category) {
            updatePayload.category_id = category;
        }

        const response = await api.patch(`api/v1/donations/${driveId}`, updatePayload);
        const updatedDrive = response.data;

        if (uploaded_images && (uploaded_images as any[]).length > 0) {
            for (const file of (uploaded_images as File[])) {
                try {
                    await uploadDonationImage(driveId, file);
                } catch (imgErr) {
                    console.error('Error uploading drive image:', imgErr);
                }
            }
        }
        
        return updatedDrive;
    } catch (error) {
        console.error('Error updating donation drive:', error);
        throw error;
    }
};

export const deleteDonationDrive = async (driveId: string) => {
    try {
        await api.delete(`api/v1/donations/${driveId}/`);
    } catch (error) {
        console.error('Error deleting donation drive:', error);
        throw error;
    }
};

// Data Fetching for Transactions

export const getTransactionsByDonationDrive = async (driveId: string) => {
    try {
        const response = await api.get(`api/v1/transactions/?donation_id=${driveId}`);
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching transactions for donation drive:', error);
        throw error;
    }
};
export const getTransactions = async () => {
    try {
        let results: any[] = [];
        let url: string | null = 'api/v1/transactions/';

        while (url) {
            const res: any = await api.get(url);
            if (Array.isArray(res.data)) {
                return res.data;
            }
            results = [...results, ...(res.data?.results || [])];

            // Use HTTPS to avoid mixed content errors if backend returns HTTP
            if (res.data?.next) {
                url = res.data.next.replace(/^http:\/\//i, 'https://');
            } else {
                url = null;
            }
        }
        return results;
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

// Ratings Data Fetching
export const getRatings = async () => {
    try {
        const response = await api.get('api/v1/ratings/');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return [];
    }
};

import { BankAccount, Transfer } from "./data";

// Money Transfer
export const initiateTransfer = async (amount: number, destination_account: string, description?: string) => {
    try {
        const response = await api.post('api/v1/transfers/', { amount, destination_account, description });
        return response.data;
    } catch (error) {
        console.error('Error initiating transfer:', error);
        throw error;
    }
};

export const initiateSTKPush = async (phone_number: string, amount: number, account_name: string, donation_id: string) => {
    try {
        const response = await api.post('api/v1/transactions/initiate_stk_push/', {
            phone_number,
            amount,
            account_name,
            donation: donation_id
        });
        return response.data;
    } catch (error) {
        console.error('Error initiating STK push:', error);
        throw error;
    }
};

export const getBankAccounts = async (): Promise<BankAccount[]> => {
    try {
        const response = await api.get('api/v1/bank-accounts/');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        return [];
    }
};

export const getBankAccountById = async (id: string): Promise<BankAccount> => {
    try {
        const response = await api.get(`api/v1/bank-accounts/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bank account:', error);
        throw error;
    }
};

export const addBankAccount = async (data: any) => {
    try {
        const response = await api.post('api/v1/bank-accounts/', data);
        return response.data;
    } catch (error) {
        console.error('Error adding bank account:', error);
        throw error;
    }
};

export const updateBankAccount = async (id: string, data: any) => {
    try {
        const response = await api.patch(`api/v1/bank-accounts/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating bank account:', error);
        throw error;
    }
};

export const deleteBankAccount = async (id: string) => {
    try {
        await api.delete(`api/v1/bank-accounts/${id}/`);
    } catch (error) {
        console.error('Error deleting bank account:', error);
        throw error;
    }
};

export const getTransferHistory = async (): Promise<Transfer[]> => {
    try {
        const response = await api.get('api/v1/transfers/');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        return [];
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
        const response = await api.get('api/v1/users/me/');
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

export const uploadDonationImage = async (donationId: string, imageFile: File) => {
    try {
        const formData = new FormData();
        formData.append('files', imageFile);
        formData.append('uploaded_images', imageFile);

        const response = await api.post(`api/v1/donations/${donationId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading donation image:', error);
        throw error;
    }
};

export const deleteDonationImage = async (donationId: string, imageUrlOrId: string) => {
    try {
        const response = await api.delete(`api/v1/donations/${donationId}/images`, {
            params: { image_url: imageUrlOrId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting donation image:', error);
        throw error;
    }
};

export const getAnalyticsCategories = async (): Promise<CategoryData[]> => {
    try {
        const response = await api.get('api/v1/analytics/categories');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching analytics categories:', error);
        return [];
    }
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    try {
        const response = await api.get<AnalyticsSummary>('api/v1/analytics/summary');
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics summary:', error);
        throw error;
    }
};

export const getDonationTrends = async (period: string = 'week'): Promise<DonationTrend[]> => {
    try {
        const response = await api.get<DonationTrend[]>('api/v1/analytics/trends', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching donation trends:', error);
        throw error;
    }
};
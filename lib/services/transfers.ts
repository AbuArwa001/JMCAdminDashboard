import api from "../api";
import { Transfer } from "../types/finance";

export const initiateTransfer = async (amount: number, destination_account: string, description?: string) => {
    const response = await api.post('api/v1/transfers', { amount, destination_account, description });
    return response.data;
};

export const initiateSTKPush = async (phone_number: string, amount: number, account_name: string, donation_id: string) => {
    const response = await api.post('api/v1/transactions/initiate_stk_push/', {
        phone_number,
        amount,
        account_name,
        donation: donation_id
    });
    return response.data;
};

export const getTransferHistory = async (): Promise<Transfer[]> => {
    try {
        const response = await api.get('api/v1/transfers');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        return [];
    }
};


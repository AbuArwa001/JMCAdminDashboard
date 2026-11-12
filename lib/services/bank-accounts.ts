import api from "../api";
import { BankAccount } from "../types/finance";

export const getBankAccounts = async (): Promise<BankAccount[]> => {
    try {
        const response = await api.get('api/v1/bank-accounts');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        return [];
    }
};

export const getBankAccountById = async (id: string): Promise<BankAccount> => {
    const response = await api.get(`api/v1/bank-accounts/${id}`);
    return response.data;
};

export const addBankAccount = async (data: any) => {
    const response = await api.post('api/v1/bank-accounts', data);
    return response.data;
};

export const updateBankAccount = async (id: string, data: any) => {
    const response = await api.patch(`api/v1/bank-accounts/${id}`, data);
    return response.data;
};

export const deleteBankAccount = async (id: string) => {
    await api.delete(`api/v1/bank-accounts/${id}`);
};


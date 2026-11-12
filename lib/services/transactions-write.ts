import api from "../api";

export const createTransaction = async (transactionData: any) => {
    const response = await api.post('api/v1/transactions/', transactionData);
    return response.data;
};

export const updateTransaction = async (transactionId: string, transactionData: any) => {
    const response = await api.patch(`api/v1/transactions/${transactionId}/`, transactionData);
    return response.data;
};

export const deleteTransaction = async (transactionId: string) => {
    const response = await api.delete(`api/v1/transactions/${transactionId}/`);
    return response.data;
};

export const bulkDeleteTransactions = async (transactionIds: string[]) => {
    const response = await api.post('api/v1/transactions/bulk-delete/', { transaction_ids: transactionIds });
    return response.data;
};


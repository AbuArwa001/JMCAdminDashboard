import api from "../api";

export const getTransactionsByDonationDrive = async (driveId: string) => {
    const response = await api.get(`api/v1/transactions/?donation_id=${driveId}`);
    return Array.isArray(response.data) ? response.data : (response.data?.results || []);
};

export const getTransactions = async () => {
    let results: any[] = [];
    let url: string | null = 'api/v1/transactions/';

    while (url) {
        const res: any = await api.get(url);
        if (Array.isArray(res.data)) return res.data;
        results = [...results, ...(res.data?.results || [])];
        url = res.data?.next ? res.data.next.replace(/^http:\/\//i, 'https://') : null;
    }
    return results;
};

export const getTransactionById = async (transactionId: string) => {
    const response = await api.get(`api/v1/transactions/${transactionId}/`);
    return response.data;
};


import api from "../api";
import { AnalyticsSummary, CategoryData, DonationTrend } from "../types";

export const getRatings = async () => {
    try {
        const response = await api.get('api/v1/ratings/');
        return Array.isArray(response.data) ? response.data : (response.data?.results || []);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return [];
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
    const response = await api.get<AnalyticsSummary>('api/v1/analytics/summary');
    return response.data;
};

export const getDonationTrends = async (period: string = 'week'): Promise<DonationTrend[]> => {
    const response = await api.get<DonationTrend[]>('api/v1/analytics/trends', {
        params: { period }
    });
    return response.data;
};

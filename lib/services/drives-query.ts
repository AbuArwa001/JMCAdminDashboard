import api from "../api";
import { DonationDrive } from "../types/donation";

export const getDonationDrives = async (): Promise<DonationDrive[]> => {
    let results: DonationDrive[] = [];
    let url: string | null = 'api/v1/donations/';

    while (url) {
        const res: any = await api.get(url);
        if (Array.isArray(res.data)) {
            return res.data;
        }
        results = [...results, ...(res.data?.results || [])];
        url = res.data?.next ? res.data.next.replace(/^http:\/\//i, 'https://') : null;
    }
    return results;
};

export const getDonationDriveById = async (driveId: string) => {
    const response = await api.get(`api/v1/donations/${driveId}/`);
    return response.data;
};

export const deleteDonationDrive = async (driveId: string) => {
    await api.delete(`api/v1/donations/${driveId}/`);
};

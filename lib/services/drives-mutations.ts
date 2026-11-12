import api from "../api";
import { CreateDriveData } from "../types/donation";
import { uploadDonationImage } from "./drive-images";

export const createDonationDrive = async (driveData: CreateDriveData) => {
    const { uploaded_images, category, ...restData } = driveData;
    const submitData: any = { ...restData, category_id: category };
    if (!submitData.end_date) submitData.end_date = submitData.start_date;

    const response = await api.post('api/v1/donations/', submitData);
    const newDrive = response.data;

    if (uploaded_images && uploaded_images.length > 0 && newDrive?.id) {
        for (const file of uploaded_images) {
            try { await uploadDonationImage(newDrive.id, file); } catch (e) { console.error(e); }
        }
    }
    return newDrive;
};

export const updateDonationDrive = async (driveId: string, driveData: Partial<CreateDriveData>) => {
    const { uploaded_images, category, ...restData } = driveData;
    if (restData.start_date === "") (restData as any).start_date = null;
    if (restData.end_date === "") (restData as any).end_date = null;

    const updatePayload: any = { ...restData };
    if (category) updatePayload.category_id = category;

    const response = await api.patch(`api/v1/donations/${driveId}`, updatePayload);
    if (uploaded_images && (uploaded_images as any[]).length > 0) {
        for (const file of (uploaded_images as File[])) {
            try { await uploadDonationImage(driveId, file); } catch (e) { console.error(e); }
        }
    }
    return response.data;
};

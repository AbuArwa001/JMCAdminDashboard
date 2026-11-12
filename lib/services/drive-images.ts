import api from "../api";

export const uploadDonationImage = async (donationId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('uploaded_images', imageFile);

    const response = await api.post(`api/v1/donations/${donationId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteDonationImage = async (donationId: string, imageUrlOrId: string) => {
    const response = await api.delete(`api/v1/donations/${donationId}/images`, {
        params: { image_url: imageUrlOrId }
    });
    return response.data;
};

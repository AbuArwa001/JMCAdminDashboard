export interface User {
    id: string;
    full_name: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    isAdmin: boolean;
    profileImageUrl?: string;
    address?: string;
    bio?: string;
    defaultDonationAccount?: string;
}


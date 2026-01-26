// Types
export type DriveStatus = 'Active' | 'Closed' | 'Completed' | 'Mid-progress' | 'Low-progress';
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
export interface CreateDriveData {
    title: string;
    target_amount: number;
    account_name?: string;
    description?: string;
    status?: string;
    paybill_number?: string;
    category: string;
    start_date: string;
    end_date?: string;
    uploaded_images?: File[];
}

export interface DonationDrive {
    id: string;
    title: string;
    target_amount: number;
    collected_amount: number;
    category: string;
    donors_count: number;
    status: DriveStatus;
    start_date: string;
    end_date?: string;
    images?: { id: string; image: string; created_at: string }[];
    image_urls?: string[];
}

export interface Donation {
    id: string;
    donorName: string;
    amount: number;
    category: string;
    driveId?: string;
    status: 'Completed' | 'Pending' | 'Closed';
    date: string;
    paymentMethod: 'M-Pesa' | 'Cash';
}
export interface Transaction {
    id: string;
    user?: User;
    amount: number;
    donation: DonationDrive;
    category?: string;
    payment_method: string;
    payment_status?: string;
    status: string;
    donated_at?: Date;
    date: string;
    user_name?: string;
    account_name?: string;
    account_number?: string;
}

export interface CategoryData {
    id?: string;
    category_name: string;
    color: string;
    donations?: DonationDrive[];
    total_amount?: number;
    created_at?: string;
    description?: string;
}

export interface RatingData {
    rating: number; // 1-5
    comment?: string;
    date: string;
    donorName: string;
}

export interface AnalyticsCategory {
    category_name: string;
    total_amount: number;
}

export interface DonationTrend {
    name: string;
    amount: number;
}

export interface AnalyticsSummary {
    total_collected: number;
    total_collected_week: number;
    total_collected_month: number;
    active_drives: number;
    donation_trends: DonationTrend[];
}

// Actual Data from API
export interface CategoriesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CategoryData[];
}

export const RECENT_DONATIONS: Donation[] = [
    { id: 'd1', donorName: 'Ahmed Ali', amount: 5000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T10:30:00', paymentMethod: 'M-Pesa' },
    { id: 'd2', donorName: 'Fatima Hassan', amount: 2000, category: 'Charity', driveId: '3', status: 'Completed', date: '2025-11-26T10:15:00', paymentMethod: 'M-Pesa' },
    { id: 'd3', donorName: 'Anonymous', amount: 1000, category: 'Maintenance', driveId: '2', status: 'Pending', date: '2025-11-26T09:45:00', paymentMethod: 'Cash' },
    { id: 'd4', donorName: 'Yusuf Juma', amount: 10000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T09:00:00', paymentMethod: 'M-Pesa' },
    { id: 'd5', donorName: 'Mariam Omar', amount: 500, category: 'Medical', status: 'Completed', date: '2025-11-25T18:20:00', paymentMethod: 'M-Pesa' },
];
export interface CategoryStat {
    donations: any;
    category_name: any;
    name: string;
    value: number;
    color: string;
}


export const DONATION_TRENDS = [
    { name: 'Mon', amount: 12000 },
    { name: 'Tue', amount: 15000 },
    { name: 'Wed', amount: 18000 },
    { name: 'Thu', amount: 22000 },
    { name: 'Fri', amount: 45000 }, // Peak
    { name: 'Sat', amount: 30000 },
    { name: 'Sun', amount: 25000 },
];

export const RATINGS: RatingData[] = [
    { rating: 5, comment: "Easy to use!", date: "2025-11-20", donorName: "Ali" },
    { rating: 4, comment: "Good, but needs dark mode", date: "2025-11-21", donorName: "Sara" },
    { rating: 5, comment: "MashaAllah", date: "2025-11-22", donorName: "Omar" },
    { rating: 3, comment: "Slow sometimes", date: "2025-11-23", donorName: "Zain" },
    { rating: 5, comment: "Great initiative", date: "2025-11-24", donorName: "Huda" },
];

export const DONATION_STATS = {
    totalCollectedToday: 45000,
    totalCollectedWeek: 275000,
    totalCollectedMonth: 1220000,
};

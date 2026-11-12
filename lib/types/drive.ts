export type DriveStatus = 'Active' | 'Closed' | 'Completed' | 'Mid-progress' | 'Low-progress';

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
    consumer_key?: string;
    consumer_secret?: string;
    passkey?: string;
    initiator_name?: string;
    security_credential?: string;
    is_featured?: boolean;
}

export interface DonationDrive {
    account_name: string;
    account_number: string;
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
    is_featured?: boolean;
}

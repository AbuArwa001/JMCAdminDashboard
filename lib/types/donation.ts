import { User } from './user';
import { DonationDrive } from './drive';

export * from './drive';

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
    donation?: DonationDrive;
    donation_id?: string;
    category?: string;
    payment_method: string;
    payment_status?: string;
    status: string;
    donated_at?: Date | string;
    date?: string;
    user_name?: string;
    account_name?: string;
    account_number?: string;
    transaction_reference?: string;
    mpesa_receipt?: string;
    completed_at?: Date | string;
}

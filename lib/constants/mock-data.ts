import { Donation } from '../types/donation';
import { RatingData } from '../types/analytics';

export const RECENT_DONATIONS: Donation[] = [
    { id: 'd1', donorName: 'Ahmed Ali', amount: 5000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T10:30:00', paymentMethod: 'M-Pesa' },
    { id: 'd2', donorName: 'Fatima Hassan', amount: 2000, category: 'Charity', driveId: '3', status: 'Completed', date: '2025-11-26T10:15:00', paymentMethod: 'M-Pesa' },
    { id: 'd3', donorName: 'Anonymous', amount: 1000, category: 'Maintenance', driveId: '2', status: 'Pending', date: '2025-11-26T09:45:00', paymentMethod: 'Cash' },
    { id: 'd4', donorName: 'Yusuf Juma', amount: 10000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T09:00:00', paymentMethod: 'M-Pesa' },
    { id: 'd5', donorName: 'Mariam Omar', amount: 500, category: 'Medical', status: 'Completed', date: '2025-11-25T18:20:00', paymentMethod: 'M-Pesa' },
];

export const DONATION_TRENDS = [
    { name: 'Mon', amount: 12000 },
    { name: 'Tue', amount: 15000 },
    { name: 'Wed', amount: 18000 },
    { name: 'Thu', amount: 22000 },
    { name: 'Fri', amount: 45000 },
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


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

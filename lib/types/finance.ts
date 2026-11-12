import { DonationDrive } from './drive';

export * from './bank';

export interface CategoryData {
    id?: string;
    category_name: string;
    color: string;
    donations?: DonationDrive[];
    total_amount?: number;
    created_at?: string;
    description?: string;
}

export interface CategoryStat {
    donations: any;
    category_name: any;
    name: string;
    value: number;
    color: string;
}

export interface CategoriesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CategoryData[];
}

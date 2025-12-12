import { LucideIcon, LayoutDashboard, Heart, PieChart, Settings, Users, FileText, Star } from 'lucide-react';

// Types
export type DriveStatus = 'Completed' | 'Mid-progress' | 'Low-progress';
/* 


class Roles(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role_name


class Users(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Keep single token for simplicity, or create separate model for multiple devices
    fcm_token = models.CharField(max_length=255, blank=True, null=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.ForeignKey(
        Roles, on_delete=models.SET_NULL, null=True, blank=True, default=None
    )
    is_admin = models.BooleanField(default=False)
    ss_login = models.DateTimeField(null=True, blank=True)

    # Add analytics fields
    firebase_uid = models.CharField(
        max_length=128, blank=True, null=True
    )  # to store Firebase UID
    last_analytics_sync = models.DateTimeField(null=True, blank=True)

    # Profile fields
    profile_image_url = models.CharField(max_length=500, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    default_donation_account = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "full_name"]

    def __str__(self):
        return self.email

    @property
    def public_uuid(self):
        """Public UUID for Firebase Analytics user identification"""
        return str(self.id)

    def save(self, *args, **kwargs):
        if not self.role:
            self.role, created = Roles.objects.get_or_create(role_name="User")
        super().save(*args, **kwargs)


*/
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

export interface DonationDrive {
    id: string;
    title: string;
    targetAmount: number;
    collectedAmount: number;
    category: string;
    donorsCount: number;
    status: DriveStatus;
    startDate: string;
    endDate?: string;
}

export interface Donation {
    id: string;
    donorName: string;
    amount: number;
    category: string;
    driveId?: string;
    status: 'Completed' | 'Pending';
    date: string;
    paymentMethod: 'Mpesa' | 'Cash';
}
export interface Transaction {
    id: string;
    user?: User;
    amount: number;
    donation: DonationDrive;
    category?: string;
    payment_method: string;
    status: string;
    transaction_date?: string;
    date: string;
    user_name?: string;
}

export interface CategoryData {
    category_name: string;
    color: string;
    donations: Donation[];
}

export interface RatingData {
    rating: number; // 1-5
    comment?: string;
    date: string;
    donorName: string;
}

// Mock Data

export const ACTIVE_DRIVES: DonationDrive[] = [
    {
        id: '1',
        title: 'Education Fund 2025',
        targetAmount: 500000,
        collectedAmount: 210000,
        category: 'Education',
        donorsCount: 150,
        status: 'Mid-progress',
        startDate: '2025-01-01',
    },
    {
        id: '2',
        title: 'Mosque Maintenance',
        targetAmount: 100000,
        collectedAmount: 12000,
        category: 'Maintenance',
        donorsCount: 45,
        status: 'Low-progress',
        startDate: '2025-02-15',
    },
    {
        id: '3',
        title: 'Ramadan Food Drive',
        targetAmount: 1000000,
        collectedAmount: 1050000,
        category: 'Charity',
        donorsCount: 800,
        status: 'Completed',
        startDate: '2025-03-01',
    },
];

export const RECENT_DONATIONS: Donation[] = [
    { id: 'd1', donorName: 'Ahmed Ali', amount: 5000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T10:30:00', paymentMethod: 'Mpesa' },
    { id: 'd2', donorName: 'Fatima Hassan', amount: 2000, category: 'Charity', driveId: '3', status: 'Completed', date: '2025-11-26T10:15:00', paymentMethod: 'Mpesa' },
    { id: 'd3', donorName: 'Anonymous', amount: 1000, category: 'Maintenance', driveId: '2', status: 'Pending', date: '2025-11-26T09:45:00', paymentMethod: 'Cash' },
    { id: 'd4', donorName: 'Yusuf Juma', amount: 10000, category: 'Education', driveId: '1', status: 'Completed', date: '2025-11-26T09:00:00', paymentMethod: 'Mpesa' },
    { id: 'd5', donorName: 'Mariam Omar', amount: 500, category: 'Medical', status: 'Completed', date: '2025-11-25T18:20:00', paymentMethod: 'Mpesa' },
];

// export const CATEGORY_STATS: CategoryData[] = [
//     { name: 'Education', value: 42, color: '#BE9830' }, // Primary Gold
//     { name: 'Charity', value: 30, color: '#2E9C57' }, // Primary Green
//     { name: 'Medical', value: 18, color: '#9D7C3F' }, // Primary Bronze
//     { name: 'Maintenance', value: 10, color: '#757575' }, // Grey
// ];

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

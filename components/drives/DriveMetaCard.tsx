import { CategoryData, DonationDrive } from "@/lib/data";

interface Props {
  drive: DonationDrive;
  category?: CategoryData;
}

export function DriveMetaCard({ drive, category }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h4 className="font-bold text-gray-900 mb-4">Drive Details</h4>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Category</span>
          <span className="font-medium">{category ? category.category_name : "Loading..."}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account Name</span>
          <span className="font-medium">{drive.account_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account Number</span>
          <span className="font-medium">{drive.account_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Start Date</span>
          <span className="font-medium">{drive.start_date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-medium">{drive.status}</span>
        </div>
      </div>
    </div>
  );
}


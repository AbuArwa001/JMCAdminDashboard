import { CategoryData } from "@/lib/data";

interface Props {
  formData: any;
  categories: CategoryData[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function DriveEditFields({ formData, categories, onChange }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Drive Title</label>
          <input type="text" name="title" required value={formData.title} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Ramadan Food Drive 2025" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="category" required value={formData.category} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
            <option value="">Select Category</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.category_name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (KES)</label>
          <input type="number" name="target_amount" required value={formData.target_amount} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input type="date" name="start_date" required value={formData.start_date} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" required value={formData.status} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea name="description" rows={4} value={formData.description} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Describe the purpose of this drive..." />
      </div>
    </>
  );
}

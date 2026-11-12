import { CategoryData } from "@/lib/data";
import { Info, ChevronDown } from "lucide-react";

interface Props {
  formData: any;
  categories: CategoryData[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function DriveBasicFields({ formData, categories, onChange }: Props) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
          <Info className="w-4 h-4 text-[#c99335]" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Basic Information</h3>
          <p className="text-[11px] text-gray-400">Drive title, category, and duration</p>
        </div>
      </div>
      <div className="form-section-body space-y-5">
        <div>
          <label className="form-label">Drive Title <span className="text-rose-500 font-bold">*</span></label>
          <input type="text" name="title" required value={formData.title} onChange={onChange} className="form-input" placeholder="e.g. Ramadan Food Drive 2025" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Category <span className="text-rose-500 font-bold">*</span></label>
            <div className="relative">
              <select name="category" required value={formData.category} onChange={onChange} className="form-input appearance-none pr-10 cursor-pointer">
                <option value="">Select a category</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.category_name}</option>))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="form-label">Target Amount (KES) <span className="text-rose-500 font-bold">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">KES</span>
              <input type="number" name="target_amount" required min={0} value={formData.target_amount || ""} onChange={onChange} className="form-input pl-14" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="form-label">Start Date <span className="text-rose-500 font-bold">*</span></label>
            <input type="date" name="start_date" required value={formData.start_date} onChange={onChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input type="date" name="end_date" value={formData.end_date} onChange={onChange} className="form-input" />
          </div>
        </div>
      </div>
    </div>
  );
}

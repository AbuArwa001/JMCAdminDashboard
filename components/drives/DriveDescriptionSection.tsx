import { Zap } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface Props {
  description: string;
  onChange: (val: string) => void;
}

export function DriveDescriptionSection({ description, onChange }: Props) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Drive Description</h3>
          <p className="text-[11px] text-gray-400">Describe the purpose and impact of this drive</p>
        </div>
      </div>
      <div className="form-section-body">
        <label className="form-label">Description</label>
        <RichTextEditor value={description} onChange={onChange} placeholder="Describe the purpose of this drive, who it benefits, and how funds will be used..." minHeight={240} />
      </div>
    </div>
  );
}

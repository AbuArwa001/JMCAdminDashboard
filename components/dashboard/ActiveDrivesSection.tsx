import Link from "next/link";
import { Layers, ArrowUpRight } from "lucide-react";
import DriveProgressCard from "./DriveProgressCard";
import { DonationDrive } from "@/lib/data";

interface Props {
  drives: DonationDrive[];
  isLoading: boolean;
}

export function ActiveDrivesSection({ drives, isLoading }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" /> Active Donation Drives
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Live campaign progress and target metrics</p>
        </div>
        <Link href="/drives" className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5">
          Manage Drives <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <DriveProgressCard key={i} isLoading={true} />)
          : drives.slice(0, 3).map((d) => <DriveProgressCard key={d.id} drive={d} />)}
      </div>
    </div>
  );
}


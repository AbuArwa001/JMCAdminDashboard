import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { name: string; value: number; color: string }[];
  grandTotal: number;
}

export function CategoryDonutChart({ data, grandTotal }: Props) {
  const totalFormatted = grandTotal >= 1_000_000
    ? `KES ${(grandTotal / 1_000_000).toFixed(1)}M`
    : grandTotal >= 1_000 ? `KES ${(grandTotal / 1_000).toFixed(0)}k` : `KES ${grandTotal.toLocaleString()}`;

  return (
    <div className="relative h-[175px] w-full shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={6}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} className="hover:opacity-80 transition-all cursor-pointer" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              <span key="val" className="font-extrabold text-amber-400 text-sm">KES {value.toLocaleString()}</span>,
              <span key="lbl" className="text-slate-400 text-xs">Total Fund</span>,
            ]}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderRadius: "16px",
              border: "1px solid rgba(190, 152, 48, 0.3)",
              padding: "12px 16px",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
        <span className="text-xs font-extrabold text-slate-800 font-mono">{totalFormatted}</span>
      </div>
    </div>
  );
}


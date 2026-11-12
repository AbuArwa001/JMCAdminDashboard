import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function DonationAreaChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[320px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#BE9830" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#BE9830" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `K${v / 1000}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              border: "1px solid rgba(190, 152, 48, 0.3)",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
              padding: "12px 16px",
              color: "#fff",
            }}
            cursor={{ stroke: "#BE9830", strokeWidth: 1.5, strokeDasharray: "4 4" }}
            formatter={(value: number) => [
              <span key="val" className="font-extrabold text-amber-400 text-sm">KES {value.toLocaleString()}</span>,
              <span key="lbl" className="text-slate-400 text-[11px]">Donations</span>,
            ]}
            labelStyle={{ color: "#94A3B8", fontSize: "11px", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}
          />
          <Area type="monotone" dataKey="amount" stroke="#BE9830" strokeWidth={3.5} fillOpacity={1} fill="url(#goldGradient)" dot={{ fill: "#0F172A", strokeWidth: 3, r: 5, stroke: "#BE9830" }} activeDot={{ r: 8, strokeWidth: 4, stroke: "#BE9830", fill: "#FCD34D" }} animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORY_STATS } from "@/lib/data";

export default function CategoryPieChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <h3 className="font-bold text-gray-900 mb-6">Donations by Category</h3>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={CATEGORY_STATS}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {CATEGORY_STATS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value}%`, 'Share']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => <span className="text-sm text-gray-500 ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

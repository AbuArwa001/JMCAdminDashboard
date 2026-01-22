import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { getDonationTrends } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";

interface DonationChartProps {
    data: any[];
    isLoading?: boolean;
}

export default function DonationChart({ data: initialData, isLoading: parentLoading }: DonationChartProps) {
    const [period, setPeriod] = useState('week');
    const [fetchedData, setFetchedData] = useState<any[]>([]);
    const [isLoadingInternal, setIsLoadingInternal] = useState(false);

    const isLoading = parentLoading || isLoadingInternal;

    useEffect(() => {
        const fetchTrends = async () => {
            setIsLoadingInternal(true);
            try {
                const trends = await getDonationTrends(period);
                setFetchedData(trends);
            } catch (error) {
                console.error('Error fetching trends:', error);
                // Keep using initialData or fallback if fetch fails
            } finally {
                setIsLoadingInternal(false);
            }
        };

        fetchTrends();
    }, [period]);

    const displayData = fetchedData.length > 0
        ? fetchedData
        : (initialData?.length > 0 ? initialData : []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Donation Trends</h3>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {isLoading ? (
                <div className="w-full h-[85%] flex items-end justify-between gap-2 px-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="w-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `K${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Amount']}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#BE9830"
                            strokeWidth={3}
                            dot={{ fill: '#BE9830', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

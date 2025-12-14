"use client";

import { useState } from "react";
import { initiateTransfer } from "@/lib/api_data";
import { toast } from "sonner";
import { ArrowRight, Wallet, Building2, Loader2 } from "lucide-react";

export default function TransfersPage() {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsLoading(true);
        try {
            await initiateTransfer(parseFloat(amount));
            toast.success("Transfer initiated successfully");
            setAmount("");
        } catch (error) {
            toast.error("Failed to initiate transfer");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Money Transfer</h1>
                <p className="text-gray-500 mt-1">Transfer funds from M-Pesa collection account to bank account.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleTransfer} className="space-y-8">
                    {/* Transfer Flow Visual */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-900">M-Pesa</p>
                                <p className="text-xs text-gray-500">150777</p>
                            </div>
                        </div>

                        <div className="flex-1 flex justify-center text-gray-400">
                            <ArrowRight className="w-6 h-6" />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-900">Bank Account</p>
                                <p className="text-xs text-gray-500">**** 8899</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount to Transfer (KES)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">KES</span>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-14 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-medium"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Standard transfer fees may apply. Transfers are typically processed instantly.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Transfer...
                            </>
                        ) : (
                            "Confirm Transfer"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

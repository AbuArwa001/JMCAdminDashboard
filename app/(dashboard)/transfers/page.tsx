"use client";

import { useState, useEffect } from "react";
import { initiateTransfer, getBankAccounts, addBankAccount, deleteBankAccount, getTransferHistory } from "@/lib/api_data";
import { toast } from "sonner";
import { ArrowRight, Wallet, Building2, Loader2, Plus, Trash2, History } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";

export default function TransfersPage() {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [showAddBank, setShowAddBank] = useState(false);
    const [newBank, setNewBank] = useState({ bank_name: "", account_number: "", account_name: "" });
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsFetching(true);
            const banks = await getBankAccounts();
            setBankAccounts(banks);
            if (banks.length > 0) setSelectedBank(banks[0].id);

            const hist = await getTransferHistory();
            setHistory(hist);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!selectedBank) {
            toast.error("Please select a bank account");
            return;
        }

        setIsLoading(true);
        try {
            await initiateTransfer(parseFloat(amount));
            toast.success("Transfer initiated successfully");
            setAmount("");
            fetchData(); // Refresh history
        } catch (error) {
            toast.error("Failed to initiate transfer");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBank = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addBankAccount(newBank);
            toast.success("Bank account added");
            setShowAddBank(false);
            setNewBank({ bank_name: "", account_number: "", account_name: "" });
            fetchData();
        } catch (error) {
            toast.error("Failed to add bank account");
        }
    };

    const handleDeleteBank = async (id: string) => {
        if (confirm("Are you sure you want to delete this bank account?")) {
            try {
                await deleteBankAccount(id);
                toast.success("Bank account deleted");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete bank account");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Money Transfer</h1>
                    <p className="text-gray-500 mt-1">Manage transfers to bank accounts.</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="text-xs text-green-600 font-medium">Available Balance</p>
                        <p className="text-lg font-bold text-green-700">KES 450,000.00</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Transfer Form */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="font-bold text-gray-900 mb-6">Initiate Transfer</h2>
                    <form onSubmit={handleTransfer} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">From</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">M-Pesa Paybill</p>
                                    <p className="text-xs text-gray-500">150777</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 lg:rotate-0" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">To Bank Account</label>
                                <button
                                    type="button"
                                    onClick={() => setShowAddBank(true)}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add New
                                </button>
                            </div>

                            {isFetching ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                </div>
                            ) : bankAccounts.length > 0 ? (
                                <div className="space-y-2">
                                    {bankAccounts.map((bank) => (
                                        <div
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedBank === bank.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 hover:border-primary/50"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{bank.bank_name}</p>
                                                    <p className="text-xs text-gray-500">{bank.account_number} - {bank.account_name}</p>
                                                </div>
                                            </div>
                                            {selectedBank === bank.id && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteBank(bank.id); }}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-500">No bank accounts added</p>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddBank(true)}
                                        className="mt-2 text-sm text-primary font-medium"
                                    >
                                        Add your first bank account
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount (KES)
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !selectedBank}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transfer Funds"}
                        </button>
                    </form>
                </div>

                {/* History & Modal */}
                <div className="space-y-8">
                    {/* Add Bank Modal */}
                    {showAddBank && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Add New Bank Account</h3>
                            <form onSubmit={handleAddBank} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        value={newBank.bank_name}
                                        onChange={e => setNewBank({ ...newBank, bank_name: e.target.value })}
                                        placeholder="e.g. KCB, Equity"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        value={newBank.account_number}
                                        onChange={e => setNewBank({ ...newBank, account_number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Account Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        value={newBank.account_name}
                                        onChange={e => setNewBank({ ...newBank, account_name: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddBank(false)}
                                        className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-bronze"
                                    >
                                        Save Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                            <History className="w-4 h-4 text-gray-500" />
                            <h3 className="font-bold text-gray-900">Recent Transfers</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Reference</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isFetching ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                                                <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                                                <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                                <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                            </tr>
                                        ))
                                    ) : history.length > 0 ? (
                                        history.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-600">{new Date(tx.donated_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-gray-900 font-medium">{tx.transaction_reference}</td>
                                                <td className="px-4 py-3 text-right font-medium">KES {parseFloat(tx.amount).toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        {tx.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                No transfers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

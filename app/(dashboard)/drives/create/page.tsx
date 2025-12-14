"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {CategoryData } from "@/lib/data";
import { createDonationDrive, getCategories } from "@/lib/api_data";

export default function CreateDrivePage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        start_date: "",
        end_date: "",
        target_amount: 0,
        description: "",
        paybill_number: "",
        account_name: "",
        account_number: "",
    });
    const [categories, setCategories] = useState<CategoryData[]>([]);
    console.log("Categories:", categories);
    useEffect(() => {
        const fetchCategories = async () => {
        const cats: CategoryData[] = await getCategories();
        setCategories(cats);
        };
        
        fetchCategories();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createDonationDrive({ ...formData });
        console.log({ ...formData, paymentMethod });
        alert("Donation Drive created successfully!");
        router.push("/drives");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-3xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/drives" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create Donation Drive</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Drive Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="e.g. Ramadan Food Drive 2025"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_name} value={cat.id}>{cat.category_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (KES)</label>
                            <input
                                type="number"
                                name="target_amount"
                                required
                                value={formData.target_amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                required
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Describe the purpose of this drive..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-500">Click to upload image</span>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Configuration</h3>

                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === "MPESA"}
                                    onChange={() => setPaymentMethod("MPESA")}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="font-medium text-gray-700">M-Pesa Paybill</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === "BANK"}
                                    onChange={() => setPaymentMethod("BANK")}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="font-medium text-gray-700">Bank Account</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                            {paymentMethod === "MPESA" ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Paybill Number</label>
                                        <input
                                            type="text"
                                            name="paybill_number"
                                            value={formData.paybill_number}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="e.g. 247247"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                        <input
                                            type="text"
                                            name="account_name"
                                            value={formData.account_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="e.g. JMC Donation"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Paybill / Code</label>
                                        <input
                                            type="text"
                                            name="paybill_number"
                                            value={formData.paybill_number}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Bank Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={formData.account_number}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Account Number"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Create Drive
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

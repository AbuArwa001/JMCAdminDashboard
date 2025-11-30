"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
            </div>

            <CategoryForm />
        </div>
    );
}

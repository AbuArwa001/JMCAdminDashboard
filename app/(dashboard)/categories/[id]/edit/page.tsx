"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    const [category, setCategory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/api/v1/categories/${params.id}/`);
                setCategory(response.data);
            } catch (error) {
                console.error("Error fetching category:", error);
                toast.error("Failed to load category");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            </div>

            <CategoryForm initialData={category} isEditing />
        </div>
    );
}

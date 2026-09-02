"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 border border-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <Tag className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Create Category
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Add a new donation fund category.
            </p>
          </div>
        </div>
      </div>

      <CategoryForm />
    </div>
  );
}

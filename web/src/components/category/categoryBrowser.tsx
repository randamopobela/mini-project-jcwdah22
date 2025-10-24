// src/components/CategoryBrowser.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Spinner } from "flowbite-react";
import { getAllCategories } from "@/service/eventService";
import { getCategoryDetails } from "@/utils/categotyUtils";

function CategoryBrowser() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const catData = await getAllCategories();
        setCategories(catData);
      } catch (err) {
        setError("Gagal memuat kategori.");
        console.error("Gagal mengambil kategori:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-sm py-4">{error}</p>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    // Menggunakan grid yang sama seperti kode asli Anda
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((categoryName) => {
        const { displayName, icon: IconComponent } =
          getCategoryDetails(categoryName);
        return (
          <Link
            key={categoryName}
            href={`/events?category=${categoryName}`} // Link ke halaman event dengan filter
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white" // Style dari kode asli
          >
            <IconComponent className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium text-sm text-center text-gray-700">
              {" "}
              {/* Style dari kode asli */}
              {displayName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryBrowser;

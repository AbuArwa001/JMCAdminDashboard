"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface CommunityContent {
  id?: number;
  content_type: string;
  title: string;
  body: string;
  author_or_sheikh: string;
  is_published: boolean;
}

export default function InspirationPage() {
  const [items, setItems] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CommunityContent>>({
    content_type: "INSPIRATION",
    title: "",
    body: "",
    author_or_sheikh: "",
    is_published: true,
  });

  const fetchItems = async () => {
    try {
      const response = await api.get("/api/v1/community/content/?content_type=INSPIRATION");
      setItems(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching inspiration items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/community/content/", formData);
      setShowForm(false);
      setFormData({ ...formData, title: "", body: "", author_or_sheikh: "" });
      fetchItems();
    } catch (error) {
      console.error("Error creating inspiration item:", error);
    }
  };

  const togglePublish = async (item: CommunityContent) => {
    try {
      await api.patch(`/api/v1/community/content/${item.id}/`, {
        is_published: !item.is_published,
      });
      fetchItems();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Inspiration item?")) return;
    try {
      await api.delete(`/api/v1/community/content/${id}/`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) return <div className="p-6">Loading items...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Inspiration</h1>
          <p className="text-gray-500">Manage Hadith or Ayah of the day.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition"
        >
          {showForm ? "Cancel" : "Add Inspiration"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Inspiration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (e.g., Ayah of the day)</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Author</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={formData.author_or_sheikh}
                  onChange={(e) => setFormData({ ...formData, author_or_sheikh: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (The Ayah/Hadith text)</label>
              <textarea
                required
                rows={4}
                className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              ></textarea>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition">
                Save Inspiration
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-4">{item.body}</p>
              <p className="text-sm font-medium text-amber-600">{item.author_or_sheikh}</p>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button onClick={() => togglePublish(item)} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
                {item.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleDelete(item.id!)} className="text-sm text-red-600 hover:text-red-900 font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
            No daily inspiration items found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}

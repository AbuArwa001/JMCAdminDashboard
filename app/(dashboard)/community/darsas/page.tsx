"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface CommunityContent {
  id?: number;
  content_type: string;
  title: string;
  body: string;
  author_or_sheikh: string;
  scheduled_for: string;
  is_published: boolean;
}

export default function DarsasPage() {
  const [darsas, setDarsas] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CommunityContent>>({
    content_type: "DARSA",
    title: "",
    body: "",
    author_or_sheikh: "",
    scheduled_for: "",
    is_published: true,
  });

  const fetchDarsas = async () => {
    try {
      const response = await api.get("/api/v1/community/content/?content_type=DARSA");
      setDarsas(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching darsas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDarsas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/community/content/", formData);
      setShowForm(false);
      setFormData({ ...formData, title: "", body: "", author_or_sheikh: "", scheduled_for: "" });
      fetchDarsas();
    } catch (error) {
      console.error("Error creating darsa:", error);
    }
  };

  const togglePublish = async (darsa: CommunityContent) => {
    try {
      await api.patch(`/api/v1/community/content/${darsa.id}/`, {
        is_published: !darsa.is_published,
      });
      fetchDarsas();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Darsa?")) return;
    try {
      await api.delete(`/api/v1/community/content/${id}/`);
      fetchDarsas();
    } catch (error) {
      console.error("Error deleting darsa:", error);
    }
  };

  if (loading) return <div className="p-6">Loading darsas...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Darsas Management</h1>
          <p className="text-gray-500">Manage daily darsa schedules.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition"
        >
          {showForm ? "Cancel" : "Add Darsa"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Darsa</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheikh / Teacher</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled For</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                value={formData.scheduled_for}
                onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Topic details</label>
              <textarea
                required
                rows={3}
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
                Save Darsa
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheikh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {darsas.map((darsa) => (
              <tr key={darsa.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{darsa.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{darsa.author_or_sheikh}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {darsa.scheduled_for ? new Date(darsa.scheduled_for).toLocaleString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    darsa.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {darsa.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => togglePublish(darsa)} className="text-indigo-600 hover:text-indigo-900">
                    {darsa.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(darsa.id!)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {darsas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No darsas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

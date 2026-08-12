"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, ChevronRight } from "lucide-react";

interface DuaCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  display_order: number;
}

interface Dua {
  id: number;
  category: number;
  title: string;
  arabic_text: string;
  transliteration: string;
  translation_en: string;
  translation_sw: string;
  source_reference: string;
  audio_url: string;
  display_order: number;
  published: boolean;
}

export default function DuasPage() {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState<Partial<DuaCategory>>({ name: "", slug: "", icon: "", display_order: 0 });

  const [showDuaForm, setShowDuaForm] = useState(false);
  const [duaForm, setDuaForm] = useState<Partial<Dua>>({ 
    title: "", arabic_text: "", transliteration: "", translation_en: "", translation_sw: "", source_reference: "", audio_url: "", display_order: 0, published: true 
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, duasRes] = await Promise.all([
        api.get("/api/v1/duas/categories/"),
        api.get("/api/v1/duas/")
      ]);
      setCategories(catsRes.data.results || catsRes.data);
      setDuas(duasRes.data.results || duasRes.data);
      if ((catsRes.data.results || catsRes.data).length > 0 && !selectedCategoryId) {
        setSelectedCategoryId((catsRes.data.results || catsRes.data)[0].id);
      }
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (catForm.id) {
        await api.put(`/api/v1/duas/categories/${catForm.id}/`, catForm);
      } else {
        await api.post("/api/v1/duas/categories/", catForm);
      }
      setShowCatForm(false);
      setCatForm({ name: "", slug: "", icon: "", display_order: 0 });
      fetchData();
    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/v1/duas/categories/${id}/`);
      if (selectedCategoryId === id) setSelectedCategoryId(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const saveDua = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...duaForm, category: selectedCategoryId };
      if (duaForm.id) {
        await api.put(`/api/v1/duas/${duaForm.id}/`, payload);
      } else {
        await api.post("/api/v1/duas/", payload);
      }
      setShowDuaForm(false);
      setDuaForm({ title: "", arabic_text: "", transliteration: "", translation_en: "", translation_sw: "", source_reference: "", audio_url: "", display_order: 0, published: true });
      fetchData();
    } catch (error) {
      console.error("Error saving dua", error);
    }
  };

  const deleteDua = async (id: number) => {
    if (!confirm("Delete this dua?")) return;
    try {
      await api.delete(`/api/v1/duas/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting dua", error);
    }
  };

  if (loading) return <div className="p-6">Loading Duas...</div>;

  const currentDuas = duas.filter(d => d.category === selectedCategoryId).sort((a,b) => a.display_order - b.display_order);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Duas Management</h1>
        <p className="text-gray-500">Manage categories and authentic supplications.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Categories</h2>
            <button onClick={() => { setCatForm({ name: "", slug: "", icon: "", display_order: 0 }); setShowCatForm(true); }} className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={saveCategory} className="bg-amber-50 p-4 rounded-lg border border-amber-100 space-y-3">
              <input type="text" placeholder="Name" required className="w-full p-2 border rounded text-sm" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
              <input type="text" placeholder="Slug" required className="w-full p-2 border rounded text-sm" value={catForm.slug} onChange={e => setCatForm({...catForm, slug: e.target.value})} />
              <div className="flex gap-2">
                <input type="text" placeholder="Icon" className="w-full p-2 border rounded text-sm" value={catForm.icon} onChange={e => setCatForm({...catForm, icon: e.target.value})} />
                <input type="number" placeholder="Order" required className="w-20 p-2 border rounded text-sm" value={catForm.display_order} onChange={e => setCatForm({...catForm, display_order: Number(e.target.value)})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCatForm(false)} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-amber-600 text-white rounded text-sm font-medium">Save</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {categories.sort((a,b)=>a.display_order-b.display_order).map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedCategoryId === cat.id ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{duas.filter(d=>d.category === cat.id).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setCatForm(cat); setShowCatForm(true); }} className="text-gray-400 hover:text-amber-600"><Edit className="w-4 h-4"/></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4"/></button>
                  <ChevronRight className={`w-4 h-4 ${selectedCategoryId === cat.id ? 'text-amber-500' : 'text-gray-300'}`} />
                </div>
              </div>
            ))}
            {categories.length === 0 && <div className="p-4 text-center text-sm text-gray-500">No categories found.</div>}
          </div>
        </div>

        {/* Duas List */}
        <div className="w-full lg:w-2/3 space-y-4">
          {selectedCategoryId ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Duas in Category</h2>
                <button onClick={() => { setDuaForm({ title: "", arabic_text: "", transliteration: "", translation_en: "", translation_sw: "", source_reference: "", audio_url: "", display_order: 0, published: true }); setShowDuaForm(true); }} className="px-4 py-2 bg-gray-900 text-white rounded font-medium text-sm hover:bg-gray-800 flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Dua
                </button>
              </div>

              {showDuaForm && (
                <form onSubmit={saveDua} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">{duaForm.id ? 'Edit Dua' : 'New Dua'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input type="text" required className="w-full p-2 border rounded" value={duaForm.title} onChange={e => setDuaForm({...duaForm, title: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Arabic Text</label>
                      <textarea required dir="rtl" rows={3} className="w-full p-2 border rounded text-right text-xl font-arabic" value={duaForm.arabic_text} onChange={e => setDuaForm({...duaForm, arabic_text: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Transliteration (Optional)</label>
                      <textarea rows={2} className="w-full p-2 border rounded" value={duaForm.transliteration} onChange={e => setDuaForm({...duaForm, transliteration: e.target.value})} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium mb-1">Translation (EN)</label>
                      <textarea required rows={3} className="w-full p-2 border rounded" value={duaForm.translation_en} onChange={e => setDuaForm({...duaForm, translation_en: e.target.value})} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium mb-1">Translation (SW) (Optional)</label>
                      <textarea rows={3} className="w-full p-2 border rounded" value={duaForm.translation_sw} onChange={e => setDuaForm({...duaForm, translation_sw: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Source Reference</label>
                      <input type="text" className="w-full p-2 border rounded" value={duaForm.source_reference} onChange={e => setDuaForm({...duaForm, source_reference: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Audio URL (Optional)</label>
                      <input type="url" className="w-full p-2 border rounded" value={duaForm.audio_url} onChange={e => setDuaForm({...duaForm, audio_url: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Display Order</label>
                      <input type="number" required className="w-full p-2 border rounded" value={duaForm.display_order} onChange={e => setDuaForm({...duaForm, display_order: Number(e.target.value)})} />
                    </div>
                    <div className="flex items-center pt-6">
                      <input type="checkbox" id="published" className="h-4 w-4 text-amber-600 rounded" checked={duaForm.published} onChange={e => setDuaForm({...duaForm, published: e.target.checked})} />
                      <label htmlFor="published" className="ml-2 block text-sm">Published</label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setShowDuaForm(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded font-medium">Save Dua</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {currentDuas.map(dua => (
                  <div key={dua.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setDuaForm(dua); setShowDuaForm(true); }} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:text-amber-600"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => deleteDua(dua.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:text-red-600"><Trash className="w-4 h-4"/></button>
                    </div>
                    <div className="flex justify-between items-start pr-20">
                      <h3 className="font-bold text-lg">{dua.title}</h3>
                      {!dua.published && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">Draft</span>}
                    </div>
                    <div className="text-right text-xl font-arabic leading-loose my-2 text-slate-800" dir="rtl">{dua.arabic_text}</div>
                    {dua.transliteration && <div className="text-sm italic text-gray-600">{dua.transliteration}</div>}
                    <div className="text-sm text-gray-800">{dua.translation_en}</div>
                    <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{dua.source_reference}</div>
                  </div>
                ))}
                {currentDuas.length === 0 && !showDuaForm && (
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                    No duas found in this category.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
              Select a category to view and manage its duas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

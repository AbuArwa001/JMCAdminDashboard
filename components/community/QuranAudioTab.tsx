import { useState, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { getSurahName } from "@/lib/constants/surahs";
import { QuranAudioModal } from "./QuranAudioModal";
import { QuranAudioTable } from "./QuranAudioTable";

interface Props {
  audios: any[];
  reciters: any[];
  onRefresh: () => void;
  onDelete: (id: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

const PAGE_SIZE = 15;

export function QuranAudioTab({ audios, reciters, onRefresh, onDelete, isSubmitting, setIsSubmitting }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState(""), [filterReciter, setFilterReciter] = useState<number>(0), [page, setPage] = useState(1);
  const [form, setForm] = useState({ id: undefined as number | undefined, surah_number: 1, reciter_id: reciters[0]?.id || 0, audio_url: "" });

  const filtered = useMemo(() => audios.filter((a) => {
    const matchReciter = !filterReciter || (a.reciter_id ?? a.reciter) === filterReciter;
    const surahName = getSurahName(a.surah_number).toLowerCase();
    return matchReciter && (!search || surahName.includes(search.toLowerCase()) || String(a.surah_number).includes(search));
  }), [audios, filterReciter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const saveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { surah_number: Number(form.surah_number), reciter_id: Number(form.reciter_id), audio_url: form.audio_url };
      if (form.id) await api.put(`/api/v1/quran/audio/${form.id}`, payload);
      else await api.post("/api/v1/quran/audio", payload);
      setShowModal(false);
      onRefresh();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Surah Audio Files ({filtered.length})</h2>
        <button onClick={() => { setForm({ id: undefined, surah_number: 1, reciter_id: reciters[0]?.id || 0, audio_url: "" }); setShowModal(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-amber-700 w-fit">
          <Plus className="w-4 h-4" /> Assign Audio
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search by Surah name or number..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white" />
        </div>
        <select value={filterReciter} onChange={(e) => { setFilterReciter(Number(e.target.value)); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm bg-white min-w-[200px]">
          <option value={0}>All Reciters ({reciters.length})</option>
          {reciters.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
        </select>
      </div>
      <QuranAudioTable audios={paginated} reciters={reciters} onEdit={(a) => { setForm({ id: a.id, surah_number: a.surah_number, reciter_id: a.reciter_id ?? a.reciter, audio_url: a.audio_url }); setShowModal(true); }} onDelete={onDelete} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">Page {page} of {totalPages} ({filtered.length} items)</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded border bg-white disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded border bg-white disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <QuranAudioModal isOpen={showModal} onClose={() => setShowModal(false)} form={form} setForm={setForm} reciters={reciters} isSubmitting={isSubmitting} onSave={saveAudio} />
    </div>
  );
}

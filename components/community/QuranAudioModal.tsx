import { getSurahName } from "@/lib/constants/surahs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  form: { id?: number; surah_number: number; reciter_id: number; audio_url: string };
  setForm: (f: any) => void;
  reciters: any[];
  isSubmitting: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function QuranAudioModal({ isOpen, onClose, form, setForm, reciters, isSubmitting, onSave }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 w-full max-w-lg space-y-4">
        <h3 className="text-lg font-bold text-slate-800">{form.id ? "Edit Audio File" : "Assign Surah Audio"}</h3>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Surah (1-114)</label>
              <input
                required
                type="number"
                min="1"
                max="114"
                className="w-full p-2 border rounded-lg text-sm"
                value={form.surah_number}
                onChange={(e) => setForm({ ...form, surah_number: Number(e.target.value) })}
              />
              <span className="text-xs text-amber-600 font-medium mt-1 block">
                {getSurahName(form.surah_number)}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Reciter</label>
              <select
                required
                className="w-full p-2 border rounded-lg text-sm"
                value={form.reciter_id}
                onChange={(e) => setForm({ ...form, reciter_id: Number(e.target.value) })}
              >
                <option value={0}>Select Reciter...</option>
                {reciters.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Audio Stream URL (.mp3)</label>
              <input
                required
                type="url"
                placeholder="https://..."
                className="w-full p-2 border rounded-lg text-sm"
                value={form.audio_url}
                onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 font-medium" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-amber-700">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

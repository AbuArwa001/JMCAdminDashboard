import { Edit, Trash, Play } from "lucide-react";
import { getSurahName } from "@/lib/constants/surahs";

interface Props {
  audios: any[];
  reciters: any[];
  onEdit: (audio: any) => void;
  onDelete: (id: number) => void;
}

export function QuranAudioTable({ audios, reciters, onEdit, onDelete }: Props) {
  if (audios.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        No Surah audio files found matching your search.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Surah</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reciter</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Audio Link</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {audios.map((audio) => {
              const reciterName = reciters.find((r) => r.id === (audio.reciter_id ?? audio.reciter))?.name || "Unknown";
              return (
                <tr key={audio.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    <span className="font-semibold text-slate-800">Surah {audio.surah_number}</span>
                    <span className="text-gray-500 text-xs ml-2">({getSurahName(audio.surah_number)})</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-700 font-medium">{reciterName}</td>
                  <td className="px-6 py-3.5 text-sm">
                    <a
                      href={audio.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 hover:underline max-w-[280px] truncate"
                    >
                      <Play className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{audio.audio_url}</span>
                    </a>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-3">
                    <button onClick={() => onEdit(audio)} className="text-gray-400 hover:text-amber-600 transition-colors">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => onDelete(audio.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { PRESET_COLORS } from "./category-constants";

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export function CategoryColorPicker({ color, onChange }: Props) {
  return (
    <div>
      <label className="form-label">Category Colour</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="w-8 h-8 rounded-lg border-2 transition-all duration-150 hover:scale-110"
            style={{
              backgroundColor: c,
              borderColor: color === c ? "#1a1512" : "transparent",
              boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
            }}
            title={c}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 p-0.5 rounded-lg border border-gray-200 cursor-pointer bg-white"
        />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg shadow-sm border border-white/50" style={{ backgroundColor: color }} />
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Selected</p>
            <p className="text-sm font-mono font-semibold text-gray-900">{color.toUpperCase()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-auto">Custom hex</p>
      </div>
    </div>
  );
}


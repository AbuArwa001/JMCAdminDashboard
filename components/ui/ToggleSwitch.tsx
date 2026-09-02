"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  description?: string;
}

/**
 * Premium toggle switch using inline peer classes (Tailwind v3 compatible).
 * The toggle-switch class in globals.css cannot use @apply with peer utilities,
 * so we inline the peer classes directly on the element in JSX.
 */
export default function ToggleSwitch({ checked, onChange, id, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="relative cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
      </label>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-bold text-gray-800">{label}</span>}
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      )}
    </div>
  );
}

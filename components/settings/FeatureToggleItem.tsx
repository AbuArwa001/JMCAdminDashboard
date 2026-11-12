export interface AppFeature {
  id: number;
  name: string;
  is_active: boolean;
  description: string;
}

interface Props {
  feature: AppFeature;
  onToggle: (feature: AppFeature) => void;
}

export function FeatureToggleItem({ feature, onToggle }: Props) {
  return (
    <li className="p-6 flex items-center justify-between hover:bg-gray-50/70 transition-colors">
      <div>
        <h3 className="text-base font-bold text-gray-900 capitalize">{feature.name.replace(/_/g, " ")}</h3>
        <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
      </div>
      <button
        onClick={() => onToggle(feature)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${feature.is_active ? "bg-[#006838]" : "bg-gray-200"}`}
        role="switch"
        aria-checked={feature.is_active}
      >
        <span className="sr-only">Toggle feature</span>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${feature.is_active ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </li>
  );
}

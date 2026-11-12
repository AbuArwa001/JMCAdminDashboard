interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  is_active: boolean;
}

interface Props {
  cities: City[];
  onToggleActive: (c: City) => void;
}

export function PrayerCitiesTable({ cities, onToggleActive }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Cities</h2>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Active</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cities.map((city) => (
              <tr key={city.id}>
                <td className="px-3 py-4 text-sm font-medium text-gray-900">{city.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{city.latitude}, {city.longitude}</td>
                <td className="px-3 py-4 text-sm text-right">
                  <button onClick={() => onToggleActive(city)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${city.is_active ? "bg-amber-500" : "bg-gray-200"}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${city.is_active ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

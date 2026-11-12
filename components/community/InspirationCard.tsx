interface Props {
  item: any;
  onTogglePublish: (item: any) => void;
  onDelete: (id: number) => void;
}

export function InspirationCard({ item, onTogglePublish, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {item.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4">{item.body}</p>
        <p className="text-sm font-medium text-amber-600">{item.author_or_sheikh}</p>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <button onClick={() => onTogglePublish(item)} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
          {item.is_published ? "Unpublish" : "Publish"}
        </button>
        <button onClick={() => onDelete(item.id)} className="text-sm text-red-600 hover:text-red-900 font-medium">
          Delete
        </button>
      </div>
    </div>
  );
}


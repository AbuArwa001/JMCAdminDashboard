import { format } from "date-fns";

interface Props {
  logs: any[];
}

export function NotificationLogsTable({ logs }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Push Notification History</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <th className="px-6 py-4 border-b border-gray-100">Notification Content</th>
                <th className="px-6 py-4 border-b border-gray-100">Sent At</th>
                <th className="px-6 py-4 border-b border-gray-100">Type</th>
                <th className="px-6 py-4 border-b border-gray-100 text-center">Recipients</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{log.title}</p>
                    <p className="text-xs text-gray-500 max-w-md">{log.body}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {format(new Date(log.sent_at), "MMM d, yyyy HH:mm")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge-gold capitalize">
                      {log.related_event ? "Event" : log.related_khutba ? "Khutba" : "Other"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="badge-emerald">{log.recipient_count}</span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No notifications sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

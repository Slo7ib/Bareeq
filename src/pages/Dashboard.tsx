import { useDashboardStats } from "../hooks/useDashboardStats";
import { BUSINESS_ID } from "../constants";

const recentWashes = [
  { id: 1, customer: "محمد العلي", plate: "أ ب ج 1234", time: "09:15 ص" },
  { id: 2, customer: "فيصل الحربي", plate: "د هـ و 5678", time: "10:02 ص" },
  { id: 3, customer: "سارة القحطاني", plate: "ز ح ط 9012", time: "10:45 ص" },
  { id: 4, customer: "عبدالله الشمري", plate: "ي ك ل 3456", time: "11:30 ص" },
  { id: 5, customer: "نورة المطيري", plate: "م ن س 7890", time: "12:10 م" },
];

const statCards = [
  { label: "Total Customers", icon: "👥", key: "totalCustomers" },
  { label: "Active Subscriptions", icon: "✅", key: "activeSubs" },
  { label: "Today's Washes", icon: "🚗", key: "todayWashes" },
] as const;

export default function Dashboard() {
  const { stats, loading } = useDashboardStats(BUSINESS_ID);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-6 shadow"
          >
            <span className="text-4xl">{card.icon}</span>
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-200" />
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                {stats[card.key]}
              </span>
            )}
            <span className="text-center text-sm text-gray-500">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Washes */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Recent Washes
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-400">
              <th className="pb-2 text-left font-medium">Customer</th>
              <th className="pb-2 text-left font-medium">Plate</th>
              <th className="pb-2 text-left font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentWashes.map((wash) => (
              <tr
                key={wash.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="py-3 text-gray-800">{wash.customer}</td>
                <td className="py-3 font-mono text-gray-600">{wash.plate}</td>
                <td className="py-3 text-gray-400">{wash.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

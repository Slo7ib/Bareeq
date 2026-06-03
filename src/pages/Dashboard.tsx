import { useDashboardStats } from "../hooks/useDashboardStats";
import { useRecentWashes } from "../hooks/useRecentWashes";
import { BUSINESS_ID } from "../constants";

const statCards = [
  { label: "Total Customers", icon: "👥", key: "totalCustomers" },
  { label: "Active Subscriptions", icon: "✅", key: "activeSubs" },
  { label: "Today's Washes", icon: "🚗", key: "todayWashes" },
] as const;

export default function Dashboard() {
  const { stats, loading } = useDashboardStats(BUSINESS_ID);
  const { washes, loading: washesLoading } = useRecentWashes(BUSINESS_ID);

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
            <span className="text-center text-base text-gray-500">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Today's Summary Card */}
      <div className="mb-8 rounded-2xl bg-indigo-600 p-6 text-white shadow">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">
          Today's Summary
        </h3>
        <div className="mt-2">
          {loading ? (
            <div className="my-1.5 h-12 w-16 animate-pulse rounded bg-indigo-500" />
          ) : (
            <span className="text-5xl font-bold">
              {stats.todayWashes}
            </span>
          )}
        </div>
        <p className="mt-2 text-base opacity-90">
          {new Intl.DateTimeFormat("en-SA", { dateStyle: "full" }).format(new Date())}
        </p>
      </div>

      {/* Recent Washes */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Recent Washes
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-400 text-base">
              <th className="pb-3 text-left font-medium">Customer</th>
              <th className="pb-3 text-left font-medium">Plate</th>
              <th className="pb-3 text-left font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {washesLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 animate-pulse"
                >
                  <td className="py-4">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : washes.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500 text-base">
                  No washes today yet
                </td>
              </tr>
            ) : (
              washes.map((wash) => (
                <tr
                  key={wash.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 text-base text-gray-800">{wash.customer_name}</td>
                  <td className="py-4 font-mono text-base text-gray-600">{wash.plate}</td>
                  <td className="py-4 text-base text-gray-400">
                    {new Date(wash.washed_at).toLocaleTimeString("en-SA")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


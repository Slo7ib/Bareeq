import { useDashboardStats } from "../hooks/useDashboardStats";
import { useRecentWashes } from "../hooks/useRecentWashes";
import { BUSINESS_ID } from "../constants";

const statCards = [
  { label: "Total Customers", icon: "👥", key: "totalCustomers" },
  { label: "Active Subscriptions", icon: "✅", key: "activeSubs" },
  { label: "Today's Washes", icon: "🚗", key: "todayWashes" },
] as const;

const planLabels = {
  monthly: "Monthly",
  per_wash: "Per Wash",
} as const;

function formatWashTime(washedAt: string) {
  const date = new Date(washedAt);
  const time = new Intl.DateTimeFormat("en-SA", { timeStyle: "short" }).format(date);
  if (date.toDateString() === new Date().toDateString()) return `Today, ${time}`;
  const day = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
  return `${day}, ${time}`;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-4xl">⚠️</p>
      <p className="text-base text-red-500">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
      >
        Try again
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats(BUSINESS_ID);
  const {
    washes,
    loading: washesLoading,
    error: washesError,
    refetch: refetchWashes,
  } = useRecentWashes(BUSINESS_ID);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base text-red-600 shadow-sm">
          <span>⚠️ Couldn't load stats: {error}</span>
          <button
            onClick={() => refetch()}
            className="shrink-0 text-sm font-semibold underline hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}

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
            ) : error ? (
              <span className="text-3xl font-bold text-slate-300">—</span>
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
          ) : error ? (
            <span className="text-5xl font-bold opacity-50">—</span>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Recent Washes</h2>
          <span className="flex items-center gap-2 text-xs font-medium text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        {washesError ? (
          <ErrorState
            message="Couldn't load recent washes."
            onRetry={() => refetchWashes()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-400 text-base">
                  <th className="pb-3 text-left font-medium">Customer</th>
                  <th className="pb-3 text-left font-medium">Plate</th>
                  <th className="pb-3 text-left font-medium">Package</th>
                  <th className="pb-3 text-left font-medium">Time</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {washesLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-0 animate-pulse"
                    >
                      {[24, 20, 16, 20, 16].map((w, i) => (
                        <td key={i} className="py-4">
                          <div
                            className="h-4 rounded bg-slate-200"
                            style={{ width: `${w * 4}px` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : washes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <p className="text-4xl">🚿</p>
                      <p className="mt-2 text-base text-gray-500">
                        No washes logged yet
                      </p>
                      <p className="text-sm text-gray-400">
                        New washes will appear here instantly.
                      </p>
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
                      <td className="py-4 text-base text-gray-600">
                        {wash.plan ? planLabels[wash.plan] : "—"}
                      </td>
                      <td className="py-4 text-base whitespace-nowrap text-gray-400">
                        {formatWashTime(wash.washed_at)}
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { X } from "lucide-react";
import type { Customer } from "../types";
import { useCustomers } from "../hooks/useCustomers";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { logWash } from "../hooks/useLogWash";
import { BUSINESS_ID } from "../constants";
export default function Customers() {
  const [washingId, setWashingId] = useState<string | null>(null);

  const { customers, loading, error, refetch } = useCustomers(BUSINESS_ID);
  const { subscriptions, refetchSubscriptions } = useSubscriptions(BUSINESS_ID);
  function normalize(str: string) {
    return str
      .replace(/\s/g, "")
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/[يى]/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/هـ/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/[\u064B-\u0652]/g, "");
  }
  function filteringPlate(customer: Customer) {
    return normalize(customer.plate).includes(normalize(search));
  }
  const getSubscription = (customerId: string) => {
    return subscriptions.find(
      (s) => s.customer_id === customerId && s.status === "active",
    );
  };
  const isActive = (customer: Customer) => {
    return getSubscription(customer.id) ? "active" : "expired";
  };
  const handleWash = async (customer: Customer) => {
    try {
      setWashingId(customer.id);
      const subscription = subscriptions.find((s) => {
        return s.customer_id === customer.id && s.status === "active";
      });
      if (!subscription) {
        console.log("No active subscription found");
        return;
      }
      await logWash(subscription, BUSINESS_ID);

      await Promise.all([refetch(), refetchSubscriptions()]);
    } catch (err) {
      console.error("Error when handeling wash" + err);
    } finally {
      setWashingId(null);
    }
  };

  const [search, setSearch] = useState("");
  const filtered = customers.filter((item) => filteringPlate(item));
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Car Wash CRM
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            {customers.length} total ·{" "}
            {
              customers.filter((customer) => isActive(customer) === "active")
                .length
            }{" "}
            active
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by plate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-700 shadow-sm transition-all duration-150 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setSearch("")}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Customer List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-400">{error}</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((customer) => (
              <div
                key={customer.id}
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-all duration-150 hover:border-blue-200 hover:shadow-md"
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar circle with initials */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {customer.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">
                      {customer.plate}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                    isActive(customer) === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {isActive(customer)}
                </span>
                <button
                  onClick={() => handleWash(customer)}
                  disabled={
                    isActive(customer) !== "active" || washingId === customer.id
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {washingId === customer.id ? "..." : "🚗 Start Wash"}
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <p className="text-4xl">🔍</p>
                <p className="mt-2 text-sm">
                  No customers match that plate number.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

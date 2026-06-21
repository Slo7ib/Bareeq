import { useState } from "react";
import { X } from "lucide-react";
import type { Customer } from "../types";
import { useCustomers } from "../hooks/useCustomers";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { logWash } from "../hooks/useLogWash";
import { BUSINESS_ID } from "../constants";
import ConfirmWashModal from "../components/ConfirmWashModal";

export default function Customers() {
  const [washingId, setWashingId] = useState<string | null>(null);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { customers, loading: custLoading, error: custError, refetch } = useCustomers(BUSINESS_ID);
  const { subscriptions, loading: subLoading, error: subError, refetchSubscriptions } = useSubscriptions(BUSINESS_ID);
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
      showToast("No active subscription found.", "error");
      return;
    }
    await logWash(subscription, BUSINESS_ID);
    await Promise.all([refetch(), refetchSubscriptions()]);
    showToast(`Wash logged for ${customer.name} ✓`, "success");
  } catch (err) {
    showToast("Something went wrong. Please try again.", "error");
    console.error("Error when handling wash" + err);
  } finally {
    setWashingId(null);
  }
};
function showToast(message: string, type: "success" | "error") {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
}
  const [search, setSearch] = useState("");
  const filtered = customers.filter((item) => filteringPlate(item));
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Car Wash CRM
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Customers</h1>
          <p className="mt-1 text-base text-slate-500">
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
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
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
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-700 shadow-sm transition-all duration-150 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setSearch("")}
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Customer List */}
        {custLoading || subLoading ? (
          <div className="py-20 text-center text-slate-400 text-base">Loading...</div>
        ) : custError || subError ? (
          <div className="py-20 text-center text-red-400 text-base">
            {custError || subError}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((customer) => (
              <div
                key={customer.id}
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm transition-all duration-150 hover:border-blue-200 hover:shadow-md"
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar circle with initials */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-base font-semibold text-blue-600">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      {customer.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(() => {
                        const sub = getSubscription(customer.id);
                        if (!sub) {
                          return (
                            <span className="font-medium text-red-500">
                              No active subscription
                            </span>
                          );
                        }
                        if (
                          sub.plan === "per_wash" ||
                          sub.plan === "per-wash"
                        ) {
                          return `${sub.washes_used} / ${
                            sub.washes_limit ?? 0
                          } washes used`;
                        }
                        if (sub.plan === "monthly") {
                          return `Expires: ${
                            sub.end_date
                              ? new Intl.DateTimeFormat("en-GB", {
                                  dateStyle: "medium",
                                }).format(new Date(sub.end_date))
                              : "N/A"
                          }`;
                        }
                        return null;
                      })()}
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-slate-400">
                      {customer.plate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide ${
                      isActive(customer) === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {isActive(customer)}
                  </span>
                  <button
                    onClick={() => setPendingCustomer(customer)}
                    disabled={
                      isActive(customer) !== "active" || washingId === customer.id
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {washingId === customer.id ? "..." : "🚗 Start Wash"}
                  </button>
                </div>
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

      <ConfirmWashModal
        customer={pendingCustomer}
        onConfirm={() => {
          if (pendingCustomer) {
            handleWash(pendingCustomer);
          }
          setPendingCustomer(null);
        }}
        onCancel={() => setPendingCustomer(null)}
      />
      {toast && (
  <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all ${
    toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
  }`}>
    {toast.message}
  </div>
)}
    </div>
  );
}


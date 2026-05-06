import { useState } from "react";
import type { Customer } from "../types";
const fakeCustomers = [
  {
    id: "1",
    business_id: "b1",
    name: "محمد العمري",
    plate: "أ ب ج 1234",
    status: "active",
    created_at: "2026-01-01",
    phone: "0500000000",
  },
  {
    id: "2",
    business_id: "b2",
    name: "خالد الغامدي",
    plate: "د هـ و 5678",
    status: "active",
    created_at: "2026-04-01",
    phone: "0500000000",
  },
  {
    id: "3",
    business_id: "b3",
    name: "سعد الشمري",
    plate: "ز ح ط 9012",
    status: "expired",
    created_at: "2026-01-10",
    phone: "0500000000",
  },
  {
    id: "4",
    business_id: "b4",
    name: "فهد القحطاني",
    plate: "ي ك ل 3456",
    status: "active",
    created_at: "2025-01-01",
    phone: "0500000000",
  },
  {
    id: "5",
    business_id: "b5",
    name: "عبدالله الزهراني",
    plate: "م ن س 7890",
    status: "expired",
    created_at: "2026-06-07",
    phone: "0500000000",
  },
];

export default function Customers() {
  function normalize(str: string) {
    return str.replace(/\s/g, "").toLowerCase();
  }
  function filteringPlate(customer: Customer) {
    return normalize(customer.plate).includes(normalize(search));
  }
  const [search, setSearch] = useState("");
  const filtered = fakeCustomers.filter((item) => filteringPlate(item));
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
            {fakeCustomers.length} total ·{" "}
            {fakeCustomers.filter((c) => c.status === "active").length} active
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
          {/* TODO: show a clear (×) button when search is not empty */}
        </div>

        {/* Customer List */}
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
                  customer.status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {customer.status === "active" ? "Active" : "Expired"}
              </span>
            </div>
          ))}

          {/* TODO: show this block when filtered list is empty */}
          {/* 
          <div className="py-16 text-center text-slate-400">
            <p className="text-4xl">🔍</p>
            <p className="mt-2 text-sm">No customers match that plate number.</p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

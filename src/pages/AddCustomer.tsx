// src/pages/AddCustomer.tsx
import { useState } from "react";

// --- Types ---
// TODO: fill in the shape of your form data here
type FormData = {
  name: string;
  phone: string;
  plate: string;
  subscriptionType: "monthly" | "per-wash" | "";
  washCount: string;
};

const emptyForm: FormData = {
  name: "",
  phone: "",
  plate: "",
  subscriptionType: "",
  washCount: "",
};

export default function AddCustomer() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  // TODO: wire each input's onChange to update `form` state
  // hint: setForm(prev => ({ ...prev, [field]: value }))

  // TODO: handle submit — console.log(form), setSubmitted(true), setForm(emptyForm)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // your logic goes here
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Car Wash CRM
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Add Customer
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to register a new customer.
          </p>
        </div>

        {/* Success Banner */}
        {/* TODO: show this when `submitted` is true */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Customer added successfully!</p>
              <p className="text-sm text-emerald-600">
                The form has been cleared and is ready for the next entry.
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mohammed Al-Omari"
                value={form.name}
                onChange={() => {}} // TODO: update form.name
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all duration-150 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-slate-400 select-none">
                  +966
                </span>
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={form.phone}
                  onChange={() => {}} // TODO: update form.phone
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-14 text-sm text-slate-800 transition-all duration-150 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Plate Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Plate Number
              </label>
              <input
                type="text"
                placeholder="e.g. ABJ 1234"
                value={form.plate}
                onChange={() => {}} // TODO: update form.plate
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 transition-all duration-150 outline-none placeholder:font-sans placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Subscription Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Subscription Type
              </label>
              <select
                value={form.subscriptionType}
                onChange={() => {}} // TODO: update form.subscriptionType
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all duration-150 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select a plan...
                </option>
                <option value="monthly">Monthly</option>
                <option value="per-wash">Per Wash</option>
              </select>
            </div>

            {/* Wash Count — only visible when "per-wash" is selected */}
            {/* TODO: wrap this in a condition: form.subscriptionType === "per-wash" */}
            {form.subscriptionType === "per-wash" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Number of Washes
                  <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500">
                    Per-wash plan only
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 10"
                  value={form.washCount}
                  onChange={() => {}} // TODO: update form.washCount
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all duration-150 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-150 hover:bg-blue-700 active:scale-[0.98]"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

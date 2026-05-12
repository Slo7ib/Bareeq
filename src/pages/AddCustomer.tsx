// src/pages/AddCustomer.tsx
import { useState } from "react";

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
  const [attempted, setAttempted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);

    const hasErrors =
      !form.name.trim() ||
      !/^05\d{8}$/.test(form.phone) ||
      !form.plate.trim() ||
      !form.subscriptionType ||
      (form.subscriptionType === "per-wash" && !form.washCount);

    if (hasErrors) return;

    console.log(form);
    setSubmitted(true);
    setForm(emptyForm);
    setAttempted(false);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const inputBase =
    "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all duration-150 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2";

  const inputState = (invalid: boolean) =>
    invalid
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-400 focus:ring-blue-100";

  const errors = {
    name: attempted && !form.name.trim(),
    phone: attempted && !/^05\d{8}$/.test(form.phone),
    plate: attempted && !form.plate.trim(),
    subscriptionType: attempted && !form.subscriptionType,
    washCount:
      attempted && form.subscriptionType === "per-wash" && !form.washCount,
  };

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
          noValidate
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Customer Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Mohammed Al-Omari"
                value={form.name}
                onChange={onChangeHandler}
                className={`${inputBase} ${inputState(errors.name)}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">Name is required.</p>
              )}
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
                  name="phone"
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={form.phone}
                  onChange={onChangeHandler}
                  className={`${inputBase} pr-4 pl-14 ${inputState(errors.phone)}`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">
                  Must start with 05 and be exactly 10 digits.
                </p>
              )}
            </div>

            {/* Plate Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Plate Number
              </label>
              <input
                name="plate"
                type="text"
                placeholder="e.g. ABJ 1234"
                value={form.plate}
                onChange={onChangeHandler}
                className={`${inputBase} font-mono placeholder:font-sans ${inputState(errors.plate)}`}
              />
              {errors.plate && (
                <p className="text-xs text-red-500">
                  Plate number is required.
                </p>
              )}
            </div>

            {/* Subscription Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Subscription Type
              </label>
              <select
                name="subscriptionType"
                value={form.subscriptionType}
                onChange={onChangeHandler}
                className={`${inputBase} appearance-none ${inputState(errors.subscriptionType)}`}
              >
                <option value="" disabled>
                  Select a plan...
                </option>
                <option value="monthly">Monthly</option>
                <option value="per-wash">Per Wash</option>
              </select>
              {errors.subscriptionType && (
                <p className="text-xs text-red-500">Please select a plan.</p>
              )}
            </div>

            {/* Wash Count */}
            {form.subscriptionType === "per-wash" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Number of Washes
                  <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500">
                    Per-wash plan only
                  </span>
                </label>
                <input
                  name="washCount"
                  type="number"
                  min={1}
                  placeholder="e.g. 10"
                  value={form.washCount}
                  onChange={onChangeHandler}
                  className={`${inputBase} ${inputState(errors.washCount)}`}
                />
                {errors.washCount && (
                  <p className="text-xs text-red-500">
                    Enter the number of washes.
                  </p>
                )}
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

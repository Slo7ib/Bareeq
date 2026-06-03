import { useState } from "react";
import { addCustomer } from "../hooks/useAddCustomer";
import { expirationCalc } from "../hooks/expirationCalc";
import { addSubscription } from "../hooks/useAddSubscription";
import type { FormData } from "../types";
import { BUSINESS_ID } from "../constants";

const emptyForm: FormData = {
  name: "",
  phone: "",
  plate: "",
  subscriptionType: "",
  washCount: "",
  business_id: BUSINESS_ID,
};

function FormField({
  label,
  error,
  errorMessage,
  hint,
  children,
}: {
  label: React.ReactNode;
  error: boolean;
  errorMessage: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-sm text-slate-400">{hint}</p>}
      {error && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default function AddCustomer() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);

    const hasErrors =
      !form.name.trim() ||
      !/^05\d{8}$/.test(form.phone) ||
      !form.plate.trim() ||
      !form.subscriptionType ||
      (form.subscriptionType === "per_wash" && !form.washCount);

    if (hasErrors) return;

    try {
      setSaving(true);
      const expires_at = expirationCalc(
        form.subscriptionType as "monthly" | "per_wash",
      );
      const customerId = await addCustomer({
        name: form.name,
        phone: form.phone,
        plate: form.plate,
        business_id: form.business_id,
        subscription_type: form.subscriptionType as "monthly" | "per_wash",
        wash_count:
          form.subscriptionType === "per_wash" ? Number(form.washCount) : null,
        expires_at,
      });

      await addSubscription({
        customer_id: customerId,
        business_id: form.business_id,
        plan: form.subscriptionType as "monthly" | "per_wash",
        washes_limit:
          form.subscriptionType === "per_wash" ? Number(form.washCount) : null,
      });

      setForm(emptyForm);
      setAttempted(false);
      setTimeout(() => setSubmitted(false), 4000);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const inputBase =
    "w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-base text-slate-800 transition-all duration-150 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2";

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
      attempted && form.subscriptionType === "per_wash" && !form.washCount,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Car Wash CRM
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Add Customer
          </h1>
          <p className="mt-1 text-base text-slate-500">
            Fill in the details below to register a new customer.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm text-base">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-base">Customer added successfully!</p>
              <p className="text-sm text-emerald-600">
                The form has been cleared and is ready for the next entry.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6">
            <FormField
              label="Customer Name"
              error={errors.name}
              errorMessage="Name is required."
            >
              <input
                name="name"
                type="text"
                placeholder="e.g. Mohammed Al-Omari"
                value={form.name}
                onChange={onChangeHandler}
                className={`${inputBase} ${inputState(errors.name)}`}
              />
            </FormField>

            <FormField
              label="Phone Number"
              error={errors.phone}
              errorMessage="Must start with 05 and be exactly 10 digits."
            >
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-base font-semibold text-slate-400 select-none">
                  +966
                </span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={form.phone}
                  onChange={onChangeHandler}
                  className={`${inputBase} pr-4 pl-16 ${inputState(errors.phone)}`}
                />
              </div>
            </FormField>

            <FormField
              label="Plate Number"
              error={errors.plate}
              errorMessage="Plate number is required."
              hint="Letters first, then numbers — e.g. B D 452"
            >
              <input
                name="plate"
                type="text"
                placeholder="e.g. A 1  or  ABJ 1234"
                value={form.plate}
                onChange={onChangeHandler}
                className={`${inputBase} font-mono uppercase placeholder:font-sans placeholder:normal-case ${inputState(errors.plate)}`}
              />
            </FormField>

            <FormField
              label="Subscription Type"
              error={errors.subscriptionType}
              errorMessage="Please select a plan."
            >
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
                <option value="per_wash">Per Wash</option>
              </select>
            </FormField>

            {form.subscriptionType === "per_wash" && (
              <FormField
                label={
                  <>
                    Number of Washes
                    <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500">
                      Per Wash plan only
                    </span>
                  </>
                }
                error={errors.washCount}
                errorMessage="Enter the number of washes."
              >
                <input
                  name="washCount"
                  type="number"
                  min={1}
                  placeholder="e.g. 10"
                  value={form.washCount}
                  onChange={onChangeHandler}
                  className={`${inputBase} ${inputState(errors.washCount)}`}
                />
              </FormField>
            )}

            <div className="border-t border-slate-100" />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-4 px-6 text-base font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Add Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

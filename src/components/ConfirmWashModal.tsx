type CustomerWashProps = {
  name: string;
  plate: string;
};

type ConfirmWashModalProps = {
  customer: CustomerWashProps | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmWashModal({
  customer,
  onConfirm,
  onCancel,
}: ConfirmWashModalProps) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-6xl" role="img" aria-label="car">
            🚗
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            {customer.name}
          </h2>
          <p className="mt-1 font-mono text-base text-slate-500">
            {customer.plate}
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Are you sure you want to log a wash for this customer?
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full rounded-2xl bg-emerald-500 py-4 text-base font-bold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            ✅ Confirm Wash
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl bg-slate-100 py-4 text-base font-bold text-slate-600 transition hover:bg-slate-200 active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

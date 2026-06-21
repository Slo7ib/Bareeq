import { useState } from "react";
import logo from "../assets/128px_icon.svg";

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("unlocked") === "true"
  );

  function handleSubmit() {
    if (input === import.meta.env.VITE_APP_PIN) {
      sessionStorage.setItem("unlocked", "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 2000);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <img src={logo} alt="Bareeq" className="mb-8 h-16 w-auto" />
      <div className="w-full max-w-xs rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-slate-800">
          Enter PIN
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Enter your shop PIN to continue
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="••••"
          className={`w-full rounded-xl border px-4 py-3.5 text-center text-2xl tracking-widest outline-none transition-all focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
          }`}
        />
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">
            Incorrect PIN, try again.
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
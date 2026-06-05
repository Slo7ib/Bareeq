import logo from "../assets/128px_icon.svg";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <section className="flex h-16 items-center justify-between border-b bg-neutral-300 px-4">
      <div>
        <img src={logo} alt="Bareeq" className="h-10 w-auto" />
      </div>

      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5" />

        <span className="font-medium">Joe Doe</span>
      </div>
    </section>
  );
}

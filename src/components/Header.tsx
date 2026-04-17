import { Car } from "lucide-react";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <>
      <section className="flex h-16 items-center justify-between bg-indigo-600 px-3">
        <div className="flex items-center space-x-2.5 text-2xl font-bold uppercase">
          <Car className="h-10 w-10" />
          <span>Bareeq</span>
        </div>
        <div>
          <Bell className="h-5 w-5" />
          <div>
            <span>Joe Doe</span>
          </div>
        </div>
      </section>
    </>
  );
}

import { UserPlus, House, Users } from "lucide-react";
import Header from "./Header";
import type { ReactElement } from "react";

export default function Layout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-amber-100">
      <Header />
      <section className="flex-1 overflow-y-auto p-4">
        <div>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis
          perferendis vitae expedita, nihil nesciunt placeat explicabo odio
          corrup
        </div>
      </section>
      <Box />
    </div>
  );
}
interface navItemsTypes {
  active: boolean;
  title: string;
  icon: ReactElement;
}
function Box() {
  const navItems: navItemsTypes[] = [
    {
      active: true,
      title: "Dashobard",
      icon: <House className="size-16 text-amber-50" />,
    },
    {
      active: false,
      title: "Customers",
      icon: <Users className="size-16 text-amber-50" />,
    },
    {
      active: false,
      title: "Add Customer",
      icon: <UserPlus className="size-16 text-amber-50" />,
    },
  ];

  return (
    <ul className="flex h-44 w-full flex-row justify-between gap-2 bg-indigo-500 px-0 py-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => (
        <div
          className={`flex w-full flex-col items-center justify-center space-y-3.5 ${item.active ? `bg-indigo-950` : `bg-indigo-600`}`}
        >
          <span
            className="text-center font-mono text-2xl font-semibold text-amber-50"
            key={item.title}
          >
            {item.title}
          </span>
          <div>{item.icon}</div>
        </div>
      ))}
    </ul>
  );
}

import { UserPlus, House, Users } from "lucide-react";
import Header from "./Header";
import type { ReactElement } from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex w-full flex-col bg-amber-100" style={{ height: '100dvh' }}>
      <Header />
      <section className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </section>
      <Box />
    </div>
  );
}

interface navItemsTypes {
  title: string;
  icon: ReactElement;
  link: string;
  end: boolean;
}

function Box() {
  const navItems: navItemsTypes[] = [
    { title: "Dashboard", icon: <House className="size-6 text-amber-50" />, link: "/home", end: true },
    { title: "Customers", icon: <Users className="size-6 text-amber-50" />, link: "/customers", end: true },
    { title: "Add Customer", icon: <UserPlus className="size-6 text-amber-50" />, link: "/customers/add", end: true },
  ];

  return (
    <ul
      className="flex w-full flex-row justify-between bg-indigo-500 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: '5rem' }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.link}
          end={item.end}
          className={({ isActive }) =>
            `flex w-full flex-row items-center justify-center gap-2.5 ${isActive ? 'bg-indigo-950' : 'bg-indigo-600'}`
          }
        >
          {item.icon}
          <span className="font-mono text-base font-semibold text-amber-50">
            {item.title}
          </span>
        </NavLink>
      ))}
    </ul>
  );
}
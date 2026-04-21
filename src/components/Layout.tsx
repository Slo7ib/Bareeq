import Header from "./Header";

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
function Box() {
  const navItems = ["Dashobard", "Customers", "Add Customers"];
  return (
    <ul className="flex w-full flex-row justify-between gap-2 bg-indigo-600 px-14 py-8 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => (
        <li
          className="text-center font-mono text-2xl font-semibold text-amber-50"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

import logo from "../assets/128px_icon.svg";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { BUSINESS_ID } from "../constants";

export default function Header() {
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      const { data } = await supabase
        .from("businesses")
        .select("name")
        .eq("id", BUSINESS_ID)
        .single();
      if (data) setBusinessName(data.name);
    }
    fetchBusiness();
  }, []);

  return (
    <section className="flex h-16 items-center justify-between border-b bg-neutral-300 px-4">
      <div>
        <img src={logo} alt="Bareeq" className="h-10 w-auto" />
      </div>
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5" />
        <span className="font-medium">{businessName ?? "..."}</span>
      </div>
    </section>
  );
}
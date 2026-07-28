import Link from "next/link";
import { contactChecklistItems } from "@/lib/contact";

export default function ContactChecklist() {
  return (
    <aside className="rounded-2xl border border-[#173A8A]/15 bg-[#F5F7FA] p-6 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
        Checklist
      </p>
      <h2 className="mt-2 text-xl font-black text-[#0B1F4D]">
        Wat we nodig hebben voor snelle bezetting
      </h2>
      <ul className="mt-5 space-y-3">
        {contactChecklistItems.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#101828]/80">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F28C28] text-[10px] font-black text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-[#101828]/65">
        Meer context? Bekijk{" "}
        <Link
          href="/diensten"
          className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
        >
          diensten
        </Link>
        ,{" "}
        <Link
          href="/opdrachtgevers"
          className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
        >
          opdrachtgevers
        </Link>{" "}
        of{" "}
        <Link
          href="/projecten"
          className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
        >
          projectervaring
        </Link>
        .
      </p>
    </aside>
  );
}

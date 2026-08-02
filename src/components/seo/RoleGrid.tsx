import type { SeoRole } from "@/lib/seo/types";

type RoleGridProps = {
  title?: string;
  roles: SeoRole[];
};

export default function RoleGrid({
  title = "Rollen en functies",
  roles,
}: RoleGridProps) {
  return (
    <section className="bg-[#F5F7FA] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">{title}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <li
              key={role.title}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#0B1F4D]">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#101828]/75">
                {role.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

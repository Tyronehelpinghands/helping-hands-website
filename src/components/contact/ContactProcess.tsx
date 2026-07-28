import { contactProcessSteps } from "@/lib/contact";

export default function ContactProcess() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
          Werkwijze
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
          Zo behandelen wij je aanvraag
        </h2>
        <p className="mt-4 text-base leading-8 text-[#101828]/75">
          Van eerste mail tot crew op locatie — korte lijnen, heldere stappen.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {contactProcessSteps.map((item) => (
          <li
            key={item.step}
            className="rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-5"
          >
            <span className="text-sm font-black text-[#F28C28]">{item.step}</span>
            <h3 className="mt-2 text-base font-black text-[#0B1F4D]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#101828]/70">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

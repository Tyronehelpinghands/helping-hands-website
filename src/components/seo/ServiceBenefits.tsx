type ServiceBenefitsProps = {
  title?: string;
  items: string[];
};

export default function ServiceBenefits({
  title = "Waarvoor kun je ons inzetten?",
  items,
}: ServiceBenefitsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">{title}</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#0B1F4D]"
          >
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

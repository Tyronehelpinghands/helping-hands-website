type TrustSectionProps = {
  title?: string;
  items: string[];
};

export default function TrustSection({
  title = "Waarom Helping Hands Agency?",
  items,
}: TrustSectionProps) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">{title}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl bg-[#F5F7FA] px-4 py-4 text-sm font-semibold leading-6 text-[#0B1F4D]"
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

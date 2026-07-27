import RevealOnScroll from "@/components/RevealOnScroll";
import { employeeAudience } from "@/lib/employeePage";

export default function EmployeeAudience() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Voor wie
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Voor wie is dit geschikt?
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Helping Hands is er voor mensen die willen werken, leren en groeien.
              Ervaring is mooi meegenomen, maar motivatie, betrouwbaarheid en
              communicatie zijn minstens zo belangrijk.
            </p>
            <p className="mt-4 text-base font-semibold leading-8 text-[#173A8A] sm:text-lg">
              Niet iedereen past direct in een standaard baan. Soms heb je alleen
              de juiste plek, begeleiding en kans nodig.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employeeAudience.map((item, index) => (
            <RevealOnScroll key={item.title} delayMs={index * 40}>
              <article className="h-full rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 transition hover:border-[#173A8A]/35 hover:bg-white hover:shadow-md">
                <h3 className="text-base font-black text-[#0B1F4D]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#101828]/70">
                  {item.description}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

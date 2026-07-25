import Reveal from "@/components/over-ons/Reveal";

type OverOnsQuoteProps = {
  quote: string;
};

export default function OverOnsQuote({ quote }: OverOnsQuoteProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <figure className="overflow-hidden rounded-3xl bg-[#0B1F4D] px-6 py-10 text-white shadow-xl sm:px-12 sm:py-14">
            <div className="mb-4 h-1 w-12 rounded-full bg-[#F28C28]" />
            <blockquote className="max-w-4xl text-2xl font-black leading-snug tracking-tight sm:text-3xl lg:text-4xl">
              “{quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              Helping Hands Agency
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

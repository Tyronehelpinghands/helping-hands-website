import StockImage from "@/components/StockImage";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
        </div>
        {image && (
          <StockImage
            src={image}
            alt={imageAlt ?? title}
            fill
            className="relative aspect-[16/10] w-full rounded-2xl shadow-2xl"
            placeholderLabel={eyebrow}
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        )}
      </div>
    </section>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-[#173A8A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import StockImage from "@/components/StockImage";
import { projectCategories } from "@/lib/content";
import { stockImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Projecten | Helping Hands Agency",
  description:
    "Helping Hands Agency wordt ingezet bij evenementen, producties, horeca-opdrachten, stadions, beurzen en festivals.",
};

export default function ProjectenPage() {
  return (
    <>
      <PageHero
        eyebrow="Projecten"
        title="Ingezet waar producties draaien."
        description="Helping Hands Agency wordt ingezet bij evenementen, producties, horeca-opdrachten, stadions, beurzen en festivals."
        image={stockImages.festivals}
        imageAlt="Festival productie"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="max-w-3xl text-lg leading-8 text-[#101828]/75">
          Wij ondersteunen uiteenlopende producties met crew die begrijpt wat er op locatie nodig is.
          Hieronder vind je de categorieën waarin wij worden ingezet — zonder verzonnen
          klantcases, wel met duidelijke context.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectCategories.map((category) => (
            <article
              key={category.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg transition hover:border-[#173A8A]/30 hover:shadow-xl"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-[#F28C28]" />
              <h2 className="text-xl font-black text-[#0B1F4D]">{category.title}</h2>
              <p className="mt-3 leading-7 text-[#101828]/75">{category.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <StockImage
            src={stockImages.horecaSupport}
            alt="Horeca support op event"
            fill
            className="relative aspect-video w-full rounded-2xl shadow-xl"
            placeholderLabel="Horeca"
          />
          <StockImage
            src={stockImages.productionBackstage}
            alt="Backstage productie"
            fill
            className="relative aspect-video w-full rounded-2xl shadow-xl"
            placeholderLabel="Productie"
          />
        </div>
      </section>

      <CTASection
        title="Jouw productie, onze crew."
        description="Vertel ons over je planning en wij denken mee over de juiste bezetting."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}

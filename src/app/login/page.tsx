import type { Metadata } from "next";
import LoginSelector from "@/components/LoginSelector";
import { getPortalByType } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Inloggen | Helping Hands Agency",
  description:
    "Log in op het intern portaal, medewerkersportaal of opdrachtgeversportaal van Helping Hands Agency.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const initialType = getPortalByType(params.type ?? null);

  return (
    <>
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Portalen
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Inloggen bij Helping Hands Agency
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            Kies je portaal. De portalen zijn voorbereid en worden later gekoppeld
            aan veilige toegang.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-[#F28C28]/40 bg-[#F28C28]/15 px-4 py-2 text-sm font-bold text-[#F28C28]">
            Portaal in ontwikkeling. Toegang wordt later geactiveerd.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <LoginSelector key={initialType} initialType={initialType} />
      </section>
    </>
  );
}

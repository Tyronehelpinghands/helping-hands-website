import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";
import {
  teamAvondDienst,
  teamCaptainsNote,
  teamMembers,
} from "@/lib/opdrachtgeversContent";

type TeamSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  showNotes?: boolean;
};

export default function TeamSection({
  eyebrow = "Team achter de planning",
  title = "Wie je aan de lijn krijgt",
  description = "Geen anoniem callcenter — een klein, vast team dat jouw opdracht kent.",
  showNotes = true,
}: TeamSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-24">
      <div
        className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#F28C28]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              {description}
            </p>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stepMs={70}>
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition hover:border-[#F28C28]/40 hover:bg-white/10"
            >
              <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-lg font-black tracking-wide">
                {member.image ? (
                  <Image
                    src={member.image.src}
                    alt={member.image.alt}
                    fill
                    sizes="80px"
                    quality={90}
                    className="object-cover object-[center_20%]"
                  />
                ) : (
                  member.initials
                )}
              </span>
              <p className="mt-4 text-base font-black leading-snug">
                {member.name}
              </p>
              <p className="mt-1 text-sm text-white/70">{member.role}</p>
              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className="mt-3 block text-sm font-semibold text-[#F28C28] underline-offset-4 hover:underline"
                >
                  {member.email}
                </a>
              ) : null}
              {member.note ? (
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {member.note}
                </p>
              ) : null}
            </article>
          ))}
        </StaggerReveal>

        {showNotes ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm font-black text-white">
                {teamAvondDienst.role}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {teamAvondDienst.text}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm font-black text-white">
                {teamCaptainsNote.role}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {teamCaptainsNote.text}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

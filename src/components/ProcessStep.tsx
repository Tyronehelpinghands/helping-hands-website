type ProcessStepProps = {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
};

export default function ProcessStep({
  step,
  title,
  description,
  isLast = false,
}: ProcessStepProps) {
  return (
    <article className="relative flex gap-4 lg:block">
      {/* Verticale lijn mobiel */}
      {!isLast && (
        <div
          className="absolute left-5 top-12 h-[calc(100%-1rem)] w-0.5 bg-[#F28C28]/30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex shrink-0 flex-col items-center lg:items-start">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F28C28] text-xs font-black text-white shadow-lg shadow-[#F28C28]/30">
          {step}
        </span>
        {/* Horizontale lijn desktop */}
        {!isLast && (
          <div
            className="absolute left-full top-5 hidden h-0.5 w-full bg-gradient-to-r from-[#F28C28]/50 to-[#F28C28]/10 lg:block"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex-1 rounded-2xl bg-[#0B1F4D] p-5 text-white shadow-lg lg:mt-4">
        <h3 className="text-lg font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/75">{description}</p>
      </div>
    </article>
  );
}

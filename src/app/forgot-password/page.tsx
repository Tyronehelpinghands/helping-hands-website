import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten | Helping Hands Agency",
  description: "Vraag een wachtwoord-resetlink aan voor je Helping Hands account.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7dd3fc]">
            Account
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Wachtwoord vergeten
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
            Ontvang een veilige resetlink op je e-mailadres.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F7FA] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-xl">
          <ForgotPasswordForm />
        </div>
      </section>
    </>
  );
}

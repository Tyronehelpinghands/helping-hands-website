"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/navigation";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-[0_1px_20px_rgba(11,31,77,0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Helping Hands Agency home"
        >
          <Image
            src="/hh-logo.png"
            alt="Helping Hands Agency logo"
            width={40}
            height={40}
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="text-sm font-extrabold tracking-tight text-[#173A8A] sm:text-base">
            Helping Hands Agency
          </span>
        </Link>

        <nav
          className="hidden items-center gap-4 text-[0.8125rem] font-semibold text-slate-600 xl:flex"
          aria-label="Hoofdnavigatie"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2 py-1.5 transition hover:bg-[#F5F7FA] hover:text-[#173A8A] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                  isActive ? "bg-[#F5F7FA] text-[#173A8A]" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/contact"
            className="hidden rounded-full bg-[#F28C28] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:inline-flex sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Personeel aanvragen
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 text-[#173A8A] transition hover:border-slate-300 hover:bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg xl:hidden"
        >
          <nav className="flex flex-col gap-0.5" aria-label="Mobiele navigatie">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                    isActive ? "bg-[#F5F7FA] text-[#173A8A]" : "text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
            >
              Personeel aanvragen
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

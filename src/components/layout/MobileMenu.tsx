"use client";

import Link from "next/link";
import { ChevronDown } from "@/components/layout/HeaderDropdown";
import {
  contactEmail,
  navDropdowns,
  simpleNavLinks,
  type NavDropdownConfig,
} from "@/lib/navigation";

type MobileMenuProps = {
  open: boolean;
  pathname: string;
  accordion: NavDropdownConfig["id"] | null;
  onAccordionChange: (id: NavDropdownConfig["id"] | null) => void;
  onClose: () => void;
};

function isLinkActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function isDropdownActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileMenu({
  open,
  pathname,
  accordion,
  onAccordionChange,
  onClose,
}: MobileMenuProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Menu sluiten"
        className="fixed inset-0 z-[60] bg-[#0B1F4D]/45 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />

      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobiel menu"
        className="fixed inset-y-0 right-0 z-[70] flex h-dvh w-[min(88vw,24rem)] max-w-full animate-[slide-in-right_0.22s_ease-out] flex-col overflow-x-hidden bg-white shadow-2xl lg:hidden"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
          <p className="text-base font-extrabold tracking-tight text-[#173A8A]">
            Helping Hands
          </p>
          <button
            type="button"
            aria-label="Menu sluiten"
            className="inline-flex h-11 min-h-11 w-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            onClick={onClose}
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
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-2"
          aria-label="Mobiele navigatie"
        >
          <Link
            href="/"
            onClick={onClose}
            className={`block border-b border-slate-100 px-2 py-3.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
              isLinkActive(pathname, "/")
                ? "bg-[#173A8A]/5 text-[#173A8A]"
                : "text-[#101828] hover:bg-[#F5F7FA]"
            }`}
          >
            Home
          </Link>

          {navDropdowns.map((config) => {
            const expanded = accordion === config.id;
            return (
              <div key={config.id} className="border-b border-slate-100">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-${config.id}-panel`}
                  onClick={() =>
                    onAccordionChange(expanded ? null : config.id)
                  }
                  className="flex w-full cursor-pointer items-center justify-between px-2 py-3.5 text-left text-base font-semibold text-[#101828] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
                >
                  <span
                    className={
                      isDropdownActive(pathname, config.href)
                        ? "text-[#173A8A]"
                        : undefined
                    }
                  >
                    {config.label}
                  </span>
                  <ChevronDown open={expanded} />
                </button>

                {expanded ? (
                  <div
                    id={`mobile-${config.id}-panel`}
                    className="space-y-2 px-2 pb-4"
                  >
                    <p className="px-2 text-sm font-bold text-[#173A8A]">
                      {config.panelTitle}
                    </p>
                    {config.panelDescription ? (
                      <p className="px-2 text-sm text-slate-600">
                        {config.panelDescription}
                      </p>
                    ) : null}
                    {config.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-xl border border-slate-100 px-4 py-3 transition hover:border-[#F28C28]/40 hover:bg-[#F28C28]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
                      >
                        <p className="font-bold text-[#101828]">{item.title}</p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                    {config.cta ? (
                      <Link
                        href={config.cta.href}
                        onClick={onClose}
                        className="mx-2 mt-2 inline-flex rounded-full bg-[#F28C28] px-4 py-2.5 text-sm font-bold text-white"
                      >
                        {config.cta.label}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}

          {simpleNavLinks
            .filter((link) => link.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`block border-b border-slate-100 px-2 py-3.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
                  isLinkActive(pathname, link.href)
                    ? "bg-[#173A8A]/5 text-[#173A8A]"
                    : "text-[#101828] hover:bg-[#F5F7FA]"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-slate-200 bg-white px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Link
            href="/contact"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-full bg-[#F28C28] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          >
            Personeel aanvragen
          </Link>
          <Link
            href="/vacatures"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-5 py-3.5 text-base font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          >
            Crew aanmelden
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-full border-2 border-[#173A8A]/30 bg-white px-5 py-3.5 text-base font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          >
            Login
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            className="block text-center text-sm font-semibold text-slate-600 underline-offset-4 hover:text-[#173A8A] hover:underline"
          >
            {contactEmail}
          </a>
        </div>
      </div>
    </>
  );
}

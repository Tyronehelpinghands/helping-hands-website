"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogoImage } from "@/components/BrandLogo";
import {
  contactPhoneDisplay,
  contactPhoneTel,
  contactWhatsappUrl,
  mobileNavGroups,
  planningEmail,
  type NavDropdownConfig,
} from "@/lib/navigation";
import { crewApplyHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  pathname: string;
  accordion: NavDropdownConfig["id"] | null;
  onAccordionChange: (id: NavDropdownConfig["id"] | null) => void;
  onClose: () => void;
};

const primaryLinks = [
  { href: "/vacatures", label: "Vacatures" },
  { href: "/projecten", label: "Projecten" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={cn(
        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
        open && "rotate-180 text-[#F28C28]",
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Shared "app row" style for primary nav items + accordion triggers. */
function navRowClassName(active: boolean) {
  return cn(
    "flex w-full items-center justify-between gap-3 rounded-xl border-l-[3px] px-3.5 py-3.5 text-left text-[0.9375rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
    active
      ? "border-[#F28C28] bg-[#F28C28]/10 text-[#173A8A]"
      : "border-transparent text-[#101828] hover:bg-[#F5F7FA]",
  );
}

export default function MobileMenu({
  open,
  pathname,
  accordion,
  onAccordionChange,
  onClose,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Adjust mount/visibility state during render when `open` changes, so the
  // drawer can mount immediately and animate out before unmounting.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setMounted(true);
    else setVisible(false);
  }

  useEffect(() => {
    if (open) return;
    const timeout = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      closeButtonRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Mobiel menu"
      className={cn(
        "fixed inset-0 z-[80] flex max-h-[100dvh] flex-col overflow-x-hidden bg-white transition-all duration-[220ms] ease-out lg:hidden",
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-3 opacity-0 pointer-events-none",
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#173A8A] via-[#173A8A] to-[#F28C28]"
        aria-hidden="true"
      />

      <div
        className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 pl-6 pr-4 pt-[max(0.875rem,env(safe-area-inset-top))] pb-3.5 sm:pl-7 sm:pr-5"
        style={{ minHeight: "72px" }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="inline-flex min-w-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          aria-label="Helping Hands Agency home"
        >
          <BrandLogoImage
            variant="full"
            imageClassName="h-9 max-h-12 w-auto max-w-[150px]"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-slate-400 min-[360px]:inline">
            Menu
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Menu sluiten"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-[#173A8A] transition hover:border-slate-300 hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
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
      </div>

      <nav
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
        aria-label="Mobiele navigatie"
      >
        <div className="space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className={navRowClassName(isLinkActive(pathname, "/"))}
          >
            Home
          </Link>

          {mobileNavGroups.map((group) => {
            const expanded = accordion === group.id;
            const active = isGroupActive(pathname, group.href);
            return (
              <div key={group.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-${group.id}-panel`}
                  onClick={() => onAccordionChange(expanded ? null : group.id)}
                  className={cn(navRowClassName(active), "cursor-pointer")}
                >
                  <span>{group.label}</span>
                  <ChevronDown open={expanded} />
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-[220ms] ease-out"
                  style={{
                    gridTemplateRows: expanded ? "1fr" : "0fr",
                  }}
                >
                  <div
                    id={`mobile-${group.id}-panel`}
                    className="overflow-hidden"
                  >
                    <div className="mb-2 ml-3 mt-1.5 space-y-0.5 rounded-xl bg-[#F5F7FA] p-2">
                      {group.items.map((item) => {
                        const itemActive = isLinkActive(pathname, item.href);
                        const itemClassName = cn(
                          "block rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
                          itemActive
                            ? "bg-white text-[#173A8A] shadow-sm"
                            : "text-slate-600 hover:bg-white/80 hover:text-[#173A8A]",
                        );
                        const href = item.href;
                        if (
                          href.startsWith("mailto:") ||
                          href.startsWith("tel:")
                        ) {
                          return (
                            <a
                              key={item.label}
                              href={href}
                              onClick={onClose}
                              className={itemClassName}
                            >
                              {item.label}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.label}
                            href={href}
                            onClick={onClose}
                            className={itemClassName}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={navRowClassName(isLinkActive(pathname, link.href))}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="my-5 border-t border-slate-100" />

        <div>
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Snel regelen
          </p>
          <div className="space-y-2">
            <Link
              href="/contact"
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#F28C28] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#F28C28]/25 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            >
              Personeel aanvragen
            </Link>
            <Link
              href={crewApplyHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-[#173A8A] px-5 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            >
              Crew aanmelden
            </Link>
          </div>
        </div>

        <div className="my-5 border-t border-slate-100" />

        <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Direct contact
          </p>
          <div className="space-y-2">
            <a
              href={`tel:${contactPhoneTel}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-[#F28C28]/40 hover:bg-[#F28C28]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173A8A]/10 text-[#173A8A]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#101828]">
                  {contactPhoneDisplay}
                </span>
                <span className="block text-xs text-slate-500">Bellen</span>
              </span>
            </a>

            <a
              href={contactWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-[#F28C28]/40 hover:bg-[#F28C28]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173A8A]/10 text-[#173A8A]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#101828]">
                  WhatsApp
                </span>
                <span className="block text-xs text-slate-500">
                  Stuur een bericht
                </span>
              </span>
            </a>

            <a
              href={`mailto:${planningEmail}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-[#F28C28]/40 hover:bg-[#F28C28]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173A8A]/10 text-[#173A8A]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="m4 5 8 7 8-7" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 truncate">
                <span className="block truncate text-sm font-semibold text-[#101828]">
                  {planningEmail}
                </span>
                <span className="block text-xs text-slate-500">Planning</span>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

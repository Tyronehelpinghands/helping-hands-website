"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeaderBrandLogo } from "@/components/BrandLogo";
import HeaderDropdown from "@/components/layout/HeaderDropdown";
import MobileMenu from "@/components/layout/MobileMenu";
import {
  pathHasDarkHero,
  useScrollHeader,
} from "@/hooks/useScrollHeader";
import {
  contactPhoneDisplay,
  contactPhoneTel,
  contactWhatsappUrl,
  navDropdowns,
  simpleNavLinks,
  type NavDropdownConfig,
} from "@/lib/navigation";
import { openApplyMailto } from "@/lib/vacancies";
import { cn } from "@/lib/utils";

type DropdownId = NavDropdownConfig["id"] | null;

export default function PublicHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { scrolled, progress } = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownId>(
    pathname === "/" ? "diensten" : null,
  );

  const darkHero = pathHasDarkHero(pathname);
  const inverted = darkHero && !scrolled && !menuOpen;

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
  }, []);

  const isDropdownActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isLinkActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (active: boolean) =>
    cn(
      "relative rounded-lg px-2.5 py-2 text-[0.8125rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
      inverted
        ? active
          ? "bg-white/15 text-white after:absolute after:bottom-0.5 after:left-2.5 after:right-2.5 after:h-0.5 after:rounded-full after:bg-[#F28C28]"
          : "text-white/85 hover:bg-white/10 hover:text-white"
        : active
          ? "bg-[#F28C28]/10 text-[#173A8A] after:absolute after:bottom-0.5 after:left-2.5 after:right-2.5 after:h-0.5 after:rounded-full after:bg-[#F28C28]"
          : "text-slate-600 hover:bg-[#F5F7FA] hover:text-[#173A8A]",
      !inverted && "focus-visible:ring-offset-2",
    );

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAll]);

  return (
    <>
      <header
        ref={headerRef}
        data-public-header
        data-scrolled={scrolled ? "true" : "false"}
        data-inverted={inverted ? "true" : "false"}
        className={cn(
          "fixed inset-x-0 top-0 w-full max-w-[100vw] overflow-x-clip transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
          menuOpen ? "z-[80]" : "z-50",
          inverted
            ? "border-b border-white/10 bg-transparent"
            : scrolled
              ? "border-b border-slate-200/70 bg-white/85 shadow-[0_4px_28px_rgba(11,31,77,0.1)] backdrop-blur-xl"
              : "border-b border-slate-200/50 bg-white/95 shadow-[0_1px_20px_rgba(11,31,77,0.05)] backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 transition-[height] duration-300 min-[360px]:gap-2 min-[360px]:px-4 sm:gap-3 sm:px-6 lg:px-8",
            scrolled ? "h-14 sm:h-[3.75rem]" : "h-[3.75rem] sm:h-16",
          )}
        >
          <HeaderBrandLogo
            scrolled={scrolled}
            inverted={inverted}
            onNavigate={closeAll}
          />

          <nav
            className="hidden items-center gap-0.5 xl:gap-1 lg:flex"
            aria-label="Hoofdnavigatie"
          >
            {simpleNavLinks
              .filter((link) => link.href === "/")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(isLinkActive(link.href))}
                >
                  {link.label}
                </Link>
              ))}

            {navDropdowns.map((config) => (
              <HeaderDropdown
                key={config.id}
                config={config}
                isOpen={openDropdown === config.id}
                active={isDropdownActive(config.href)}
                inverted={inverted}
                onOpen={() => setOpenDropdown(config.id)}
                onClose={() => setOpenDropdown(null)}
                onToggle={() =>
                  setOpenDropdown((current) =>
                    current === config.id ? null : config.id,
                  )
                }
                triggerClassName={navLinkClass}
              />
            ))}

            {simpleNavLinks
              .filter((link) => link.href !== "/" && link.href !== "/login")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(isLinkActive(link.href))}
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          <div className="relative z-[70] flex min-w-0 shrink-0 items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5">
            <a
              href={`tel:${contactPhoneTel}`}
              aria-label={`Bel ${contactPhoneDisplay}`}
              className={cn(
                "hidden h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:inline-flex",
                inverted
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-slate-200/80 text-[#173A8A] hover:border-slate-300 hover:bg-[#F5F7FA]",
              )}
            >
              <svg
                className="h-[1.125rem] w-[1.125rem]"
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
            </a>
            <a
              href={contactWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={cn(
                "hidden h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:inline-flex",
                inverted
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-slate-200/80 text-[#173A8A] hover:border-slate-300 hover:bg-[#F5F7FA]",
              )}
            >
              <svg
                className="h-[1.125rem] w-[1.125rem]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
            <Link
              href="/login"
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 md:inline-flex",
                inverted
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-[#173A8A] hover:bg-[#F5F7FA] hover:text-[#0B1F4D]",
                isLinkActive("/login") &&
                  (inverted
                    ? "bg-white/15 text-white"
                    : "bg-[#F28C28]/10 text-[#173A8A]"),
              )}
            >
              Login
            </Link>
            <a
              href={openApplyMailto}
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 lg:inline-flex",
                inverted
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-[#173A8A] hover:bg-[#F5F7FA] hover:text-[#0B1F4D]",
              )}
            >
              Crew aanmelden
            </a>
            <Link
              href="/contact"
              className="inline-flex h-11 min-h-11 shrink-0 items-center justify-center rounded-full bg-[#F28C28] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:scale-[1.03] hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 min-[360px]:px-3.5 sm:px-5 sm:text-sm"
            >
              <span className="sm:hidden">Aanvragen</span>
              <span className="hidden sm:inline">Personeel aanvragen</span>
            </Link>

            <button
              type="button"
              className={cn(
                "inline-flex h-11 min-h-11 w-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 lg:hidden",
                inverted
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-slate-200/80 text-[#173A8A] hover:border-slate-300 hover:bg-[#F5F7FA]",
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
              onClick={() => {
                setMenuOpen((open) => {
                  const next = !open;
                  if (next && pathname === "/" && !mobileAccordion) {
                    setMobileAccordion("diensten");
                  }
                  return next;
                });
              }}
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

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-transparent"
          aria-hidden="true"
        >
          <div
            className="h-full origin-left bg-[#F28C28] transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        pathname={pathname}
        accordion={mobileAccordion}
        onAccordionChange={setMobileAccordion}
        onClose={closeAll}
      />
    </>
  );
}

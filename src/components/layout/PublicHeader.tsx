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
  navDropdowns,
  simpleNavLinks,
  type NavDropdownConfig,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DropdownId = NavDropdownConfig["id"] | null;

export default function PublicHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { scrolled, progress } = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownId>(null);

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
          "fixed inset-x-0 top-0 w-full max-w-[100vw] transition-[background-color,box-shadow,border-color,backdrop-filter,height] duration-300",
          menuOpen ? "z-[80]" : "z-50",
          inverted
            ? "border-b border-white/10 bg-transparent"
            : scrolled
              ? "border-b border-slate-200/80 bg-white/90 shadow-[0_4px_24px_rgba(11,31,77,0.08)] backdrop-blur-md"
              : "border-b border-slate-200/50 bg-white/95 shadow-[0_1px_20px_rgba(11,31,77,0.05)] backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 transition-[height] duration-300 sm:gap-3 sm:px-6 lg:px-8",
            scrolled ? "h-14 sm:h-16" : "h-[4.5rem] sm:h-20",
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

          <div className="relative z-[70] flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/login"
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:inline-flex",
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
            <Link
              href="/vacatures"
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 lg:inline-flex",
                inverted
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-[#173A8A] hover:bg-[#F5F7FA] hover:text-[#0B1F4D]",
              )}
            >
              Crew aanmelden
            </Link>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F28C28] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:scale-[1.03] hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:px-5 sm:py-2.5 sm:text-sm"
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeaderBrandLogo } from "@/components/BrandLogo";
import {
  contactEmail,
  navDropdowns,
  simpleNavLinks,
  type NavDropdownConfig,
} from "@/lib/navigation";

type DropdownId = NavDropdownConfig["id"] | null;

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DropdownCard({
  title,
  description,
  href,
  onNavigate,
}: {
  title: string;
  description: string;
  href: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group block rounded-xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-[#F28C28]/5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
    >
      <p className="font-bold text-[#101828] transition group-hover:text-[#F28C28]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownId>(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
  }, []);

  const isDropdownActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (active: boolean) =>
    `relative rounded-lg px-2.5 py-2 text-[0.8125rem] font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
      active
        ? "bg-[#F28C28]/10 text-[#173A8A] after:absolute after:bottom-0.5 after:left-2.5 after:right-2.5 after:h-0.5 after:rounded-full after:bg-[#F28C28]"
        : "text-slate-600 hover:bg-[#F5F7FA] hover:text-[#173A8A]"
    }`;

  const toggleDropdown = (id: DropdownId) => {
    setOpenDropdown((current) => (current === id ? null : id));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const renderDesktopDropdown = (config: NavDropdownConfig) => {
    const isMega = config.id === "diensten";
    const isOpen = openDropdown === config.id;
    const active = isDropdownActive(config.href);

    return (
      <div
        key={config.id}
        className="relative"
        onMouseEnter={() => setOpenDropdown(config.id)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          type="button"
          id={`nav-${config.id}-button`}
          aria-expanded={isOpen}
          aria-controls={`nav-${config.id}-panel`}
          aria-haspopup="true"
          onClick={() => toggleDropdown(config.id)}
          className={`inline-flex cursor-pointer items-center gap-1 ${navLinkClass(active)}`}
        >
          {config.label}
          <ChevronDown open={isOpen} />
        </button>

        {isOpen && (
          <div
            id={`nav-${config.id}-panel`}
            role="region"
            aria-labelledby={`nav-${config.id}-button`}
            className={`absolute top-full z-50 pt-3 ${
              isMega ? "left-1/2 w-[min(100vw-2rem,56rem)] -translate-x-1/2" : "left-0 w-80"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-[#0B1F4D]/10">
              <div className={`p-5 ${isMega ? "sm:p-6" : ""}`}>
                <div className={isMega ? "mb-5 max-w-2xl" : "mb-4"}>
                  <p className="text-base font-black text-[#173A8A]">
                    {config.panelTitle}
                  </p>
                  {config.panelDescription && (
                    <p className="mt-1 text-sm text-slate-600">
                      {config.panelDescription}
                    </p>
                  )}
                </div>

                <div
                  className={
                    isMega
                      ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid gap-2"
                  }
                >
                  {config.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      {...item}
                      onNavigate={() => setOpenDropdown(null)}
                    />
                  ))}
                </div>

                {config.cta && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <Link
                      href={config.cta.href}
                      onClick={() => setOpenDropdown(null)}
                      className="inline-flex rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
                    >
                      {config.cta.label}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 w-full transition-all duration-300 ${
          menuOpen ? "z-[80]" : "z-50"
        } ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/90 shadow-[0_4px_24px_rgba(11,31,77,0.08)] backdrop-blur-md"
            : "border-b border-slate-200/50 bg-white/95 shadow-[0_1px_20px_rgba(11,31,77,0.05)] backdrop-blur-sm"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <HeaderBrandLogo scrolled={scrolled} onNavigate={closeAll} />

          <nav
            className="hidden items-center gap-1 lg:flex"
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

            {navDropdowns.map(renderDesktopDropdown)}

            {simpleNavLinks
              .filter((link) => link.href !== "/")
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

          <div className="relative z-[70] flex items-center gap-2 sm:gap-3">
            <Link
              href="/vacatures"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#173A8A] transition hover:bg-[#F5F7FA] hover:text-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 lg:inline-flex"
            >
              Crew aanmelden
            </Link>
            <Link
              href="/contact"
              className="hidden rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:scale-[1.03] hover:bg-[#de7c1f] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 lg:inline-flex"
            >
              Personeel aanvragen
            </Link>

            <button
              type="button"
              className="inline-flex h-11 min-h-11 w-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 text-[#173A8A] transition hover:border-slate-300 hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 lg:hidden"
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
      </header>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Menu sluiten"
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={closeAll}
          />

          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobiel menu"
            className="fixed right-0 top-0 z-[70] flex h-dvh w-[min(85vw,24rem)] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
              <Link
                href="/"
                onClick={closeAll}
                className="inline-flex max-w-[190px] items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
              >
                <span className="text-base font-extrabold tracking-tight text-[#173A8A]">
                  Helping Hands
                </span>
              </Link>
              <button
                type="button"
                aria-label="Menu sluiten"
                className="inline-flex h-11 min-h-11 w-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
                onClick={closeAll}
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
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-2"
              aria-label="Mobiele navigatie"
            >
              <Link
                href="/"
                onClick={closeAll}
                className={`block border-b border-slate-100 px-2 py-3.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
                  isLinkActive("/")
                    ? "bg-[#173A8A]/5 text-[#173A8A]"
                    : "text-[#101828] hover:bg-[#F5F7FA]"
                }`}
              >
                Home
              </Link>

              {navDropdowns.map((config) => {
                const expanded = mobileAccordion === config.id;
                return (
                  <div key={config.id} className="border-b border-slate-100">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-${config.id}-panel`}
                      onClick={() =>
                        setMobileAccordion((current) =>
                          current === config.id ? null : config.id,
                        )
                      }
                      className="flex w-full cursor-pointer items-center justify-between px-2 py-3.5 text-left text-base font-semibold text-[#101828] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
                    >
                      <span
                        className={
                          isDropdownActive(config.href)
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
                            onClick={closeAll}
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
                            onClick={closeAll}
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
                    onClick={closeAll}
                    className={`block border-b border-slate-100 px-2 py-3.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
                      isLinkActive(link.href)
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
                onClick={closeAll}
                className="flex w-full items-center justify-center rounded-full bg-[#F28C28] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#F28C28]/30 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
              >
                Personeel aanvragen
              </Link>
              <Link
                href="/vacatures"
                onClick={closeAll}
                className="flex w-full items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-5 py-3.5 text-base font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
              >
                Crew aanmelden
              </Link>
              <Link
                href="/login"
                onClick={closeAll}
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
      ) : null}
    </>
  );
}

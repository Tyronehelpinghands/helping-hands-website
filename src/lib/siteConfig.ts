export const siteConfig = {
  name: "Helping Hands Agency",
  shortName: "Helping Hands",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://helpinghandsagency.nl",
  email: "info@helpinghandsagency.nl" as string,
  applicationsEmail: "aanmeldingen@helpinghandsagency.nl" as string,
  phone: "" as string,
  locale: "nl_NL",
  defaultOgImage: "/images/brand/helping-hands-logo.png",
  description:
    "Helping Hands Agency levert eventcrew, stagehands, horeca support en productieondersteuning voor festivals, stadions, beurzen, concerten en horecalocaties.",
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

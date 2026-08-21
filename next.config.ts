import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prefer /contact over /contact/ (Next default); consistent non-trailing URLs.
  trailingSlash: false,
  async rewrites() {
    // GSC often submits /sitemap or /sitemap.txt → those hit (seo-local)/[slug] and 404.
    // Serve the real XML with 200 so Google does not need a redirect hop.
    return {
      beforeFiles: [
        { source: "/sitemap", destination: "/sitemap.xml" },
        { source: "/sitemap.txt", destination: "/sitemap.xml" },
      ],
    };
  },
  async redirects() {
    return [
      // Legacy WordPress-ish / marketing aliases
      { source: "/medewerkers", destination: "/werken-bij", permanent: true },
      { source: "/crew-aanmelden", destination: "/werken-bij", permanent: true },
      { source: "/sign-up", destination: "/werken-bij", permanent: true },
      { source: "/about-us", destination: "/over-ons", permanent: true },
      { source: "/privacy-policy", destination: "/contact", permanent: true },
      { source: "/rigger", destination: "/personeel-inhuren/stagehands", permanent: true },
      {
        source: "/catering-assistant",
        destination: "/personeel-inhuren/catering-personeel",
        permanent: true,
      },
      {
        source: "/hospitality-assistant",
        destination: "/personeel-inhuren/hospitality-personeel",
        permanent: true,
      },
      {
        source: "/site-crew",
        destination: "/personeel-inhuren/site-crew",
        permanent: true,
      },
      // No English site — strip /en to Dutch homepage
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/", permanent: true },
      // Gone WordPress media / PHP / feed / archive leftovers (GSC 404s)
      { source: "/feed", destination: "/", permanent: true },
      { source: "/feed/:path*", destination: "/", permanent: true },
      { source: "/rss", destination: "/", permanent: true },
      { source: "/rss.xml", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      { source: "/comments/feed/:path*", destination: "/", permanent: true },
      { source: "/xmlrpc.php", destination: "/", permanent: true },
      { source: "/wp-login.php", destination: "/", permanent: true },
      { source: "/wp-admin", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-json", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },
      { source: "/wp-json/:path*", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/page/:path*", destination: "/", permanent: true },
      { source: "/privacy", destination: "/contact", permanent: true },

      // Consolidate overlapping diensten landings → personeel-inhuren
      {
        source: "/diensten/event-crew",
        destination: "/personeel-inhuren/event-crew",
        permanent: true,
      },
      {
        source: "/diensten/stagehands",
        destination: "/personeel-inhuren/stagehands",
        permanent: true,
      },
      {
        source: "/diensten/horeca-personeel",
        destination: "/personeel-inhuren/horeca-personeel",
        permanent: true,
      },
      {
        source: "/diensten/barpersoneel",
        destination: "/personeel-inhuren/barpersoneel",
        permanent: true,
      },
      {
        source: "/diensten/keukenpersoneel",
        destination: "/personeel-inhuren/keukenhulp",
        permanent: true,
      },
      {
        source: "/diensten/productie-assistentie",
        destination: "/personeel-inhuren/productie-assistenten",
        permanent: true,
      },
      {
        source: "/diensten/logistiek",
        destination: "/personeel-inhuren/logistiek-personeel",
        permanent: true,
      },
      {
        source: "/diensten/hospitality",
        destination: "/personeel-inhuren/hospitality-personeel",
        permanent: true,
      },

      // Overlapping /locaties/* → canonical root SEO URLs (avoid thin duplicates)
      {
        source: "/locaties/event-crew-amsterdam",
        destination: "/event-crew-amsterdam",
        permanent: true,
      },
      {
        source: "/locaties/event-crew-utrecht",
        destination: "/event-crew-utrecht",
        permanent: true,
      },
      {
        source: "/locaties/event-crew-rotterdam",
        destination: "/event-crew-rotterdam",
        permanent: true,
      },
      {
        source: "/locaties/event-crew-den-haag",
        destination: "/event-crew-den-haag",
        permanent: true,
      },
      {
        source: "/locaties/event-crew-hilversum",
        destination: "/event-crew-hilversum",
        permanent: true,
      },
      {
        source: "/locaties/stagehands-amsterdam",
        destination: "/stagehands-amsterdam",
        permanent: true,
      },
      {
        source: "/locaties/stagehands-utrecht",
        destination: "/stagehands-utrecht",
        permanent: true,
      },
      {
        source: "/locaties/stagehands-arnhem",
        destination: "/stagehands-arnhem",
        permanent: true,
      },
      {
        source: "/locaties/horeca-personeel-hilversum",
        destination: "/horeca-personeel-hilversum",
        permanent: true,
      },
      {
        source: "/locaties/horeca-personeel-amsterdam",
        destination: "/horeca-personeel-amsterdam",
        permanent: true,
      },
      {
        source: "/locaties/horeca-personeel-utrecht",
        destination: "/horeca-personeel-utrecht",
        permanent: true,
      },
      {
        source: "/locaties/festival-crew-rotterdam",
        destination: "/event-crew-rotterdam",
        permanent: true,
      },
      {
        source: "/locaties/eventpersoneel-den-haag",
        destination: "/event-crew-den-haag",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy WordPress-ish / marketing aliases
      { source: "/medewerkers", destination: "/werken-bij", permanent: true },
      { source: "/crew-aanmelden", destination: "/werken-bij", permanent: true },

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

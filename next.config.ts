import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

// Domaine de l'API, lu dans .env.local (ex. https://app-ceedd-api.onrender.com)
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").origin;
  } catch {
    return "";
  }
})();
const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy : liste blanche des domaines d'où la page a le droit
// de charger du code, des images ou d'envoyer des requêtes. Si une faille XSS
// injecte un script venant d'ailleurs, ou essaie d'envoyer le jeton vers un
// autre serveur, le navigateur le bloque.
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' : nécessaire aux scripts inline de Next.js (hydratation).
  // 'unsafe-eval' : uniquement en dev (rechargement à chaud).
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'", // Tailwind / Leaflet posent des styles inline
  // images : Cloudinary, tuiles OpenStreetMap / ArcGIS, icônes Leaflet (unpkg), GA
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://server.arcgisonline.com https://unpkg.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  // requêtes fetch/axios : l'API, l'upload Cloudinary, Google Analytics
  `connect-src 'self' ${apiOrigin} https://api.cloudinary.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${isDev ? "ws: http://localhost:8000" : ""}`,
  "frame-ancestors 'none'", // interdit d'afficher le site dans une iframe (clickjacking)
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .replace(/\s{2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" }, // anciens navigateurs sans CSP
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // n'annonce pas "X-Powered-By: Next.js" aux attaquants
  poweredByHeader: false,
  async headers() {
    // appliqué à toutes les pages
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

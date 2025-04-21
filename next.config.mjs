/**
 * @type {import('next').NextConfig}
 *
 * Full ESM config that works with Next 14 (App Router) and next‑pwa v6+.
 * – Place the file at the project root as “next.config.mjs”
 * – No other service‑worker code is required.
 */
import nextPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const isProd = process.env.NODE_ENV === "production";

/* ------------------------------------------------------------------ */
/* 1.  Create the higher‑order function that injects the PWA settings */
/* ------------------------------------------------------------------ */
const withPWA = nextPWA({
  dest: "public", // Service worker & precache manifest will be output here
  register: true, // Inject “/register-sw.js” script automatically
  skipWaiting: true, // SW takes control as soon as it’s installed
  disable: !isProd, // Turn off SW during `next dev` (hot‑reload friendly)
  runtimeCaching, // Sensible default cache rules (you can override)
  // fallback: { document: '/offline.html' }  // Add if you created an offline page
});

/* ------------------------------- */
/* 2.  Normal Next.js config here  */
/* ------------------------------- */
const nextConfig = {
  reactStrictMode: true, // Optional; true by default in App Router
  experimental: {
    appDir: true, // App Router already enabled in 14, but explicit is ok
  },
  // images: { domains: ['images.example.com'] },  // Example of more Next options
  // basePath: '/recipes',                         // etc.
};

/* --------------------------------- */
/* 3.  Export the wrapped config     */
/* --------------------------------- */
export default withPWA(nextConfig);

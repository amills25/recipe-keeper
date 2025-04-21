import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js"; // predefined sensible defaults

const isDev = process.env.NODE_ENV === "development";

export default withPWA({
  // Next.js settings
  reactStrictMode: true,
  // PWA settings
  pwa: {
    dest: "public", // service‑worker & *.js in /public
    register: true, // inject sw registration script
    skipWaiting: true, // SW takes control asap
    disable: isDev, // turn off SW in next dev server
    runtimeCaching, // see https://github.com/shadowwalker/next-pwa#runtimecaching
    // fallback: { document: '/offline.html' } // optional offline page
  },
});

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Auth-gated CRUD app — request-time cookies/DB access on most routes.
  // Cache Components / partial prefetching add build friction without payoff here.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

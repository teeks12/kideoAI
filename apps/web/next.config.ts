import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: [
    "@kideo/ui",
    "@kideo/api",
    "@kideo/db",
    "@kideo/domain",
    "@kideo/validators",
  ],
  experimental: {
    optimizePackageImports: ["@kideo/ui", "lucide-react"],
    outputFileTracingIncludes: {
      "/api/**/*": [
        "../../node_modules/.pnpm/node_modules/.prisma/client/**/*",
        "../../node_modules/.pnpm/node_modules/@prisma/client/**/*",
      ],
    },
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [{ source: "/practice-chinese", destination: "/practice-chinese/index.html" }];
  },
  experimental: {
    // better-sqlite3 is a native module; bundling it breaks the binding lookup.
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;

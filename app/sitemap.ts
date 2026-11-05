import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-config";

const sitemap = (): MetadataRoute.Sitemap => {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/csca", priority: 0.9 },
    { path: "/chinese", priority: 0.9 },
    { path: "/universities", priority: 0.9 },
    { path: "/ai-advisor", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/pricing", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
};

export default sitemap;

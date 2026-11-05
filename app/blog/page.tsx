import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { posts } from "@/lib/blog/posts";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Guides to studying in China",
  description:
    "Straight answers about studying in China from Bangladesh — the application process, the documents you need, and how scholarships actually work.",
  alternates: { canonical: "/blog" },
};

const BlogIndexPage = () => (
  <div className="flex min-h-dvh flex-col">
    <SiteHeader />

    <main className="flex-1 px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-5xl">
            Guides
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Straight answers about studying in China, written for students applying from
            Bangladesh. No inflated numbers, no promises we can&apos;t keep.
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-border bg-card p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold leading-tight text-secondary lg:text-2xl">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary-text">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{post.description}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" /> {post.readingMinutes} min read
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default BlogIndexPage;

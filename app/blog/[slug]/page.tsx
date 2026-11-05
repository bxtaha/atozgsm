import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { getPost, posts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-config";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export const generateMetadata = ({ params }: { params: { slug: string } }): Metadata => {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  };
};

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    author: { "@type": "Organization", name: "ATOZ GSM", url: SITE_URL },
    publisher: { "@type": "Organization", name: "ATOZ GSM", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  // Gives assistants and search engines an explicit question/answer pair, which
  // is how this content gets surfaced when a student asks the question directly.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: post.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: post.body
            .filter((b): b is { type: "p"; text: string } => b.type === "p")
            .slice(0, 2)
            .map((b) => b.text)
            .join(" "),
        },
      },
    ],
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <main className="flex-1 px-4 py-12">
        <article className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary-text"
          >
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>

          <header className="mb-10">
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-secondary lg:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3 w-3" /> {post.readingMinutes} min read · Updated {post.updated}
            </p>
          </header>

          <div className="space-y-6">
            {post.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="pt-4 font-display text-2xl font-bold text-secondary">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-foreground">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "note") {
                return (
                  <aside key={i} className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" />
                    <p className="text-sm leading-relaxed text-foreground">{block.text}</p>
                  </aside>
                );
              }
              return (
                <p key={i} className="text-lg leading-relaxed text-foreground">
                  {block.text}
                </p>
              );
            })}
          </div>

          <section className="mt-14 rounded-3xl bg-secondary p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-secondary-foreground">
              Want this checked against your own case?
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-secondary-foreground/80">
              Tell our advisor your results and budget, or talk to a counsellor in Dhaka.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/ai-advisor"
                className="rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
              >
                Ask the advisor
              </Link>
              <Link
                href="/#apply"
                className="rounded-full border border-secondary-foreground/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-secondary-foreground/80 transition-colors hover:text-secondary-foreground"
              >
                Book free counselling
              </Link>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
};

export default BlogPostPage;

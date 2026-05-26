import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { getProjectBySlug } from "@/lib/projects.functions";

const projectQO = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(projectQO(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const p = loaderData;
    if (!p) return { meta: [{ title: "Project not found" }] };
    return {
      meta: [
        { title: `${p.title} — AI/ML Portfolio` },
        { name: "description", content: p.tagline || p.title },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.tagline || p.title },
        ...(p.media_url && p.media_type !== "mp4" ? [{ property: "og:image", content: p.media_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl">Project not found</h1>
      <Link to="/" className="mt-6 inline-block text-primary underline">Back to portfolio</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Couldn't load this project</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectQO(slug));
  const p = data!;

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 md:py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        ← All projects
      </Link>

      <header className="mt-6">
        <h1 className="font-serif text-4xl leading-[1.05] md:text-5xl">{p.title}</h1>
        {p.tagline && <p className="mt-3 text-lg text-muted-foreground">{p.tagline}</p>}
        {p.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {p.media_url && (
        <div className="mt-8 overflow-hidden rounded-2xl border bg-muted">
          {p.media_type === "mp4" ? (
            <video src={p.media_url} poster={p.poster_url ?? undefined} controls autoPlay muted loop playsInline className="w-full" />
          ) : (
            <img src={p.media_url} alt={p.title} className="w-full" />
          )}
        </div>
      )}

      {p.metrics.length > 0 && (
        <section className="mt-10">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Outcomes</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-5 sm:grid-cols-3">
            {p.metrics.map((m) => {
              const v = m.value.trim();
              const isPos = v.startsWith("+");
              const isNeg = v.startsWith("-") || v.startsWith("−");
              const tone = isPos ? "text-primary" : isNeg ? "text-secondary" : "text-foreground";
              return (
                <div key={m.label}>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{m.label}</dt>
                  <dd className={`mt-1.5 font-serif text-3xl leading-none tabular-nums ${tone}`}>{m.value}</dd>
                </div>
              );
            })}
          </dl>
        </section>
      )}

      {p.description && (
        <div className="prose-portfolio mt-10 max-w-none">
          <ReactMarkdown>{p.description}</ReactMarkdown>
        </div>
      )}

      {p.links.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

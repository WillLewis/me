import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listProjects, type Project } from "@/lib/projects.functions";

const projectsQO = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI/ML Product Portfolio" },
      { name: "description", content: "Selected work in AI/ML product — LLMs, RAG, agents, vision, evals, and fine-tuning." },
      { property: "og:title", content: "AI/ML Product Portfolio" },
      { property: "og:description", content: "Selected work in AI/ML product." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQO),
  component: IndexPage,
});

function IndexPage() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const [active, setActive] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-lg leading-none">Portfolio</span>
          <span className="text-muted-foreground">AI / ML Product Manager</span>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground">
          <a href="#work" className="hover:text-foreground">Work</a>
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
          <a href="#contact" className="text-foreground hover:text-primary">Get in touch ↗</a>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl border-t px-6" />

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Available Q3 2026
          </span>
          <span>·</span>
          <span>AI / ML Product Manager</span>
          <span>·</span>
          <span>Remote · NYC</span>
        </div>

        <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight md:text-7xl">
          Shipping <em className="text-primary">applied ML</em>
          <br />
          that earns its compute.
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr]">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            I run zero-to-one and scale phases for <em className="not-italic text-foreground">LLM, retrieval, and agent</em> products —
            owning eval design, model choice, latency-cost tradeoffs, and the
            boring infra debates that decide whether a feature actually lands.
          </p>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
            <Stat label="Tenure" value="8" unit="years" caption="PM since 2018 · ML focus since 2021" />
            <Stat label="Surfaces shipped" value="24" caption="B2B, devtools, consumer AI" />
            <Stat label="Scale touched" value="3.1" unit="b req / mo" caption="Across inference + retrieval" />
            <Stat label="Open to" value="NYC · SF · Remote" small caption="Senior PM and Group PM roles" />
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-6xl border-t px-6" />

      {/* Selected work */}
      <main id="work" className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Selected work · 2022 — 2026
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              {filtered.length === projects.length ? "Selected" : "Filtered"} projects,
              <em className="text-primary"> picked for what they taught me.</em>
            </h2>
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <FilterChip label="All" count={projects.length} active={active === null} onClick={() => setActive(null)} />
              {allTags.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  active={active === t}
                  onClick={() => setActive(active === t ? null : t)}
                />
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No projects match that tag.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* About + contact */}
      <div className="mx-auto max-w-6xl border-t px-6" />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div id="about">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">About</p>
          <p className="mt-4 leading-relaxed">
            <strong className="text-foreground">AI/ML product manager</strong> based in Brooklyn. Previously founding PM
            on the agent platform at an LLM lab, and earlier search PM at a developer tools company.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            I work best on teams that take eval seriously and treat unit economics as a first-class product surface.
            I write working docs, not vision decks. Available for senior PM and Group PM roles starting <em className="not-italic text-foreground">Q3 2026</em>.
          </p>
        </div>
        <div id="contact">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contact</p>
          <dl className="mt-4 divide-y border-y text-sm">
            <ContactRow label="Email" value="hello@portfolio.work" />
            <ContactRow label="LinkedIn" value="/in/handle" />
            <ContactRow label="GitHub" value="@handle" />
            <ContactRow label="Résumé · PDF" value="Download ↓" href="/resume.pdf" download />
          </dl>
          <Link to="/admin" className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
            Admin →
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t px-6 py-6 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        <span>© 2026 Portfolio</span>
        <span>build 2026.05</span>
      </footer>
    </div>
  );
}

function Stat({ label, value, unit, caption, small }: { label: string; value: string; unit?: string; caption?: string; small?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className={`mt-1.5 font-serif ${small ? "text-2xl" : "text-4xl"} leading-none`}>
        {value}
        {unit && <span className="ml-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">{unit}</span>}
      </dd>
      {caption && <p className="mt-2 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

function ContactRow({ label, value, href, download }: { label: string; value: string; href?: string; download?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd>
        {href ? (
          <a href={href} download={download} className="hover:text-primary">{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:border-foreground/40"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={active ? "text-background/70" : "text-muted-foreground"}>{count}</span>
      )}
    </button>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const cornerLabel = p.tagline ? p.tagline.toUpperCase() : `PROJECT ${String(index + 1).padStart(2, "0")}`;

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition hover:border-foreground/30 hover:shadow-[0_12px_40px_-18px_rgba(0,0,0,0.18)]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Media area with graph-paper feel */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b bg-muted"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {p.media_url ? (
          p.media_type === "mp4" ? (
            <video
              src={p.media_url}
              poster={p.poster_url ?? undefined}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              ref={(el) => {
                if (!el) return;
                if (hover) void el.play().catch(() => {});
                else el.pause();
              }}
            />
          ) : p.media_type === "gif" ? (
            <img
              src={hover || !p.poster_url ? p.media_url : p.poster_url}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <img
              src={p.media_url}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          )
        ) : null}

        {/* Corner label */}
        <div className="absolute left-3 top-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80 mix-blend-multiply">
          {cornerLabel.slice(0, 36)}
        </div>

        {/* Bottom-left tag chips */}
        {p.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 2).map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                  i === 0
                    ? "bg-foreground text-background"
                    : "border border-border bg-background/80 text-foreground backdrop-blur"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{p.tags[0] ?? "Project"}</span>
          <span>2024 — 2026</span>
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h3>
        {p.tagline && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>}

        {p.metrics.length > 0 && (
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t pt-4">
            {p.metrics.slice(0, 3).map((m) => {
              const isNeg = m.value.trim().startsWith("-") || m.value.trim().startsWith("−");
              const isPos = m.value.trim().startsWith("+");
              const tone = isPos ? "text-primary" : isNeg ? "text-secondary" : "text-foreground";
              return (
                <div key={m.label}>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {m.label}
                  </dt>
                  <dd className={`mt-1 font-serif text-xl leading-none tabular-nums ${tone}`}>
                    {m.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}

        <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Shipped
          </span>
          <span className="text-foreground underline-offset-4 group-hover:underline">
            Case study →
          </span>
        </div>
      </div>
    </Link>
  );
}

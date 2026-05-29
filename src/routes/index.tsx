import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listProjects, type Project } from "@/lib/projects.functions";
import { pageMeta } from "@/lib/metadata";
import { getContactRows, siteConfig } from "@/lib/site-config";

const projectsQO = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/")({
  head: () => pageMeta({ path: "/" }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQO),
  component: IndexPage,
});

function IndexPage() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const [active, setActive] = useState<string | null>(null);
  const contactRows = getContactRows();
  const isPlaceholder = siteConfig.placeholderContent;

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-lg leading-none">{siteConfig.shortTitle}</span>
          <span className="hidden text-muted-foreground sm:inline">{siteConfig.role}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground sm:gap-x-6">
          <a href="#work" className="hover:text-foreground">
            Work
          </a>
          <a href="#about" className="hover:text-foreground">
            About
          </a>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
          <a href="#contact" className="hidden text-foreground hover:text-primary sm:inline">
            Get in touch ↗
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl border-t px-6" />

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 md:pt-24">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            {isPlaceholder ? "Draft content" : siteConfig.availability}
          </span>
          <span>·</span>
          <span>{siteConfig.role}</span>
          <span>·</span>
          <span>{isPlaceholder ? "Replace before sharing" : siteConfig.location}</span>
        </div>

        <h1 className="mt-6 font-serif text-3xl leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
          {isPlaceholder ? (
            <>
              Portfolio draft for
              <br />
              <em className="text-primary">verified work.</em>
            </>
          ) : (
            <>
              Shipping <em className="text-primary">applied ML</em>
              <br />
              that earns its compute.
            </>
          )}
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr]">
          {isPlaceholder ? (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              This portfolio shell is wired to the CMS and seeded with neutral placeholder case
              studies. Replace the sample copy with verified roles, projects, links, and outcomes
              before broad sharing.
            </p>
          ) : (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I run zero-to-one and scale phases for{" "}
              <em className="not-italic text-foreground">
                agentic AI, LLM/RAG, and ML decisioning
              </em>{" "}
              products — owning eval design, model choice, fraud-operations constraints, and the
              regulated workflow details that decide whether a feature actually lands.
            </p>
          )}

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
            {isPlaceholder ? (
              <>
                <Stat label="Content" value="Draft" small caption="No real claims shown" />
                <Stat
                  label="Slots"
                  value={String(projects.length)}
                  caption="CMS-backed placeholders"
                />
                <Stat label="Proof" value="None" small caption="Add verified outcomes later" />
                <Stat label="Next" value="Replace" small caption="Use the admin CMS" />
              </>
            ) : (
              <>
                <Stat
                  label="Tenure"
                  value="8+"
                  unit="years"
                  caption="PM since 2018 · ML focus since 2021"
                />
                <Stat
                  label="Workflow scale"
                  value="1M"
                  unit="/ mo"
                  caption="Fraud + operations reviews"
                />
                <Stat
                  label="Product scope"
                  value="AI/ML"
                  small
                  caption="Agents, RAG, evals, and vision"
                />
                <Stat
                  label="Open to"
                  value={siteConfig.openTo}
                  small
                  caption={siteConfig.openToCaption}
                />
              </>
            )}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-6xl border-t px-6" />

      {/* Selected work */}
      <main id="work" className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {isPlaceholder
                ? "Placeholder work · content not final"
                : "Selected work · 2017 — 2026"}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              {isPlaceholder ? (
                <>
                  Sample project cards,
                  <em className="text-primary"> ready for real case studies.</em>
                </>
              ) : (
                <>
                  {filtered.length === projects.length
                    ? `${projectCountLabel(projects.length)} projects,`
                    : "Filtered projects,"}
                  <em className="text-primary"> picked for what they taught me.</em>
                </>
              )}
            </h2>
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                label="All"
                count={projects.length}
                active={active === null}
                onClick={() => setActive(null)}
              />
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
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div id="about">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">About</p>
          {isPlaceholder ? (
            <>
              <p className="mt-4 leading-relaxed">
                <strong className="text-foreground">Draft about section.</strong> Replace this copy
                with a concise summary of your actual role, domain focus, and location preferences.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Keep this section grounded in verified experience. Avoid inflated metrics or company
                references until you are ready to publish the final portfolio.
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 leading-relaxed">
                <strong className="text-foreground">Will Lewis</strong> is an AI/ML product manager
                based in {siteConfig.aboutLocation}. Currently Product Manager, AI at Capital One;
                previously Product Manager at WebMocha and Head of Product at REUP.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Wharton MBA, University of Pennsylvania economics, and hands-on product work across
                regulated fintech, enterprise AI, and marketplace ML. I work best on teams that take
                evals seriously and treat unit economics as a first-class product surface. Available
                for senior PM and Group PM roles; timing{" "}
                <em className="not-italic text-foreground">{siteConfig.aboutAvailability}</em>.
              </p>
            </>
          )}
        </div>
        <div id="contact">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contact</p>
          <dl className="mt-4 divide-y border-y text-sm">
            {contactRows.map((row) => (
              <ContactRow key={row.label} {...row} />
            ))}
          </dl>
          <Link
            to="/admin"
            className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Admin →
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t px-6 py-6 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        <span>© 2026 {siteConfig.shortTitle}</span>
        <span>{siteConfig.buildLabel}</span>
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  caption,
  small,
}: {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  small?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className={`mt-1.5 font-serif ${small ? "text-2xl" : "text-4xl"} leading-none`}>
        {value}
        {unit && (
          <span className="ml-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {unit}
          </span>
        )}
      </dd>
      {caption && <p className="mt-2 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  download,
}: {
  label: string;
  value: string;
  href?: string;
  download?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd>
        {href ? (
          <a href={href} download={download} className="hover:text-primary">
            {value} {download ? "↓" : "↗"}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
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

function projectCountLabel(count: number) {
  const words: Record<number, string> = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
  };
  return words[count] ?? String(count);
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const cornerLabel = getProjectCornerLabel(p, index);

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
        <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80 mix-blend-multiply">
          {cornerLabel}
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
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{p.tags[0] ?? "Project"}</span>
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h3>
        {p.tagline && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
        )}

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
            {siteConfig.placeholderContent ? "Placeholder" : "Shipped"}
          </span>
          <span className="text-foreground underline-offset-4 group-hover:underline">
            {siteConfig.placeholderContent ? "Review slot" : "Case study"} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function getProjectCornerLabel(project: Project, index: number) {
  const labels: Record<string, string> = {
    "capital-one-neurosymbolic-multi-agent-operations-review":
      "Neurosymbolic Multi-Agent Review System",
    "hpe-enterprise-rag-knowledge-search-platform": "Enterprise RAG Hybrid Knowledge Search",
    "stanford-medicine-automated-medical-content-tagging": "Content Tagging Active Learning System",
    "reup-computer-vision-fraud-detection-marketplace-trust":
      "Computer Vision Review Routing Workflow",
    "project-atlas-agentic-fraud-eval-safeguards-lab": "Adversarial Agent Fraud Red/Blue Team",
    "voice-agent-prompt-lab-insurance-fnol-eval-harness": "Voice Agent Prompt Lab",
    "regulated-agent-launch-kit-ai-launch-readiness": "Enterprise Agent Deployment-Readiness Kit",
  };

  return labels[project.slug] ?? `Project ${String(index + 1).padStart(2, "0")}`;
}

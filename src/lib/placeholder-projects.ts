import seed1 from "@/assets/seed-1.jpg";
import seed2 from "@/assets/seed-2.jpg";
import seed3 from "@/assets/seed-3.jpg";
import seed4 from "@/assets/seed-4.jpg";
import seed5 from "@/assets/seed-5.jpg";
import seed6 from "@/assets/seed-6.jpg";
import { siteConfig } from "@/lib/site-config";
import type { Project } from "@/lib/projects.functions";

const placeholderDescription = `## Placeholder notice

This case study is sample content for layout, routing, and CMS QA. It does not describe a real project, employer, customer, model result, shipped feature, or business outcome.

## Replace with

- The real problem and audience.
- Your role, scope, and decisions.
- The constraints, tradeoffs, and implementation path.
- Verified outcomes, links, and screenshots you are comfortable publishing.`;

const placeholderSlots = [
  {
    slug: "rag-knowledge-copilot",
    title: "Placeholder Case Study 01",
    media_url: seed1,
  },
  {
    slug: "agent-workflow-builder",
    title: "Placeholder Case Study 02",
    media_url: seed2,
  },
  {
    slug: "vision-quality-inspector",
    title: "Placeholder Case Study 03",
    media_url: seed3,
  },
  {
    slug: "llm-eval-harness",
    title: "Placeholder Case Study 04",
    media_url: seed4,
  },
  {
    slug: "voice-meeting-summarizer",
    title: "Placeholder Case Study 05",
    media_url: seed5,
  },
  {
    slug: "personalization-bandit",
    title: "Placeholder Case Study 06",
    media_url: seed6,
  },
] as const;

function placeholderProject(slot: (typeof placeholderSlots)[number], index: number): Project {
  return {
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    slug: slot.slug,
    title: slot.title,
    tagline:
      "Demo slot for layout and CMS testing. Replace with a verified project before sharing.",
    description: placeholderDescription,
    tags: ["Placeholder", "CMS", "Draft"],
    media_url: slot.media_url,
    media_type: "image",
    poster_url: null,
    order_index: index,
    metrics: [
      { label: "Content status", value: "Draft" },
      { label: "Claims", value: "None" },
      { label: "Next step", value: "Replace" },
    ],
    links: [],
  };
}

export const placeholderProjects: Project[] = placeholderSlots.map(placeholderProject);

export function getPlaceholderProjectBySlug(slug: string) {
  return placeholderProjects.find((project) => project.slug === slug) ?? null;
}

export function getDisplayProject(project: Project, index = 0): Project {
  if (!siteConfig.placeholderContent) return project;

  const placeholder =
    getPlaceholderProjectBySlug(project.slug) ??
    placeholderProjects[index % placeholderProjects.length];

  return {
    ...project,
    title: placeholder.title,
    tagline: placeholder.tagline,
    description: placeholder.description,
    tags: placeholder.tags,
    metrics: placeholder.metrics,
    links: [],
    media_url: project.media_url ?? placeholder.media_url,
    media_type: project.media_url ? project.media_type : placeholder.media_type,
    poster_url: project.poster_url ?? placeholder.poster_url,
  };
}

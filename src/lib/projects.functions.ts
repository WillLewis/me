import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { supabasePublicServer } from "@/integrations/supabase/client.public.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getPlaceholderProjectBySlug, placeholderProjects } from "@/lib/placeholder-projects";
import { siteConfig } from "@/lib/site-config";
import type { Tables } from "@/integrations/supabase/types";

type ProjectRow = Tables<"projects">;
type ProjectLinkRow = Tables<"project_links">;

export type ProjectLink = {
  id: string;
  label: string;
  url: string;
  kind: "demo" | "writeup" | "repo" | "other";
  order_index: number;
};

export type ProjectMetric = { label: string; value: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  media_url: string | null;
  media_type: "gif" | "mp4" | "image";
  poster_url: string | null;
  order_index: number;
  metrics: ProjectMetric[];
  links: ProjectLink[];
};

function isProjectMetric(value: unknown): value is ProjectMetric {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as { label?: unknown }).label === "string" &&
    typeof (value as { value?: unknown }).value === "string"
  );
}

function mapRow(row: ProjectRow, links: ProjectLinkRow[] = []): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    media_url: row.media_url,
    media_type: row.media_type,
    poster_url: row.poster_url,
    order_index: row.order_index,
    metrics: Array.isArray(row.metrics) ? row.metrics.filter(isProjectMetric) : [],
    links: links
      .filter((l) => l.project_id === row.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((l) => ({
        id: l.id,
        label: l.label,
        url: l.url,
        kind: l.kind,
        order_index: l.order_index,
      })),
  };
}

// Public: list all projects with links
export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  if (siteConfig.placeholderContent) return placeholderProjects;

  const { data: projects, error } = await supabasePublicServer
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const ids = (projects ?? []).map((p) => p.id);
  let links: ProjectLinkRow[] = [];
  if (ids.length) {
    const { data: linkRows, error: linksError } = await supabasePublicServer
      .from("project_links")
      .select("*")
      .in("project_id", ids);
    if (linksError) throw new Error(linksError.message);
    links = linkRows ?? [];
  }

  return (projects ?? []).map((p) => mapRow(p, links));
});

// Public: get one project by slug
export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (siteConfig.placeholderContent) return getPlaceholderProjectBySlug(data.slug);

    const { data: project, error } = await supabasePublicServer
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) return null;
    const { data: links, error: linksError } = await supabasePublicServer
      .from("project_links")
      .select("*")
      .eq("project_id", project.id);
    if (linksError) throw new Error(linksError.message);
    return mapRow(project, links ?? []);
  });

// Admin: check if current user has admin role
export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data, userId: context.userId };
  });

const projectInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  tagline: z.string().max(300).default(""),
  description: z.string().max(20000).default(""),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
  media_url: z.string().url().nullable(),
  media_type: z.enum(["gif", "mp4", "image"]),
  poster_url: z.string().url().nullable(),
  order_index: z.number().int().min(0).max(10000).default(0),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
        value: z.string().min(1).max(20),
      }),
    )
    .max(6)
    .default([]),
  links: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        url: z.string().url().max(2000),
        kind: z.enum(["demo", "writeup", "repo", "other"]).default("other"),
      }),
    )
    .max(10)
    .default([]),
});

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

export const saveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => projectInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    let projectId = data.id;
    if (projectId) {
      const { error } = await supabaseAdmin
        .from("projects")
        .update({
          slug: data.slug,
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          tags: data.tags,
          media_url: data.media_url,
          media_type: data.media_type,
          poster_url: data.poster_url,
          order_index: data.order_index,
          metrics: data.metrics,
        })
        .eq("id", projectId);
      if (error) throw new Error(error.message);
    } else {
      const { data: inserted, error } = await supabaseAdmin
        .from("projects")
        .insert({
          slug: data.slug,
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          tags: data.tags,
          media_url: data.media_url,
          media_type: data.media_type,
          poster_url: data.poster_url,
          order_index: data.order_index,
          metrics: data.metrics,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      projectId = inserted.id;
    }

    // Replace links
    await supabaseAdmin.from("project_links").delete().eq("project_id", projectId);
    if (data.links.length) {
      const { error } = await supabaseAdmin.from("project_links").insert(
        data.links.map((l, i) => ({
          project_id: projectId,
          label: l.label,
          url: l.url,
          kind: l.kind,
          order_index: i,
        })),
      );
      if (error) throw new Error(error.message);
    }

    return { id: projectId };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";
import {
  saveProject,
  type Project,
  type ProjectLink,
  type ProjectMetric,
} from "@/lib/projects.functions";
import { uploadProjectMedia } from "@/lib/upload";

type ProjectMediaType = Project["media_type"];
type LinkRow = Pick<ProjectLink, "label" | "url" | "kind">;
type LinkKind = LinkRow["kind"];
type ProjectFormPayload = {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  media_url: string | null;
  media_type: ProjectMediaType;
  poster_url: string | null;
  order_index: number;
  links: LinkRow[];
  metrics: ProjectMetric[];
};

const mediaTypes = new Set<ProjectMediaType>(["gif", "mp4", "image"]);
const linkKinds = new Set<LinkKind>(["demo", "writeup", "repo", "other"]);

function parseMediaType(value: string): ProjectMediaType {
  const mediaType = value as ProjectMediaType;
  return mediaTypes.has(mediaType) ? mediaType : "image";
}

function parseLinkKind(value: string): LinkKind {
  const linkKind = value as LinkKind;
  return linkKinds.has(linkKind) ? linkKind : "other";
}

export function ProjectForm({ initial }: { initial?: Project }) {
  const navigate = useNavigate();
  const save = useServerFn(saveProject);
  const qc = useQueryClient();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [orderIndex, setOrderIndex] = useState(initial?.order_index ?? 0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(initial?.media_url ?? null);
  const [mediaType, setMediaType] = useState<ProjectMediaType>(initial?.media_type ?? "image");
  const [posterUrl, setPosterUrl] = useState<string | null>(initial?.poster_url ?? null);
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links.map((l) => ({ label: l.label, url: l.url, kind: l.kind })) ?? [],
  );
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>(
    initial?.metrics ?? [],
  );
  const [uploading, setUploading] = useState(false);

  const m = useMutation({
    mutationFn: (payload: ProjectFormPayload) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries();
      navigate({ to: "/admin" });
    },
    onError: (e: unknown) => toast.error(getErrorMessage(e, "Save failed")),
  });

  const handleUpload = async (file: File, kind: "media" | "poster") => {
    setUploading(true);
    try {
      const r = await uploadProjectMedia(file);
      if (kind === "media") {
        setMediaUrl(r.url);
        setMediaType(r.type);
      } else {
        setPosterUrl(r.url);
      }
      toast.success("Uploaded");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    m.mutate({
      id: initial?.id,
      slug: slug.trim(),
      title: title.trim(),
      tagline,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      media_url: mediaUrl,
      media_type: mediaType,
      poster_url: posterUrl,
      order_index: Number(orderIndex) || 0,
      links: links.filter((l) => l.label.trim() && l.url.trim()),
      metrics: metrics.filter((mm) => mm.label.trim() && mm.value.trim()),
    });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6 px-6 pb-20">
      <h1 className="font-serif text-4xl">{initial ? "Edit project" : "New project"}</h1>

      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className={inputCls}
        />
      </Field>

      <Field label="Slug" hint="lowercase, hyphens only — used in the URL">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          pattern="[a-z0-9-]+"
          maxLength={200}
          className={inputCls}
        />
      </Field>

      <Field label="Tagline">
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={300}
          className={inputCls}
        />
      </Field>

      <Field label="Tags" hint="comma-separated">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputCls}
          placeholder="LLM, RAG, Agents"
        />
      </Field>

      <Field label="Order" hint="lower = earlier on the grid">
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
          className={inputCls}
        />
      </Field>

      <Field label="Media (GIF / MP4 / image)">
        <input
          type="file"
          accept="image/*,video/mp4"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f, "media");
          }}
          className="text-sm"
        />
        {mediaUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border">
            {mediaType === "mp4" ? (
              <video src={mediaUrl} controls className="max-h-64 w-full" />
            ) : (
              <img src={mediaUrl} alt="" className="max-h-64 w-full object-contain" />
            )}
          </div>
        )}
        <select
          value={mediaType}
          onChange={(e) => setMediaType(parseMediaType(e.target.value))}
          className={`mt-3 ${inputCls}`}
        >
          <option value="image">Image (jpg/png)</option>
          <option value="gif">GIF</option>
          <option value="mp4">MP4 video</option>
        </select>
      </Field>

      {(mediaType === "mp4" || mediaType === "gif") && (
        <Field
          label={
            mediaType === "gif"
              ? "Poster image (optional, shown until hover)"
              : "Poster image (optional, shown before video plays)"
          }
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f, "poster");
            }}
            className="text-sm"
          />
          {posterUrl && <img src={posterUrl} alt="" className="mt-3 max-h-40 rounded-lg border" />}
        </Field>
      )}

      <Field label="Description (markdown)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          className={`${inputCls} font-mono text-sm`}
          placeholder={"## Problem\nWhat I was solving\n\n## Outcome\n**Metric** moved from X to Y"}
        />
      </Field>

      <div>
        <div className="mb-2 flex items-end justify-between">
          <label className="text-sm font-medium">
            Outcome metrics{" "}
            <span className="ml-2 text-xs text-muted-foreground">first 3 show on the card</span>
          </label>
          <button
            type="button"
            onClick={() => setMetrics([...metrics, { label: "", value: "" }])}
            className="rounded-full border px-3 py-1 text-xs"
            disabled={metrics.length >= 6}
          >
            + Add metric
          </button>
        </div>
        <div className="space-y-2">
          {metrics.map((mm, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                value={mm.label}
                onChange={(e) =>
                  setMetrics(metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                }
                placeholder="Label (e.g. P95 latency)"
                maxLength={60}
                className={`${inputCls} col-span-7`}
              />
              <input
                value={mm.value}
                onChange={(e) =>
                  setMetrics(metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                }
                placeholder="Value (e.g. -38%)"
                maxLength={20}
                className={`${inputCls} col-span-4`}
              />
              <button
                type="button"
                onClick={() => setMetrics(metrics.filter((_, j) => j !== i))}
                className="col-span-1 rounded-lg border text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-end justify-between">
          <label className="text-sm font-medium">Links</label>
          <button
            type="button"
            onClick={() => setLinks([...links, { label: "", url: "", kind: "other" }])}
            className="rounded-full border px-3 py-1 text-xs"
          >
            + Add link
          </button>
        </div>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                value={l.label}
                onChange={(e) =>
                  setLinks(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                }
                placeholder="Label"
                className={`${inputCls} col-span-3`}
              />
              <input
                value={l.url}
                onChange={(e) =>
                  setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                }
                placeholder="https://…"
                className={`${inputCls} col-span-6`}
              />
              <select
                value={l.kind}
                onChange={(e) =>
                  setLinks(
                    links.map((x, j) =>
                      j === i ? { ...x, kind: parseLinkKind(e.target.value) } : x,
                    ),
                  )
                }
                className={`${inputCls} col-span-2`}
              >
                <option value="demo">demo</option>
                <option value="writeup">writeup</option>
                <option value="repo">repo</option>
                <option value="other">other</option>
              </select>
              <button
                type="button"
                onClick={() => setLinks(links.filter((_, j) => j !== i))}
                className="col-span-1 rounded-lg border text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={m.isPending || uploading}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {m.isPending ? "Saving…" : "Save project"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="rounded-full border px-5 py-2.5 text-sm"
        >
          Cancel
        </button>
        {uploading && <span className="text-sm text-muted-foreground">Uploading…</span>}
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

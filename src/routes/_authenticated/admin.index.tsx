import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProjects, deleteProject } from "@/lib/projects.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminList,
});

function AdminList() {
  const list = useServerFn(listProjects);
  const del = useServerFn(deleteProject);
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => list(),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, or remove portfolio entries.</p>
        </div>
        <Link to="/admin/new" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          + New project
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No projects yet.</div>
        ) : (
          <ul className="divide-y">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.media_url && p.media_type !== "mp4" && (
                    <img src={p.media_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-lg">{p.title}</div>
                  <div className="truncate text-xs text-muted-foreground">/{p.slug} · order {p.order_index}</div>
                </div>
                <Link
                  to="/admin/$id/edit"
                  params={{ id: p.id }}
                  className="rounded-full border px-3 py-1.5 text-sm hover:border-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"?`)) mDelete.mutate(p.id);
                  }}
                  className="rounded-full border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

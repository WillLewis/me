import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/projects.functions";
import { ProjectForm } from "@/components/project-form";

export const Route = createFileRoute("/_authenticated/admin/$id/edit")({
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const list = useServerFn(listProjects);
  const { data, isLoading } = useQuery({ queryKey: ["admin", "projects"], queryFn: () => list() });

  if (isLoading)
    return <div className="mx-auto max-w-3xl px-6 py-10 text-muted-foreground">Loading…</div>;
  const project = data?.find((p) => p.id === id);
  if (!project) throw notFound();
  return <ProjectForm initial={project} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "@/components/project-form";

export const Route = createFileRoute("/_authenticated/admin/new")({
  component: () => <ProjectForm />,
});

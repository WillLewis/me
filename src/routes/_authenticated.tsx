import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/lib/projects.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const router = useRouter();
  const check = useServerFn(checkAdmin);
  const { data, isLoading } = useQuery({
    queryKey: ["check-admin"],
    queryFn: () => check(),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.navigate({ to: "/login" });
  };

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-muted-foreground">Checking access…</div>;
  }

  if (!data?.isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl">Not an admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account is signed in but doesn't have admin access. The site owner needs to grant you the admin role from the backend (table <code className="rounded bg-muted px-1.5 py-0.5 text-xs">user_roles</code>).
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Your user ID: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{data?.userId}</code></p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={signOut} className="rounded-full border px-4 py-2 text-sm">Sign out</button>
          <Link to="/" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/admin" className="font-serif text-xl">Portfolio admin</Link>
        <div className="flex gap-3 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">View site</Link>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

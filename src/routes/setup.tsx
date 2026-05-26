import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { bootstrapAdmin, getSetupStatus } from "@/lib/setup.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Admin setup" }, { name: "robots", content: "noindex" }] }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const statusFn = useServerFn(getSetupStatus);
  const bootstrapFn = useServerFn(bootstrapAdmin);
  const { data: status, isLoading } = useQuery({
    queryKey: ["setup-status"],
    queryFn: () => statusFn(),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await bootstrapFn({ data: { email, password } });
      // Sign the user in right away.
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Admin account created. Welcome.");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err?.message ?? "Setup failed");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-md px-6 py-20 text-muted-foreground">Checking…</div>;
  }

  if (status?.hasAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <h1 className="font-serif text-3xl">Setup already complete</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          An admin account exists for this portfolio. This one-time setup page is now locked.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Sign in</Link>
          <Link to="/" className="rounded-full border px-4 py-2 text-sm">Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Portfolio</Link>
      <h1 className="mt-6 font-serif text-4xl">Claim your admin account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        One-time setup. After this, the page locks and you'll sign in from{" "}
        <Link to="/login" className="underline">/login</Link>.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            At least 8 characters. Checked against the Have-I-Been-Pwned breach database.
          </span>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create admin account"}
        </button>
      </form>
    </div>
  );
}

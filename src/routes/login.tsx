import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { siteConfig } from "@/lib/site-config";
import { getErrorMessage } from "@/lib/error-message";
import { noIndexMeta } from "@/lib/metadata";

export const Route = createFileRoute("/login")({
  head: () => noIndexMeta("Sign in", "/login", "Admin sign-in for the portfolio CMS."),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      void navigate({ to: "/admin", replace: true });
    }
  }, [loading, navigate, session]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("If that email exists, a reset link is on its way.");
        setMode("signin");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Authentication failed"));
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "signin" ? "Sign in" : "Reset password";
  const cta = mode === "signin" ? "Sign in" : "Send reset link";

  if (loading || session) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← {siteConfig.shortTitle}
      </Link>
      <h1 className="mt-6 font-serif text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "forgot"
          ? "Enter your email and we'll send you a reset link."
          : `Admin access for the ${siteConfig.shortTitle} CMS.`}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        {mode === "signin" && (
          <label className="block">
            <span className="text-sm">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "…" : cta}
        </button>
      </form>
      <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
        {mode === "signin" ? (
          <button onClick={() => setMode("forgot")} className="text-left hover:text-foreground">
            Forgot your password?
          </button>
        ) : (
          <button onClick={() => setMode("signin")} className="text-left hover:text-foreground">
            ← Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}

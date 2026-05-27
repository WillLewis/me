import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/error-message";
import { noIndexMeta } from "@/lib/metadata";

export const Route = createFileRoute("/reset-password")({
  head: () => noIndexMeta("Reset password", "/reset-password", "Reset portfolio admin password."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically
    // and emits a PASSWORD_RECOVERY event.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Also check existing session in case event already fired
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update password"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
        ← Sign in
      </Link>
      <h1 className="mt-6 font-serif text-4xl">Set a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {ready
          ? "Enter a new password for your admin account."
          : "Open this page from the password reset email link to continue."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm">New password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready}
            className="mt-1 w-full rounded-lg border bg-card px-3 py-2 outline-none focus:border-primary disabled:opacity-50"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !ready}
          className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getSetupStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return { hasAdmin: (count ?? 0) > 0 };
});

const bootstrapInput = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => bootstrapInput.parse(d))
  .handler(async ({ data }) => {
    // Re-check under lock-ish semantics: refuse if any admin already exists.
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      throw new Error("Admin already configured. Use the login page.");
    }

    // Create the auth user with email confirmed so they can sign in immediately.
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "Failed to create user");
    }

    // Grant admin role.
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleErr) {
      // Best-effort cleanup if role insert fails.
      await supabaseAdmin.auth.admin.deleteUser(created.user.id).catch(() => {});
      throw new Error(roleErr.message);
    }

    return { ok: true, email: data.email };
  });

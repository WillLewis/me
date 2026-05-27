// Read-only server-side Supabase client for public data.
// Use the service-role client for admin writes or privileged setup checks.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createSupabasePublicServerClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabasePublicServer: ReturnType<typeof createSupabasePublicServerClient> | undefined;

export const supabasePublicServer = new Proxy(
  {} as ReturnType<typeof createSupabasePublicServerClient>,
  {
    get(_, prop, receiver) {
      if (!_supabasePublicServer) _supabasePublicServer = createSupabasePublicServerClient();
      return Reflect.get(_supabasePublicServer, prop, receiver);
    },
  },
);

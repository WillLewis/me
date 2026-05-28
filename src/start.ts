import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

function isSameOriginReferer(referer: string, requestOrigin: string) {
  if (referer === requestOrigin) return true;
  if (!referer.startsWith(requestOrigin)) return false;
  const nextChar = referer.charAt(requestOrigin.length);
  return nextChar === "" || nextChar === "/" || nextChar === "?" || nextChar === "#";
}

const csrfMiddleware = createMiddleware().server(async (ctx) => {
  if (ctx.handlerType !== "serverFn") return ctx.next();

  const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
  if (fetchSite !== null) {
    return fetchSite === "same-origin" ? ctx.next() : new Response("Forbidden", { status: 403 });
  }

  const requestOrigin = new URL(ctx.request.url).origin;
  const origin = ctx.request.headers.get("Origin");
  if (origin !== null) {
    return origin === requestOrigin ? ctx.next() : new Response("Forbidden", { status: 403 });
  }

  const referer = ctx.request.headers.get("Referer");
  if (referer !== null && isSameOriginReferer(referer, requestOrigin)) {
    return ctx.next();
  }

  return new Response("Forbidden", { status: 403 });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));

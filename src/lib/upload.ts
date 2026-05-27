import { supabase } from "@/integrations/supabase/client";

const BUCKET = "project-media";

export function detectMediaType(file: File): "gif" | "mp4" | "image" {
  const type = file.type.toLowerCase();
  if (type === "image/gif") return "gif";
  if (type.startsWith("video/")) return "mp4";
  return "image";
}

export async function uploadProjectMedia(
  file: File,
): Promise<{ url: string; type: "gif" | "mp4" | "image" }> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, type: detectMediaType(file) };
}

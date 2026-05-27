import { siteConfig } from "@/lib/site-config";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  robots?: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function pageMeta({
  title = siteConfig.title,
  description = siteConfig.description,
  path = "/",
  image = "/og-image.png",
  robots = "index,follow",
}: MetadataOptions = {}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.shortTitle },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function noIndexMeta(title: string, path: string, description = siteConfig.description) {
  return pageMeta({
    title,
    description,
    path,
    robots: "noindex,nofollow,noarchive",
  });
}

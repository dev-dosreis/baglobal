import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/terms", "/comunicado"].map((path) => ({
    url: `https://baglobal.com.br${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.4,
  }));
}

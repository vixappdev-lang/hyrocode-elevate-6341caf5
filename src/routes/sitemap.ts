import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://hyrocode.online";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

function xmlResponse() {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [
    { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
    { path: "/#proposta", lastmod: today, changefreq: "monthly", priority: "0.7" },
    { path: "/#portfolio", lastmod: today, changefreq: "weekly", priority: "0.8" },
    { path: "/#como-funciona", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { path: "/#precos", lastmod: today, changefreq: "weekly", priority: "0.9" },
    { path: "/#contato", lastmod: today, changefreq: "monthly", priority: "0.6" },
  ];

  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return new Response(
    [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}

export const Route = createFileRoute("/sitemap")({
  server: {
    handlers: {
      GET: async () => xmlResponse(),
    },
  },
});
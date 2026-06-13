export default function sitemap() {
  const baseUrl = "https://converter.theatom.lk";
  const now = new Date();

  const staticRoutes = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/convert", changeFrequency: "weekly", priority: 0.95 },
    { path: "/pdf-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/image-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/video-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/audio-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/archive-tools", changeFrequency: "weekly", priority: 0.8 },
    { path: "/website-capture", changeFrequency: "weekly", priority: 0.85 },
    { path: "/settings", changeFrequency: "monthly", priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  ];

  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

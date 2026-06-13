export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://converter.theatom.lk/sitemap.xml",
    host: "https://converter.theatom.lk",
  };
}

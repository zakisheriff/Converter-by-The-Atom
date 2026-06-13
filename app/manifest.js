export default function manifest() {
  return {
    name: "Converter by The Atom",
    short_name: "Converter",
    description:
      "Convert files between 200+ formats for free — documents, images, video, audio, archives, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f1",
    theme_color: "#f5f5f1",
    icons: [
      {
        src: "/Logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

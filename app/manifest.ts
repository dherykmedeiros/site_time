import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Site Time",
    short_name: "Site Time",
    description: "Gestão de times esportivos amadores",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f6",
    theme_color: "#0a584b",
    lang: "pt-BR",
    icons: [
      {
        src: "/next.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/next.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

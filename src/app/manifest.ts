import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Semih Karakaş | Full-Stack Yazılım Geliştirici",
    short_name: "skarakas.com",
    description:
      "Modern web teknolojileri ile yüksek performanslı, estetik ve kullanıcı deneyimi odaklı dijital ürünler.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14b8a6",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

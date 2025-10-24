import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http", // atau 'https' jika backend Anda pakai https
        hostname: "localhost", // Hanya hostname, tanpa port
        port: "8000", // Port backend Anda
        pathname: "/images/**", // Path tempat gambar disimpan
      },
      // Tambahkan domain lain jika perlu (misal: S3, Cloudinary)
    ],
  },
  imagesprofile: {
    remotePatterns: [
      {
        protocol: "http", // atau 'https' jika backend Anda pakai https
        hostname: "localhost", // Hanya hostname, tanpa port
        port: "8000", // Port backend Anda
        pathname: "/images/profile/**", // Path tempat gambar disimpan
      },
      // Tambahkan domain lain jika perlu (misal: S3, Cloudinary)
    ],
  },
};

export default withFlowbiteReact(nextConfig);

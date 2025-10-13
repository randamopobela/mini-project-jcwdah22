import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarComponent from "@/components/Navbar";
import FooterComponent from "@/components/Footer";
import { Toaster } from "sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "RunEvent - Platform Tiket Event Lari",
    description:
        "Platform penjualan tiket untuk event lari terbaik di Indonesia",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <NavbarComponent />
                <main className="min-h-screen">{children}</main>
                <FooterComponent />
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}

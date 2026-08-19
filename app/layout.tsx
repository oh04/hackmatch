import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "HackMatch — Find your hackathon team",
    description:
      "Match with complementary builders by skills, interests, availability, and working style.",
    openGraph: {
      title: "HackMatch — Find your hackathon team",
      description:
        "Match with complementary builders by skills, interests, availability, and working style.",
      images: [{ url: image, width: 1728, height: 909 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "HackMatch — Find your hackathon team",
      description:
        "Match with complementary builders by skills, interests, availability, and working style.",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

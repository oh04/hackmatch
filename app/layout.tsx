import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.DEPLOY_PRIME_URL ?? process.env.URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HackMatch — Find your hackathon team",
  description:
    "Match with complementary builders by skills, interests, availability, and working style.",
  openGraph: {
    title: "HackMatch — Find your hackathon team",
    description:
      "Match with complementary builders by skills, interests, availability, and working style.",
    images: [{ url: "/og.png", width: 1728, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HackMatch — Find your hackathon team",
    description:
      "Match with complementary builders by skills, interests, availability, and working style.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project BAYKUSH — Intelligence Becomes Direction",
  description:
    "An independent cyber, geopolitical, and strategic intelligence engineering initiative.",
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

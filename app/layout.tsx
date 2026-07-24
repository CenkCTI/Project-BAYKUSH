import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project BAYKUSH",
  description:
    "Independent cyber, geopolitical, and strategic intelligence initiative.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

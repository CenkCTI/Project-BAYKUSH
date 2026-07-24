import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project BAYKUSH | Intelligence Becomes Direction",
  description:
    "An independent cyber, geopolitical, and strategic intelligence initiative building tools and publishing assessments.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#040505",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { owlDataUri } from "./owl-data";
import RotatingEarth from "./RotatingEarth";
import "./globals.css";
import "./module-grid.css";
import "./owl-reference.css";
import "./globe-animation.css";
import "./rotating-earth.css";

export const metadata: Metadata = {
  title: "Project BAYKUSH | Intelligence Becomes Direction",
  description:
    "An independent cyber, geopolitical, and strategic intelligence initiative building tools and publishing assessments.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#040505",
};

const bodyStyle = {
  "--owl-reference-image": `url("${owlDataUri}")`,
} as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        {children}
        <RotatingEarth />
      </body>
    </html>
  );
}

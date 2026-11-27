import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Project BAYKUSH | Intelligence Research", template: "%s | Project BAYKUSH" },
  description: "Independent intelligence research and development project exploring cyber threat intelligence, geopolitical context, and decision support.",
};
export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0f120c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label="Project BAYKUSH home">
              <Image src="/favicon.svg" width={48} height={48} alt="" priority />
              <span className="brand-text"><span className="brand-word">BAYKUSH</span><span className="brand-subtitle">INTELLIGENCE RESEARCH PROJECT</span></span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/#systems">Ecosystem</Link>
              <Link href="/#vision">Vision</Link>
              <Link href="/systems/rasat">Research</Link>
              <a href="https://github.com/CenkCTI/Project-BAYKUSH">GitHub</a>
            </nav>
          </div>
        </header>
        <div id="main-content" tabIndex={-1}>{children}</div>
        <footer className="site-footer"><span>PROJECT BAYKUSH / INDEPENDENT R&amp;D</span><span>UNDER ACTIVE DEVELOPMENT</span></footer>
      </body>
    </html>
  );
}

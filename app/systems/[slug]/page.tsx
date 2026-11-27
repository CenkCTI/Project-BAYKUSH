import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules } from "../../modules";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return modules.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const module = modules.find((entry) => entry.slug === slug);
  return module ? { title: module.name, description: module.description } : {};
}
export default async function SystemPage({ params }: Props) {
  const { slug } = await params;
  const module = modules.find((entry) => entry.slug === slug);
  if (!module) notFound();

  return (
    <main className="site-main">
      <Link className="back-link" href="/#systems">← Back to ecosystem</Link>
      <section className="detail-hero">
        <p className="eyebrow">SYSTEM {module.number} / {module.label}</p>
        <h1>{module.name}{slug === "rasat" && <em> / Reports</em>}</h1>
        <span className="status" data-planned={module.status === "PLANNED"}>{module.status}</span>
        <p className="detail-lead">{module.purpose}</p>
      </section>
      <div className="detail-grid">
        <section className="detail-panel">
          <p className="eyebrow">CURRENT SCOPE</p>
          <h2>{slug === "rasat" ? "Publication status" : "Documented capabilities"}</h2>
          {module.capabilities.length ? (
            <ul>{module.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <p>{slug === "rasat" ? "The publication area is being prepared. No published report archive is claimed here." : "This system is a project concept. No operational capability is claimed yet."}</p>
          )}
        </section>
        <section className="detail-panel roadmap-panel">
          <p className="eyebrow">DEVELOPMENT DIRECTION</p>
          <h2>Objectives</h2>
          <ul>{module.roadmap.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
      {module.repository && <a className="repo-link" href={module.repository}>Explore source repository ↗</a>}
      <nav className="detail-nav" aria-label="Other systems">
        {modules.filter((entry) => entry.slug !== slug).map((entry) => <Link key={entry.slug} href={"/systems/" + entry.slug}>{entry.name} ↗</Link>)}
      </nav>
    </main>
  );
}

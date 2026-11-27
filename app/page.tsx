import Link from "next/link";
import { modules } from "./modules";

export default function Home() {
  return (
    <main className="site-main">
      <section className="intro" aria-labelledby="mission-title">
        <p className="eyebrow">INDEPENDENT INTELLIGENCE RESEARCH &amp; DEVELOPMENT</p>
        <h1 id="mission-title">From information<br />to <em>understanding.</em></h1>
        <p className="intro-copy">Project BAYKUSH explores cyber intelligence at technical, tactical, operational and strategic levels, connects cyber developments to geopolitical context, and develops tools to support informed decisions.</p>
      </section>
      <section id="systems" aria-labelledby="systems-title">
        <div className="section-heading"><h2 id="systems-title">Intelligence ecosystem</h2><span>01 — 05 / SYSTEMS</span></div>
        <div className="system-list">
          {modules.map((module) => (
            <Link key={module.slug} href={"/systems/" + module.slug} className={"system-card system-" + module.slug}>
              <span className="system-index" aria-hidden="true">{module.number}</span>
              <div className="system-name"><span className="system-label">{module.label}</span><h3>{module.name}{module.slug === "rasat" && <small> / REPORTS</small>}</h3></div>
              <p>{module.description}</p>
              <span className="system-end"><span className="status" data-planned={module.status === "PLANNED"}>{module.status}</span><span className="card-arrow" aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mission-panel" id="vision">
        <p className="eyebrow">PROJECT VISION</p>
        <h2>Intelligence that supports decisions.</h2>
        <p>Our goal is to reduce analysts’ cognitive load, strengthen collaboration and give managers visibility across the intelligence lifecycle — from collection and validation to analysis, reporting and feedback.</p>
        <p>We distinguish source observations, verified evidence and analytical judgments. Unknown data is not zero, and reporting volume is not attack volume.</p>
      </section>
    </main>
  );
}

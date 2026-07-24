const modules = [
  { name: "CİTEM", subtitle: "Cyber threat intelligence", status: "ACTIVE", icon: "✦" },
  { name: "İDRAK", subtitle: "Intelligence production", status: "IN PROGRESS", icon: "⌬" },
  { name: "KARARGÂH", subtitle: "Strategic command", status: "CONCEPT", icon: "◎" },
  { name: "RASAT", subtitle: "Research & strategic assessments", status: "PUBLISHING", icon: "◉" },
];

function OwlGlobe() {
  return (
    <div className="visual" aria-label="A watchful owl silhouette behind a rotating globe">
      <svg className="owl" viewBox="0 0 800 620" role="img" aria-hidden="true">
        <path d="M132 65 258 188 400 105 542 188 668 65 611 226 664 372 531 329 469 472 400 562 331 472 269 329 136 372 189 226Z" />
        <path d="M210 205 321 241 400 318 479 241 590 205 531 335 445 379 400 472 355 379 269 335Z" />
        <circle cx="292" cy="284" r="64" />
        <circle cx="508" cy="284" r="64" />
      </svg>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="globe">
        <div className="globe-grid" />
        <div className="continents">EURASIA<br /><span>AFRICA</span></div>
      </div>
      <div className="node node-a" />
      <div className="node node-b" />
      <div className="node node-c" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Project BAYKUSH home">BAYKUSH</a>
        <nav aria-label="Primary navigation">
          <a href="#ecosystem">Ecosystem</a><a href="#systems">Systems</a><a href="#research">Research</a><a href="#vision">Vision</a>
        </nav>
        <div className="status"><span /> DEVELOPMENT ACTIVE</div>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">INDEPENDENT INTELLIGENCE ENGINEERING INITIATIVE</p>
          <h1>Intelligence<br />becomes <em>direction.</em></h1>
          <p className="lead">A closed intelligence-to-decision ecosystem built to collect signals, develop judgment, and turn insight into strategic action.</p>
          <div className="actions"><a className="button" href="#ecosystem">Explore the ecosystem <span>›</span></a><a className="text-link" href="#research">Read assessments</a></div>
        </div>
        <OwlGlobe />
        <aside className="flow" aria-label="Intelligence workflow">
          <p>ECOSYSTEM FLOW</p>
          {['COLLECT','ANALYZE','JUDGE','DIRECT'].map((item, index) => <div key={item} className={index === 3 ? 'active' : ''}><i />{item}</div>)}
        </aside>
      </section>

      <section id="ecosystem" className="module-grid shell">
        {modules.map((module, index) => (
          <article className="module-card" key={module.name}>
            <div className="module-icon">{module.icon}</div>
            <div><small>0{index + 1}</small><h2>{module.name}</h2><p>{module.subtitle}</p><span className="pill">● {module.status}</span></div>
          </article>
        ))}
      </section>

      <section id="research" className="section shell">
        <div><p className="eyebrow">RASAT / THE EYE</p><h2>Research that turns observation into foresight.</h2></div>
        <div className="research-grid">
          <article><span>EARLY WARNING</span><h3>Central Europe critical infrastructure risk outlook</h3><p>Indicators, scenarios, confidence language, and collection gaps.</p></article>
          <article><span>CYBER ASSESSMENT</span><h3>Legitimate services in cyber-espionage operations</h3><p>Operational patterns connected to strategic intent.</p></article>
          <article><span>METHODOLOGY</span><h3>How BAYKUSH develops defensible judgments</h3><p>Structured analysis, competing hypotheses, and explicit uncertainty.</p></article>
        </div>
      </section>

      <section id="vision" className="manifesto shell"><p>SIGNALS</p><b>→</b><p>EVIDENCE</p><b>→</b><p>JUDGMENT</p><b>→</b><p>DIRECTION</p></section>
      <footer className="shell"><span>PROJECT BAYKUSH © 2026</span><span>Independent research & engineering</span></footer>
    </main>
  );
}

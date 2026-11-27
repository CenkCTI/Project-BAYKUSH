type IconKind = "cluster" | "graph" | "radar" | "network" | "rings" | "eye";

type RailCard = {
  index: string;
  title: string;
  icon: IconKind;
  metrics: Array<{ label: string; value: string }>;
};

const railCards: RailCard[] = [
  {
    index: "01",
    title: "COLLECTION",
    icon: "cluster",
    metrics: [
      { label: "INPUT", value: "Open CTI sources" },
      { label: "METHOD", value: "Traceable evidence" },
    ],
  },
  {
    index: "02",
    title: "ANALYSIS",
    icon: "graph",
    metrics: [
      { label: "APPROACH", value: "Structured analysis" },
      { label: "FOCUS", value: "Analyst workflows" },
    ],
  },
  {
    index: "03",
    title: "DECISION SUPPORT",
    icon: "radar",
    metrics: [
      { label: "OUTPUT", value: "Intelligence products" },
      { label: "GOAL", value: "Informed decisions" },
    ],
  },
];

const modules: Array<{
  id: string;
  name: string;
  subtitle: string;
  state: string;
  icon: IconKind;
}> = [
  {
    id: "citem",
    name: "CİTEM",
    subtitle: "Cyber threat intelligence workspace",
    state: "IN DEVELOPMENT",
    icon: "cluster",
  },
  {
    id: "anlak",
    name: "ANLAK",
    subtitle: "Strategic and geopolitical intelligence",
    state: "PLANNED",
    icon: "network",
  },
  {
    id: "karargah",
    name: "KARARGÂH",
    subtitle: "Management oversight and decision support",
    state: "PLANNED",
    icon: "rings",
  },
  {
    id: "node",
    name: "INTEL NODE",
    subtitle: "Shared intelligence data infrastructure",
    state: "IN DEVELOPMENT",
    icon: "eye",
  },
];

function ClusterIcon() {
  const dots = [
    [18, 15], [30, 11], [42, 15], [22, 25], [37, 25],
    [14, 35], [28, 35], [44, 35], [21, 47], [36, 48],
  ];

  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      {dots.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="2.1" />
      ))}
    </svg>
  );
}

function GraphIcon() {
  const points = [[14, 39], [23, 23], [36, 17], [47, 31], [36, 43], [20, 45]];

  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <path d="M14 39 23 23 36 17 47 31 36 43 20 45Z" fill="none" />
      <path d="M23 23 36 43M36 17 20 45M14 39 47 31" fill="none" />
      {points.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="2.2" />
      ))}
    </svg>
  );
}

function RadarIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="4" />
      <circle cx="30" cy="30" r="11" fill="none" />
      <circle cx="30" cy="30" r="19" fill="none" />
      <circle cx="30" cy="30" r="26" fill="none" />
      <path d="M30 30 42 21" fill="none" />
    </svg>
  );
}

function NetworkIcon() {
  const points = [[30, 10], [17, 21], [43, 21], [13, 38], [30, 31], [47, 38], [30, 50]];

  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <path d="M30 10 17 21 13 38 30 50 47 38 43 21Z" fill="none" />
      <path d="M30 10v21M17 21l13 10 13-10M13 38l17-7 17 7M30 31v19" fill="none" />
      {points.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="2.2" />
      ))}
    </svg>
  );
}

function RingsIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="4" />
      <circle cx="30" cy="30" r="13" fill="none" />
      <circle cx="30" cy="30" r="24" fill="none" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <path
        d="M7 30c6.6-11.2 14.3-16.8 23-16.8S46.4 18.8 53 30c-6.6 11.2-14.3 16.8-23 16.8S13.6 41.2 7 30Z"
        style={{ fill: "none" }}
      />
      <circle cx="30" cy="30" r="9" style={{ fill: "none" }} />
      <circle cx="30" cy="30" r="2.8" />
      <path d="M13 18 8 13M47 18l5-5M13 42l-5 5M47 42l5 5" style={{ fill: "none" }} />
    </svg>
  );
}

function Icon({ kind }: { kind: IconKind }) {
  if (kind === "cluster") return <ClusterIcon />;
  if (kind === "graph") return <GraphIcon />;
  if (kind === "radar") return <RadarIcon />;
  if (kind === "network") return <NetworkIcon />;
  if (kind === "eye") return <EyeIcon />;
  return <RingsIcon />;
}

function OwlAndGlobe() {
  return (
    <div className="visual" aria-label="A silhouetted owl observing a rotating globe">
      <div className="visual-grid" />

      <svg className="owl" viewBox="0 0 760 610" role="img" aria-hidden="true">
        <g className="owl-lines">
          <path d="M159 54 244 151 221 179 139 122Z" />
          <path d="M601 54 516 151 539 179 621 122Z" />
          <path d="M184 91 273 177 247 207 160 151Z" />
          <path d="M576 91 487 177 513 207 600 151Z" />
          <path d="M214 134 310 212 278 244 190 190Z" />
          <path d="M546 134 450 212 482 244 570 190Z" />
          <path d="M250 182 341 242 311 275 225 233Z" />
          <path d="M510 182 419 242 449 275 535 233Z" />
          <path d="M159 54c63 98 119 143 221 167" fill="none" />
          <path d="M601 54c-63 98-119 143-221 167" fill="none" />
          <path d="M236 255c42-46 88-68 144-68s102 22 144 68" fill="none" />
          <path d="M294 261c26-26 54-39 86-39s60 13 86 39" fill="none" />
          <path d="M380 229v135" fill="none" />
          <path d="m344 347 36 48 36-48" fill="none" />
          <path d="m336 390 44 55 44-55" fill="none" />
          <path d="M245 233 187 319l94-46" fill="none" />
          <path d="M515 233 573 319l-94-46" fill="none" />
          <path d="M187 319 249 306 220 354" fill="none" />
          <path d="M573 319 511 306 540 354" fill="none" />
        </g>

        <g className="owl-eye eye-left">
          <circle cx="294" cy="250" r="56" />
          <circle cx="294" cy="250" r="39" />
          <circle cx="294" cy="250" r="22" />
          <circle className="eye-core" cx="294" cy="250" r="4.5" />
        </g>
        <g className="owl-eye eye-right">
          <circle cx="466" cy="250" r="56" />
          <circle cx="466" cy="250" r="39" />
          <circle cx="466" cy="250" r="22" />
          <circle className="eye-core" cx="466" cy="250" r="4.5" />
        </g>
      </svg>

      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <span className="orbit-node node-one" />
      <span className="orbit-node node-two" />
      <span className="orbit-node node-three" />
      <span className="orbit-node node-four" />

      <div className="globe-shell">
        <svg className="globe" viewBox="0 0 420 420" aria-hidden="true">
          <defs>
            <clipPath id="globeClip">
              <circle cx="210" cy="210" r="146" />
            </clipPath>
            <radialGradient id="globeFill" cx="42%" cy="31%" r="75%">
              <stop offset="0%" stopColor="#f0c779" stopOpacity="0.34" />
              <stop offset="47%" stopColor="#35210b" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#020303" stopOpacity="0.98" />
            </radialGradient>
          </defs>

          <circle className="globe-aura" cx="210" cy="210" r="157" />
          <circle className="globe-body" cx="210" cy="210" r="146" fill="url(#globeFill)" />

          <g className="globe-grid">
            <ellipse cx="210" cy="210" rx="133" ry="31" />
            <ellipse cx="210" cy="210" rx="133" ry="64" />
            <ellipse cx="210" cy="210" rx="133" ry="98" />
            <path d="M210 64c-38 39-60 91-60 146s22 107 60 146" />
            <path d="M210 64c38 39 60 91 60 146s-22 107-60 146" />
            <path d="M210 64c-18 42-29 91-29 146s11 104 29 146" />
            <path d="M210 64c18 42 29 91 29 146s-11 104-29 146" />
          </g>

          <g clipPath="url(#globeClip)">
            <g className="map-track">
              <g>
                <path className="land" d="M48 133 78 112l26 5 18 16 32-4 28 18 8 20-16 13-8 21-3 20-13 25-17 15-22 7-17 26-31 11-25-14-2-29 16-18 2-18-20-22 5-19 20-15 6-24Z" />
                <path className="land" d="m183 111 35-18 49 1 38 13 23 19 23 5 18 18-5 20-19 10-17 22-15 23-15 8-13 18-20 5-17-14-19 2-20 11-23-10-2-18 13-12 4-20-17-16 9-17-5-26-8-14Z" />
                <path className="land" d="m252 253 15-5 15 7 8 13-5 17-20 7-17-9-4-17Z" />
                <path className="land" d="m306 252 16-5 20 9 3 17-11 12-19-3-12-16Z" />
              </g>
              <g transform="translate(360 0)">
                <path className="land" d="M48 133 78 112l26 5 18 16 32-4 28 18 8 20-16 13-8 21-3 20-13 25-17 15-22 7-17 26-31 11-25-14-2-29 16-18 2-18-20-22 5-19 20-15 6-24Z" />
                <path className="land" d="m183 111 35-18 49 1 38 13 23 19 23 5 18 18-5 20-19 10-17 22-15 23-15 8-13 18-20 5-17-14-19 2-20 11-23-10-2-18 13-12 4-20-17-16 9-17-5-26-8-14Z" />
                <path className="land" d="m252 253 15-5 15 7 8 13-5 17-20 7-17-9-4-17Z" />
                <path className="land" d="m306 252 16-5 20 9 3 17-11 12-19-3-12-16Z" />
              </g>
            </g>
          </g>

          <circle className="globe-rim" cx="210" cy="210" r="146" />
          <path className="globe-shine" d="M119 129c39-43 91-63 151-59" />
        </svg>
      </div>
    </div>
  );
}

function RailCard({ card }: { card: RailCard }) {
  return (
    <article className="rail-card hud-corners">
      <div className="rail-title">
        <span>{card.index}</span>
        <strong>{card.title}</strong>
      </div>

      <div className="rail-content">
        <div className="rail-icon octagon">
          <Icon kind={card.icon} />
        </div>

        <div className="rail-metrics">
          {card.metrics.map((metric) => (
            <div key={metric.label}>
              <small>{metric.label}</small>
              <b>{metric.value}</b>
            </div>
          ))}

        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="page-shell" id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Project BAYKUSH home">
          <span>BAYKUSH</span>
          <i />
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="active" href="#ecosystem">Ecosystem</a>
          <a href="#citem">CİTEM</a>
          <a href="#anlak">ANLAK</a>
          <a href="#node">Intel Node</a>
          <a href="#vision">Vision</a>
        </nav>

        <div className="system-meta">
          <span className="project-status">RESEARCH PROJECT</span>
        </div>
      </header>

      <section className="hero" id="ecosystem">
        <div className="hero-copy">
          <h1>
            Intelligence
            <br />
            becomes
            <br />
            <em>direction.</em>
          </h1>
          <div className="copy-rule" />
          <p>
            An independent research and development project exploring cyber intelligence at technical,
            tactical, operational and strategic levels — with geopolitical context and decision support.
          </p>
          <a className="cta" href="#modules">
            <span>Explore the ecosystem</span>
            <b>›</b>
          </a>
        </div>

        <OwlAndGlobe />

        <aside className="right-rail">
          <div className="flow hud-corners">
            <p>INTELLIGENCE WORKFLOW / CONCEPT <i /></p>
            <ol>
              <li><span />COLLECT &amp; VALIDATE</li>
              <li><span />ANALYZE &amp; SYNTHESIZE</li>
              <li><span />PRODUCE INTELLIGENCE</li>
              <li className="active"><span />SUPPORT DECISIONS</li>
            </ol>
          </div>

          <div className="rail-stack">
            {railCards.map((card) => <RailCard key={card.title} card={card} />)}
          </div>
        </aside>
      </section>

      <section className="modules" id="modules" aria-label="BAYKUSH systems">
        {modules.map((module) => (
          <article className="module-card hud-corners" id={module.id} key={module.name}>
            <div className="module-icon octagon"><Icon kind={module.icon} /></div>
            <div className="module-copy">
              <h2>{module.name}</h2>
              <p>{module.subtitle}</p>
              <div className="module-rule" />
              <span className="module-state"><i />{module.state}</span>
            </div>
          </article>
        ))}
      </section>

      <div className="lower-line" aria-hidden="true">
        <span />
        <a href="#vision" aria-label="Scroll to research">⌄</a>
        <span />
      </div>

      <section className="research" id="vision">
        <p className="eyebrow">MISSION / PROJECT VISION</p>
        <div>
          <h2>From information to understanding.</h2>
          <p>
            BAYKUSH aims to reduce analyst cognitive load, improve collaboration across intelligence
            teams, and give managers and decision-makers visibility into the intelligence lifecycle.
            Cyber developments are interpreted in their geopolitical context to support informed decisions.
          </p>
          <p>
            CİTEM and the planned ANLAK workspace aim to support current intelligence, rapid briefs
            and periodic assessments tailored to intelligence requirements.
          </p>
        </div>
      </section>

      <section className="research" id="infrastructure">
        <p className="eyebrow">DATA / INTELLIGENCE NODE</p>
        <div>
          <h2>Collect once. Preserve source truth.</h2>
          <p>
            The Node repository documents adapters for CISA KEV, NVD, FIRST EPSS, ThreatFox and
            MalwareBazaar, with raw evidence preservation, deterministic normalization and recovery.
            Continuous collection is a design objective, not a guarantee of public service uptime.
          </p>
          <p>
            Historical measurements, coverage-aware visualizations in CİTEM and intelligence profiles
            matching incoming data to active requirements are roadmap capabilities. Source reporting
            volume must not be interpreted as attack volume.
          </p>
          <a className="research-link" href="https://github.com/CenkCTI/BAYKUSH-Intel-Node">Explore the Node repository</a>
        </div>
      </section>

      <section className="research" id="workspace">
        <p className="eyebrow">WORKSPACE / CİTEM</p>
        <div>
          <h2>Evidence-led cyber intelligence.</h2>
          <p>
            CİTEM is a developing cyber threat intelligence workspace with documented investigation,
            indicator, evidence, relationship, MITRE mapping and reporting features. Its public demo
            uses fictional, synthetic data.
          </p>
          <a className="research-link" href="https://github.com/CenkCTI/CIP">Explore CİTEM on GitHub</a>
        </div>
      </section>

      <section className="research" id="research">
        <p className="eyebrow">RASAT / RESEARCH</p>
        <div>
          <h2>Reports and intelligence assessments.</h2>
          <p>
            A planned publication space for cyber threat research, technical and operational briefs,
            geopolitical analysis and strategic assessments. No report archive is claimed at this stage.
          </p>
        </div>
      </section>
      <footer className="project-footer">
        <span>PROJECT BAYKUSH / INDEPENDENT RESEARCH &amp; DEVELOPMENT</span>
        <a href="https://github.com/CenkCTI/Project-BAYKUSH">GitHub</a>
      </footer>
    </main>
  );
}

type IconKind = "cluster" | "graph" | "radar" | "eye";

type RailCard = {
  index: string;
  title: string;
  icon: IconKind;
  metrics: Array<{ label: string; value: string }>;
  bars?: number[];
  progress?: number;
  meter?: number;
};

type ActiveModule = {
  status: "active";
  id: string;
  index: string;
  name: string;
  descriptor: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: IconKind;
};

type InProgressModule = {
  status: "in-progress";
  id: string;
  initial: "A" | "K";
  accessibleName: "ANLAK" | "KARARGÂH";
};

type Module = ActiveModule | InProgressModule;

const railCards: RailCard[] = [
  {
    index: "01",
    title: "COLLECTION",
    icon: "cluster",
    metrics: [
      { label: "SOURCES", value: "1,248" },
      { label: "SIGNALS", value: "24,837" },
    ],
    bars: [7, 14, 10, 19, 12, 17, 9, 23, 14, 20],
  },
  {
    index: "02",
    title: "ANALYSIS",
    icon: "graph",
    metrics: [
      { label: "RELATIONS", value: "312" },
      { label: "CONFIDENCE", value: "78%" },
    ],
    progress: 78,
  },
  {
    index: "03",
    title: "COMMAND",
    icon: "radar",
    metrics: [
      { label: "PRIORITY", value: "HIGH" },
      { label: "RISK LEVEL", value: "MEDIUM" },
    ],
    meter: 4,
  },
];

const modules: readonly Module[] = [
  {
    status: "active",
    id: "duru-goru",
    index: "01",
    name: "DURU GÖRÜ",
    descriptor: "STRATEGIC RESEARCH, REPORTS & FORESIGHT",
    description:
      "Jeopolitik, siber güvenlik, enerji ve strateji üzerine araştırmalar, analizler ve öngörüler.",
    actionLabel: "EXPLORE RESEARCH",
    href: "#vision",
    icon: "eye",
  },
  {
    status: "active",
    id: "citem",
    index: "02",
    name: "CİTEM",
    descriptor: "CYBER INTELLIGENCE, THREAT EVALUATION & MONITORING",
    description:
      "Operasyonel ve taktik siber tehdit istihbaratı, analiz ve izleme platformu.",
    actionLabel: "VIEW SYSTEM",
    href: "#citem",
    icon: "cluster",
  },
  {
    status: "in-progress",
    id: "anlak",
    initial: "A",
    accessibleName: "ANLAK",
  },
  {
    status: "in-progress",
    id: "karargah",
    initial: "K",
    accessibleName: "KARARGÂH",
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
  return <EyeIcon />;
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

          {card.bars ? (
            <div className="micro-bars" aria-hidden="true">
              {card.bars.map((height, index) => (
                <i key={`${height}-${index}`} style={{ height }} />
              ))}
            </div>
          ) : null}

          {typeof card.progress === "number" ? (
            <div className="confidence" aria-label={`${card.progress}% confidence`}>
              <span style={{ width: `${card.progress}%` }} />
            </div>
          ) : null}

          {typeof card.meter === "number" ? (
            <div className="risk-meter" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <i key={index} className={index < card.meter! ? "active" : ""} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ModuleCard({ module }: { module: Module }) {
  if (module.status === "in-progress") {
    return (
      <article
        className="module-card module-card-in-progress hud-corners"
        id={module.id}
        aria-label={`${module.accessibleName} — In progress`}
        aria-disabled="true"
      >
        <span className="module-initial" aria-hidden="true">{module.initial}</span>
        <span className="module-progress-state" aria-hidden="true">IN PROGRESS</span>
      </article>
    );
  }

  return (
    <article className="module-card module-card-active hud-corners" id={module.id}>
      <div className="module-active-head" aria-hidden="true">
        <span className="module-number">{module.index}</span>
        <div className="module-icon octagon">
          <Icon kind={module.icon} />
        </div>
      </div>

      <div className="module-copy">
        <h2>{module.name}</h2>
        <p className="module-descriptor">{module.descriptor}</p>
        <p className="module-description">{module.description}</p>
        <a className="module-action" href={module.href}>
          <span>{module.actionLabel}</span>
          <b aria-hidden="true">›</b>
        </a>
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
          <a href="#duru-goru">DURU GÖRÜ</a>
          <a href="#citem">CİTEM</a>
          <a href="#vision">Vision</a>
        </nav>

        <div className="system-meta">
          <span className="system-status"><i /> OPERATIONAL STATUS</span>
          <span className="secure">SECURE</span>
          <span className="divider" />
          <span className="language">TR <b>⌄</b></span>
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
            A closed intelligence-to-decision ecosystem built to collect signals, develop judgment,
            and turn insight into strategic action.
          </p>
          <a className="cta" href="#modules">
            <span>Explore the ecosystem</span>
            <b>›</b>
          </a>
        </div>

        <OwlAndGlobe />

        <aside className="right-rail">
          <div className="flow hud-corners">
            <p>ECOSYSTEM FLOW <i /></p>
            <ol>
              <li className="active"><span />RESEARCH</li>
              <li className="active"><span />CYBER INTELLIGENCE</li>
              <li><span />CONTEXT ANALYSIS</li>
              <li><span />COMMAND</li>
            </ol>
          </div>

          <div className="rail-stack">
            {railCards.map((card) => <RailCard key={card.title} card={card} />)}
          </div>
        </aside>
      </section>

      <section className="modules" id="modules" aria-label="BAYKUSH systems">
        {modules.map((module) => <ModuleCard key={module.id} module={module} />)}
      </section>

      <div className="lower-line" aria-hidden="true">
        <span />
        <a href="#vision" aria-label="Scroll to research">⌄</a>
        <span />
      </div>

      <section className="research" id="vision">
        <p className="eyebrow">DURU GÖRÜ / THE EYE</p>
        <div>
          <h2>Reports, research and strategic assessments.</h2>
          <p>
            BAYKUSH does not only build systems. Its public intelligence layer publishes structured
            assessments across cyber threats, geopolitics, energy security and strategic warning.
          </p>
        </div>
      </section>
    </main>
  );
}

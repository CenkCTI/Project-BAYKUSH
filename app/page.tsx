const modules = [
  {
    name: "CİTEM",
    subtitle: "Cyber threat intelligence",
    description: "Signals, campaigns, actors, indicators, and operational evidence.",
    status: "ACTIVE DEVELOPMENT",
    icon: "✦",
  },
  {
    name: "İDRAK",
    subtitle: "Intelligence production",
    description: "Hypotheses, source evaluation, structured analysis, and judgment.",
    status: "IN PROGRESS",
    icon: "⌬",
  },
  {
    name: "KARARGÂH",
    subtitle: "Strategic command",
    description: "Decision framing, scenarios, strategic options, and direction.",
    status: "CONCEPT",
    icon: "◎",
  },
  {
    name: "RASAT",
    subtitle: "Research & assessments",
    description: "Published cyber, geopolitical, energy, and early-warning analysis.",
    status: "PUBLISHING",
    icon: "◉",
  },
];

const assessments = [
  {
    type: "EARLY WARNING",
    title: "Central Europe critical infrastructure risk outlook",
    description: "Indicators, scenarios, confidence language, and collection gaps.",
  },
  {
    type: "CYBER ASSESSMENT",
    title: "Legitimate services in cyber-espionage operations",
    description: "Operational patterns connected to strategic intent.",
  },
  {
    type: "METHODOLOGY",
    title: "How BAYKUSH develops defensible judgments",
    description: "Structured analysis, competing hypotheses, and explicit uncertainty.",
  },
];

function OwlGlobe() {
  return (
    <div
      className="visual"
      aria-label="A watchful owl silhouette with glowing eyes above a rotating globe"
    >
      <div className="visualGrid" aria-hidden="true" />

      <svg
        className="owlSilhouette"
        viewBox="0 0 960 720"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <filter id="eyeGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="owlFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#173453" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#081321" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#02060d" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="owlMass"
          fill="url(#owlFade)"
          d="M188 182c33-68 96-116 184-137l42 78c21-5 43-8 66-8s45 3 66 8l42-78c88 21 151 69 184 137 38 78 45 190 12 296-9-48-31-88-65-120-39-37-90-57-145-57-36 0-65 7-94 24-29-17-58-24-94-24-55 0-106 20-145 57-34 32-56 72-65 120-33-106-26-218 12-296Z"
        />
        <path
          className="owlContour"
          d="M198 180c36-64 98-108 177-127l43 76M762 180c-36-64-98-108-177-127l-43 76M326 211c39-28 92-42 154-42s115 14 154 42"
        />
        <path
          className="owlBridge"
          d="M480 247c-26 0-48 17-56 41-10 31 4 67 39 91l17 13 17-13c35-24 49-60 39-91-8-24-30-41-56-41Z"
        />
        <path className="owlBeak" d="m458 356 22 31 22-31" />

        <g className="eyeGroup leftEye" filter="url(#eyeGlow)">
          <circle cx="354" cy="292" r="75" className="eyeHalo" />
          <circle cx="354" cy="292" r="51" className="eyeRing" />
          <circle cx="354" cy="292" r="22" className="eyeCore" />
        </g>
        <g className="eyeGroup rightEye" filter="url(#eyeGlow)">
          <circle cx="606" cy="292" r="75" className="eyeHalo" />
          <circle cx="606" cy="292" r="51" className="eyeRing" />
          <circle cx="606" cy="292" r="22" className="eyeCore" />
        </g>
      </svg>

      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />
      <div className="node nodeA" aria-hidden="true" />
      <div className="node nodeB" aria-hidden="true" />
      <div className="node nodeC" aria-hidden="true" />

      <div className="globeShell" aria-hidden="true">
        <svg className="globeSvg" viewBox="0 0 420 420">
          <defs>
            <clipPath id="globeClip">
              <circle cx="210" cy="210" r="165" />
            </clipPath>
            <radialGradient id="globeGlow" cx="34%" cy="28%" r="76%">
              <stop offset="0%" stopColor="#89ecff" stopOpacity="0.38" />
              <stop offset="52%" stopColor="#16364f" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#020710" stopOpacity="0.98" />
            </radialGradient>
          </defs>

          <circle className="globeShadow" cx="210" cy="217" r="165" />
          <circle className="globeBase" cx="210" cy="210" r="165" fill="url(#globeGlow)" />

          <g className="globeLatitudes">
            <ellipse cx="210" cy="210" rx="152" ry="38" />
            <ellipse cx="210" cy="210" rx="152" ry="76" />
            <ellipse cx="210" cy="210" rx="152" ry="115" />
            <ellipse cx="210" cy="210" rx="152" ry="152" />
          </g>

          <g className="globeLongitudes">
            <path d="M210 46c-42 39-68 99-68 164s26 125 68 164" />
            <path d="M210 46c42 39 68 99 68 164s-26 125-68 164" />
            <path d="M210 46c-24 42-38 103-38 164s14 122 38 164" />
            <path d="M210 46c24 42 38 103 38 164s-14 122-38 164" />
          </g>

          <g clipPath="url(#globeClip)">
            <g className="globeMapTrack">
              <g className="globeMapFrame">
                <path
                  className="continent"
                  d="M22 158 48 130l26-13 20 12 12 29-14 25-4 30-14 38-23-10-12-31 9-28-22-24Z"
                />
                <path
                  className="continent"
                  d="m119 111 43-22 56 1 28 12 40 5 37 22 30 2 16 17-9 27-28 8-20 23-16 30-20 13-32-8-23 20-25-8-7-28 16-17 3-24-18-12 4-22-30-18-25-21Z"
                />
                <path
                  className="continent"
                  d="m213 252 18-13 22 5 9 20-7 20-24 11-16-8-5-18 3-17Z"
                />
                <path
                  className="continent"
                  d="m300 248 27-7 22 13 4 20-14 13-28-3-14-19 3-17Z"
                />
              </g>
              <g className="globeMapFrame" transform="translate(380 0)">
                <path
                  className="continent"
                  d="M22 158 48 130l26-13 20 12 12 29-14 25-4 30-14 38-23-10-12-31 9-28-22-24Z"
                />
                <path
                  className="continent"
                  d="m119 111 43-22 56 1 28 12 40 5 37 22 30 2 16 17-9 27-28 8-20 23-16 30-20 13-32-8-23 20-25-8-7-28 16-17 3-24-18-12 4-22-30-18-25-21Z"
                />
                <path
                  className="continent"
                  d="m213 252 18-13 22 5 9 20-7 20-24 11-16-8-5-18 3-17Z"
                />
                <path
                  className="continent"
                  d="m300 248 27-7 22 13 4 20-14 13-28-3-14-19 3-17Z"
                />
              </g>
            </g>
          </g>

          <circle className="globeRim" cx="210" cy="210" r="165" />
          <path className="globeHighlight" d="M111 110c36-36 84-57 145-59" />
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Project BAYKUSH home">
          BAYKUSH
        </a>
        <nav aria-label="Primary navigation">
          <a href="#systems">Ecosystem</a>
          <a href="#systems">Systems</a>
          <a href="#research">Research</a>
          <a href="#vision">Vision</a>
        </nav>
        <div className="status">
          <span /> DEVELOPMENT ACTIVE
        </div>
      </header>

      <section id="top" className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">INDEPENDENT INTELLIGENCE ENGINEERING INITIATIVE</p>
          <h1>
            Intelligence
            <br />
            becomes <em>direction.</em>
          </h1>
          <p className="lead">
            A cyber, geopolitical, and strategic intelligence ecosystem built to collect signals,
            develop judgment, and turn insight into direction.
          </p>
          <div className="actions">
            <a className="button" href="#systems">
              Explore the ecosystem <span>›</span>
            </a>
            <a className="textLink" href="#research">
              Read assessments
            </a>
          </div>
        </div>

        <OwlGlobe />

        <aside className="flow" aria-label="Intelligence workflow">
          <p>ECOSYSTEM FLOW</p>
          {["COLLECT", "ANALYZE", "JUDGE", "DIRECT"].map((item, index) => (
            <div key={item} className={index === 3 ? "active" : ""}>
              <i />
              {item}
            </div>
          ))}
        </aside>
      </section>

      <section id="systems" className="moduleGrid shell" aria-label="BAYKUSH ecosystem modules">
        {modules.map((module, index) => (
          <article className="moduleCard" key={module.name}>
            <div className="moduleIcon">{module.icon}</div>
            <div>
              <small>0{index + 1}</small>
              <h2>{module.name}</h2>
              <p className="moduleSubtitle">{module.subtitle}</p>
              <p>{module.description}</p>
              <span className="pill">● {module.status}</span>
            </div>
          </article>
        ))}
      </section>

      <section id="research" className="researchSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">RASAT / THE EYE</p>
          <h2>Research that turns observation into foresight.</h2>
        </div>
        <div className="researchGrid">
          {assessments.map((assessment) => (
            <article key={assessment.title}>
              <span>{assessment.type}</span>
              <h3>{assessment.title}</h3>
              <p>{assessment.description}</p>
              <a href="#vision">VIEW BRIEF ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section id="vision" className="manifesto shell" aria-label="BAYKUSH intelligence flow">
        <p>SIGNALS</p>
        <b>→</b>
        <p>EVIDENCE</p>
        <b>→</b>
        <p>JUDGMENT</p>
        <b>→</b>
        <p>DIRECTION</p>
      </section>

      <footer className="shell">
        <span>PROJECT BAYKUSH © 2026</span>
        <span>Independent research & engineering initiative</span>
      </footer>
    </main>
  );
}

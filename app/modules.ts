export type Module = {
  slug: string; number: string; name: string; label: string; description: string;
  status: string; purpose: string; capabilities: string[]; roadmap: string[];
  repository?: string;
};

export const modules: Module[] = [
  {
    slug: "citem", number: "01", name: "CİTEM", label: "CYBER THREAT INTELLIGENCE",
    description: "Evidence-led investigation, technical threat monitoring and structured intelligence production.",
    status: "IN DEVELOPMENT",
    purpose: "CİTEM is designed to reduce cognitive load and help analysts transform fragmented cyber information into traceable technical, tactical and operational intelligence.",
    capabilities: ["Investigation workspaces and evidence management", "Indicator management, relationships and MITRE ATT&CK mapping", "Source provenance and structured reporting", "Synthetic public demo environment"],
    roadmap: ["Streamline shared collection, validation and analysis workflows", "Match incoming intelligence to active intelligence requirements", "Support current intelligence, rapid briefs and periodic assessments"],
    repository: "https://github.com/CenkCTI/CIP",
  },
  {
    slug: "anlak", number: "02", name: "ANLAK", label: "STRATEGIC INTELLIGENCE",
    description: "Geopolitical context, structured reasoning and strategic intelligence assessments.",
    status: "PLANNED",
    purpose: "ANLAK is conceived as a structured analytical workspace for examining cyber developments within their wider geopolitical, economic and strategic context.",
    capabilities: [],
    roadmap: ["Structured analytical techniques and competing hypotheses", "Source evaluation, claims, assumptions and confidence", "Indicators of change and geopolitical context", "Current, rapid and periodic strategic intelligence products"],
  },
  {
    slug: "karargah", number: "03", name: "KARARGÂH", label: "DECISION SUPPORT",
    description: "Intelligence lifecycle visibility, management oversight and informed decision-making.",
    status: "PLANNED",
    purpose: "KARARGÂH is a proposed decision-support layer connecting intelligence requirements, analytical outputs and strategic planning.",
    capabilities: [],
    roadmap: ["Track intelligence requirements and production status", "Present assessments and uncertainty to decision-makers", "Support prioritization, planning and feedback", "Provide visibility across collection, analysis and dissemination"],
  },
  {
    slug: "intel-node", number: "04", name: "INTEL NODE", label: "INTELLIGENCE DATA INFRASTRUCTURE",
    description: "Continuous collection, evidence preservation, normalization and technical measurements.",
    status: "IN DEVELOPMENT",
    purpose: "BAYKUSH Intelligence Node is designed as shared infrastructure that collects approved public CTI data, preserves source truth and supplies evidence-based technical measurements to analytical workspaces.",
    capabilities: ["Documented source adapters for CISA KEV, NVD, FIRST EPSS, ThreatFox and MalwareBazaar", "Raw evidence preservation and deterministic normalization", "Collection checkpoints, recovery and explicit source semantics"],
    roadmap: ["Coverage-aware historical measurements and visualizations", "Support anomaly discovery without equating reporting volume with attack volume", "Expand approved source coverage and operational hardening"],
    repository: "https://github.com/CenkCTI/BAYKUSH-Intel-Node",
  },
  {
    slug: "rasat", number: "05", name: "RASAT", label: "REPORTS & RESEARCH",
    description: "Research papers, intelligence briefs and evidence-based assessments.",
    status: "PUBLICATION AREA",
    purpose: "RASAT is the planned public research and publication space of Project BAYKUSH. It is intended to make analytical work accessible, transparent and useful to readers.",
    capabilities: [],
    roadmap: ["Technical and tactical cyber threat briefs", "Operational threat and campaign assessments", "Strategic and geopolitical research", "Source citations, confidence and limitations in each publication"],
  },
];

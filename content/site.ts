export const cta = {
  primary: "Book an intro call",
  secondary: "Explore capabilities",
  mailto:
    "mailto:hello@qubnexa.com?subject=Intro%20call%20%E2%80%94%20QubNexa",
} as const;

export const nav = {
  brand: "QubNexa",
  links: [
    { label: "Build", href: "#build" },
    { label: "Automate", href: "#automate" },
    { label: "Intelligence", href: "#intelligence" },
  ],
} as const;

export const hero = {
  index: "01",
  eyebrowParts: ["AI", "Automation", "Innovation"] as const,
  lines: ["Build Better.", "Automate Smarter.", "Grow Faster."] as const,
  supporting:
    "QubNexa builds the digital systems your business runs on, automates the workflows that slow it down, and applies AI where it creates practical value.",
  summary:
    "QubNexa connects digital systems, automation and AI to help businesses operate better and grow faster. The QubNexa mark assembles from pixel modules, a ribbon ring and a directional blade: the system is coming online.",
} as const;

export const build = {
  index: "02",
  eyebrow: "Build",
  title: "Digital foundations.",
  intro:
    "QubNexa builds the infrastructure businesses operate on — from your public site to the software that runs your operations.",
  tracks: [
    {
      id: "websites",
      label: "Websites",
      headline: "Your site is infrastructure.",
      description:
        "Fast, findable, built to convert. We engineer websites as the foundation of your digital presence — not as a brochure.",
    },
    {
      id: "applications",
      label: "Applications",
      headline: "Software that runs the business.",
      description:
        "Web and mobile applications that carry core operations — tools your team actually works in every day.",
    },
    {
      id: "saas",
      label: "SaaS",
      headline: "Products, from first version to scale.",
      description:
        "We build and evolve SaaS platforms — from a focused MVP to an architecture that grows with your customer base.",
    },
    {
      id: "custom",
      label: "Custom Software",
      headline: "Shaped to your workflow.",
      description:
        "When off-the-shelf stops fitting, we build systems around the way your business actually works.",
    },
  ],
  summary:
    "Build: digital foundations. The mark separates into capability modules — websites, applications, SaaS platforms and custom software that businesses operate on.",
} as const;

export const automate = {
  index: "03",
  eyebrow: "Automate",
  title: "Connected business systems.",
  intro:
    "We connect the systems you already run — CRM, sales, marketing, operations, data, finance, support — and remove the repetitive manual work between them.",
  systems: [
    "CRM",
    "Sales",
    "Marketing",
    "Operations",
    "Data",
    "Finance",
    "Support",
  ] as const,
  stages: [
    {
      id: "input",
      label: "Input",
      description: "Every system that touches your business, connected.",
    },
    {
      id: "processing",
      label: "Processing",
      description: "Data moves between systems without manual work.",
    },
    {
      id: "action",
      label: "Action",
      description: "Workflows trigger the next step on their own.",
    },
    {
      id: "outcome",
      label: "Outcome",
      description: "Every connection reports back — ready to improve.",
    },
  ],
  summary:
    "Automate: connected business systems. CRM, sales, marketing, operations, data, finance and support link into workflows that run in stages — input, processing, action, outcome — without repetitive manual work.",
} as const;

export const intelligence = {
  index: "04",
  eyebrow: "Intelligence",
  title: "The intelligence layer.",
  principle: [
    "Automation executes the workflow.",
    "AI makes it intelligent.",
  ] as const,
  intro:
    "Decision nodes attach to your workflows where judgment is needed — so the system does not just move work along, it moves the right work forward.",
  capabilities: [
    {
      name: "AI agents",
      description: "Autonomous workers for repeatable multi-step tasks.",
    },
    {
      name: "AI workflows",
      description: "Automation steps that adapt based on content and context.",
    },
    {
      name: "AI assistants",
      description: "Interfaces your team can ask in plain language.",
    },
    {
      name: "Document intelligence",
      description: "Reading, structuring and routing documents automatically.",
    },
    {
      name: "Classification & extraction",
      description: "Turning unstructured input into structured, usable data.",
    },
    {
      name: "Decision support",
      description: "Signals and recommendations at the point of decision.",
    },
    {
      name: "Natural-language interfaces",
      description: "Plain-language access to your systems and data.",
    },
  ],
  summary:
    "Intelligence: the AI layer inside automation. Decision nodes attach to the workflow — gather, decide, act — so automation executes the work and AI makes it intelligent.",
} as const;

export const rail = {
  items: [
    { index: "01", label: "Hero", href: "hero" },
    { index: "02", label: "Build", href: "build" },
    { index: "03", label: "Automate", href: "automate" },
    { index: "04", label: "Intelligence", href: "intelligence" },
  ],
} as const;

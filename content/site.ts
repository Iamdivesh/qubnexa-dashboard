export const cta = {
  primary: "Book an intro call",
  secondary: "Explore capabilities",
  mailto:
    "mailto:hello@qubnexa.com?subject=Intro%20call%20%E2%80%94%20QubNexa",
  /** Short label used below md, where the nav shows brand + CTA only. */
  primaryShort: "Book a call",
} as const;

export const nav = {
  brand: "QubNexa",
  links: [
    { label: "Build", href: "#build" },
    { label: "Automate", href: "#automate" },
    { label: "Intelligence", href: "#intelligence" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
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

export const grow = {
  index: "05",
  eyebrow: "Grow",
  title: "Growth, engineered.",
  intro:
    "Connected channels arrange around one operating core. The outcome is not a campaign or a dashboard — it is a business that runs with more capacity than it had before.",
  channels: [
    "Marketing",
    "Sales",
    "CRM",
    "Operations",
    "Customer",
    "Data",
    "AI",
  ] as const,
  outcomes: [
    {
      label: "Faster operations",
      description: "Work moves between systems without waiting on anyone.",
    },
    {
      label: "Fewer manual tasks",
      description: "Repetitive work is removed, not redistributed.",
    },
    {
      label: "Better customer experience",
      description: "Every touchpoint draws from the same connected system.",
    },
    {
      label: "More efficient teams",
      description: "People spend their time on judgment, not data entry.",
    },
    {
      label: "Scalable processes",
      description: "What works once keeps working as volume grows.",
    },
    {
      label: "Better use of data",
      description: "Decisions draw on the whole system, not one silo.",
    },
    {
      label: "Increased capacity",
      description: "The same team handles more, without growing headcount first.",
    },
  ],
  link: { label: "See how we work", href: "#process" },
  summary:
    "Grow: business outcomes. Channels — marketing, sales, CRM, operations, customer, data, AI — arrange around one operating core, producing faster operations, fewer manual tasks and increased capacity.",
} as const;

export const connected = {
  index: "06",
  eyebrow: "Connected Systems",
  thesis: ["Not services.", "A connected system."] as const,
  summary:
    "Connected systems: modules, workflows, intelligence nodes and channels converge back into the mark — everything QubNexa builds reconnects into one operating system for the business.",
} as const;

export const services = {
  index: "07",
  eyebrow: "Services",
  title: "The index.",
  intro:
    "Six practices, one operating logic. Every service exists to connect into the same system — not to ship in isolation.",
  rows: [
    {
      id: "web-platforms",
      name: "Web Platforms",
      what: "High-performance websites and web platforms built as infrastructure.",
      problem:
        "Your public presence loads slowly, ranks poorly and converts visitors inconsistently.",
      does: "We design, build and operate fast, findable web platforms engineered around your conversion path.",
      get: "A digital front door that performs under load and turns traffic into qualified demand.",
      tech: ["Next.js", "React", "Headless CMS", "Vercel"],
    },
    {
      id: "applications",
      name: "Applications",
      what: "Web and mobile applications that carry core operations.",
      problem:
        "Critical workflows still live in spreadsheets, email threads and tribal knowledge.",
      does: "We build custom web and mobile applications around the way your team actually works.",
      get: "Software your team relies on daily instead of working around.",
      tech: ["React Native", "TypeScript", "PostgreSQL"],
    },
    {
      id: "saas-custom-software",
      name: "SaaS & Custom Software",
      what: "SaaS products and tailored software systems, from MVP to scale.",
      problem:
        "Off-the-shelf tools stop fitting, and building product feels out of reach.",
      does: "We architect, build and evolve products — from a focused first version to an architecture that grows.",
      get: "A product and codebase that scale with your customers instead of against them.",
      tech: ["Node.js", "Cloud Infrastructure", "CI/CD"],
    },
    {
      id: "business-automation",
      name: "Business Automation",
      what: "Workflow automation across the systems your business already runs.",
      problem:
        "Repetitive manual work accumulates between CRM, sales, marketing, operations, finance and support.",
      does: "We map your workflows and automate the handoffs, notifications and data movement between tools.",
      get: "Hours returned every week and processes that run the same way every time.",
      tech: ["n8n", "Make", "Zapier", "API Integrations"],
    },
    {
      id: "ai-integration",
      name: "AI Integration",
      what: "The AI layer inside your automation — where it creates practical value.",
      problem:
        "Workflows execute steps but still need human judgment at every decision point.",
      does: "We attach AI agents, document intelligence and decision support directly onto your existing workflows.",
      get: "Automation that doesn't just move work along — it moves the right work forward.",
      tech: ["LLMs", "RAG Pipelines", "AI Agents"],
    },
    {
      id: "data-integrations",
      name: "Data & Integrations",
      what: "Connecting your tools and data into one coherent picture.",
      problem:
        "Data lives in silos, so no one sees the whole business at once.",
      does: "We integrate your systems and build reporting pipelines that keep every tool consistent.",
      get: "Decisions made from one source of truth instead of five partial ones.",
      tech: ["ETL Pipelines", "Warehousing", "Dashboards"],
    },
  ],
  rowLinkLabel: "Discuss this service",
  summary:
    "Services: the index. Web platforms, applications, SaaS and custom software, business automation, AI integration, data and integrations — each answering what it is, the problem it solves, what QubNexa does and what the business gets.",
} as const;

export const process = {
  index: "08",
  eyebrow: "Process",
  title: "How we work.",
  intro:
    "One engagement model, four stages. You always know where things stand and what happens next.",
  steps: [
    {
      id: "discover",
      label: "Discover",
      description: "Understand the business, workflow and bottlenecks.",
      shift: "Uncertainty → clarity",
    },
    {
      id: "architect",
      label: "Architect",
      description: "Design the right digital system and automation architecture.",
      shift: "Clarity → system",
    },
    {
      id: "build",
      label: "Build",
      description: "Implement, integrate and test.",
      shift: "System → execution",
    },
    {
      id: "scale",
      label: "Scale",
      description: "Measure, improve and expand.",
      shift: "Execution → growth",
    },
  ] as const,
  principlesEyebrow: "Why QubNexa",
  principles: [
    {
      label: "Connected thinking",
      line: "Every piece is designed as part of the whole system.",
    },
    {
      label: "Senior precision",
      line: "Experienced hands on every layer, from architecture to detail.",
    },
    {
      label: "Velocity with control",
      line: "Fast iterations inside a disciplined engineering process.",
    },
    {
      label: "Measured outcomes",
      line: "Success defined up front, then measured against reality.",
    },
  ],
  summary:
    "Process: how QubNexa works. Discover, architect, build, scale — backed by connected thinking, senior precision, velocity with control and measured outcomes.",
} as const;

export const finalCta = {
  index: "09",
  eyebrow: "Get Started",
  tagline: ["Build Better.", "Automate Smarter.", "Grow Faster."] as const,
  supporting:
    "Tell us where the friction is. We'll come back with an honest read on what's worth building — and what isn't.",
  expectations: [
    { step: "Intro call", detail: "30 minutes on your business and bottlenecks." },
    { step: "Scope", detail: "We map the right system and the smallest useful first step." },
    { step: "Proposal", detail: "A clear plan, timeline and price. No surprises." },
  ],
  form: {
    heading: "Book an intro call",
    interests: [
      "Web platforms",
      "Applications",
      "SaaS & custom software",
      "Business automation",
      "AI integration",
      "Data & integrations",
      "Not sure yet",
    ] as const,
    submitLabel: "Send request",
    successTitle: "Request received.",
    successBody:
      "Thanks — we'll be in touch within one business day to schedule your intro call.",
    mailtoLabel: "Prefer email? hello@qubnexa.com",
  },
  summary:
    "Final CTA: book an intro call. Intro call, scope, proposal — zero uncertainty about what happens after you contact us.",
} as const;

export const footer = {
  legal: "© QubNexa. All rights reserved.",
  links: [
    { label: "Build", href: "#build" },
    { label: "Automate", href: "#automate" },
    { label: "Intelligence", href: "#intelligence" },
  ],
} as const;

export const rail = {
  items: [
    { index: "01", label: "Hero", href: "hero" },
    { index: "02", label: "Build", href: "build" },
    { index: "03", label: "Automate", href: "automate" },
    { index: "04", label: "Intelligence", href: "intelligence" },
    { index: "05", label: "Grow", href: "grow" },
    { index: "06", label: "Connected Systems", href: "connected" },
    { index: "07", label: "Services", href: "services" },
    { index: "08", label: "Process", href: "process" },
    { index: "09", label: "Contact", href: "cta" },
  ],
} as const;

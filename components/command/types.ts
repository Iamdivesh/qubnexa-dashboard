export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgSubtle: string;
  borderColor: string;
  accentColor: string;
  status: "operational" | "degraded" | "down";
  lastRun: string;
  leadCount?: number;
  readyToContact?: number;
  needEnrichment?: number;
  topScore?: number;
  avgScore?: number;
  totalPages?: number;
  currentPage?: number;
  stages?: Record<string, number>;
  sentToday?: number;
  repliedToday?: number;
  bookedToday?: number;
  totalSent?: number;
  totalReplied?: number;
  totalBooked?: number;
  responseRate?: number;
  mrr?: number;
  activeClients?: number;
  trialClients?: number;
  atRiskClients?: number;
  dealsClosedThisMonth?: number;
  setupFeesCollected?: number;
  activeAutomations?: number;
  trialAutomations?: number;
  totalClientAutomations?: number;
  scrapesToday?: number;
  systemHealth?: string;
  totalIdeas?: number;
  shortlisted?: number;
  readyToBuild?: number;
  sold?: number;
  watchlistCount?: number;
  draftsReady?: number;
  draftsPosted?: number;
  linkedinDrafts?: number;
  xDrafts?: number;
  instagramDrafts?: number;
  projectsInProgress?: number;
  completedThisMonth?: number;
  openTickets?: number;
  devAgentsConnected?: number;
  highlights: string[];
  actions: string[];
  quickStats: { label: string; value: string; change?: string }[];
  topLeads?: string[];
  churnedClients?: number;
}

export interface ActivityItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
  time: string;
  department: string;
}

export interface TargetMetric {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: string;
}
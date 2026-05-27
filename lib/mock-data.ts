import {
  BadgeCheck,
  Blocks,
  Code2,
  GitBranch,
  RadioTower,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type QuestStatus = "Open" | "Reviewing" | "Awarded";
export type SubmissionStatus = "Pending" | "Approved" | "Rejected";
export type ProofType = "GitHub" | "Contract" | "Demo" | "Transaction";
export type BadgeIconKey = "shield" | "badge" | "radio";

export type Quest = {
  id: string;
  title: string;
  organizer: string;
  sponsor: string;
  difficulty: "Starter" | "Intermediate" | "Advanced";
  reward: string;
  due: string;
  status: QuestStatus;
  category: string;
  summary: string;
  brief: string;
  requirements: string[];
  acceptedProofs: string[];
  metrics: {
    submissions: number;
    approvals: number;
    badges: number;
  };
};

export type Submission = {
  id: string;
  questId: string;
  builder: string;
  address: string;
  proofType: ProofType;
  proofLink: string;
  submittedAt: string;
  status: SubmissionStatus;
  notes: string;
};

export type Badge = {
  id: string;
  questId: string;
  title: string;
  status: SubmissionStatus;
  issuer: string;
  issuedAt: string;
  chain: string;
  txHash: string;
  summary: string;
  evidence: string;
  builderAddress: string;
  icon: BadgeIconKey;
};

export const quests: Quest[] = [
  {
    id: "agentic-audit",
    title: "Ship an Agentic Audit Trail",
    organizer: "Portaldot Core",
    sponsor: "Portaldot Online Mini Hackathon",
    difficulty: "Advanced",
    reward: "Verified Builder Badge + 650 PORTAL",
    due: "May 30, 2026",
    status: "Open",
    category: "AI x Infra",
    summary:
      "Build a technical proof that records AI-assisted changes, tests, and deployment evidence in a public repo.",
    brief:
      "Create a small service or app that captures what changed, who reviewed it, and which checks passed. Judges should be able to inspect the repo, run the project, and see a clear proof trail.",
    requirements: [
      "Public GitHub repository with setup instructions",
      "At least one passing automated check",
      "Evidence page or log showing build, review, and deploy steps",
      "Short demo video or hosted preview link",
    ],
    acceptedProofs: ["GitHub repo", "Demo video", "Transaction hash"],
    metrics: { submissions: 18, approvals: 7, badges: 7 },
  },
  {
    id: "proof-of-deploy",
    title: "Proof-of-Deploy Contract Quest",
    organizer: "Portaldot Labs",
    sponsor: "Portaldot Labs",
    difficulty: "Intermediate",
    reward: "On-chain Deployment Badge",
    due: "May 29, 2026",
    status: "Reviewing",
    category: "Smart Contracts",
    summary:
      "Deploy a minimal contract and submit the address, explorer link, and repository that proves reproducibility.",
    brief:
      "Builders must show that their deployment can be traced back to source. The proof should include contract address, deployment transaction, source code, and a repeatable script.",
    requirements: [
      "Verified contract or source included in repo",
      "Deployment transaction hash",
      "README with network, compiler, and script details",
      "One screenshot or demo showing contract interaction",
    ],
    acceptedProofs: ["Contract address", "Transaction hash", "GitHub repo"],
    metrics: { submissions: 31, approvals: 16, badges: 16 },
  },
  {
    id: "builder-identity",
    title: "Composable Builder Profile",
    organizer: "BuildProof Guild",
    sponsor: "BuildProof",
    difficulty: "Starter",
    reward: "Identity Builder Badge",
    due: "May 31, 2026",
    status: "Open",
    category: "Profiles",
    summary:
      "Create a builder profile page that displays verified work, links, and proof metadata in a clean interface.",
    brief:
      "Design and implement a profile that helps organizers quickly understand what a builder has shipped. The profile should make verified badges and evidence links obvious.",
    requirements: [
      "Responsive profile page",
      "At least three proof links",
      "Verified badge display",
      "Clear call to submit future proof",
    ],
    acceptedProofs: ["GitHub repo", "Demo video"],
    metrics: { submissions: 12, approvals: 5, badges: 5 },
  },
];

export const submissions: Submission[] = [
  {
    id: "sub-108",
    questId: "agentic-audit",
    builder: "Jayden Okafor",
    address: "0x9A12...B80F",
    proofType: "GitHub",
    proofLink: "https://github.com/jayden/build-proof-trails",
    submittedAt: "Today, 10:42",
    status: "Pending",
    notes:
      "Repo includes test logs, deployment link, and a two-minute demo of the evidence timeline.",
  },
  {
    id: "sub-107",
    questId: "proof-of-deploy",
    builder: "Mina Park",
    address: "0x5D44...19CE",
    proofType: "Contract",
    proofLink: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    submittedAt: "Yesterday, 18:06",
    status: "Approved",
    notes: "Contract verified, deployment script reproducible, badge ready to mint.",
  },
  {
    id: "sub-106",
    questId: "builder-identity",
    builder: "Ayo Mensah",
    address: "0x2F18...4C9A",
    proofType: "Demo",
    proofLink: "https://buildproof-demo.vercel.app/profile/0x2F18",
    submittedAt: "Yesterday, 12:21",
    status: "Approved",
    notes: "Clean profile UX with clear badge metadata and proof links.",
  },
  {
    id: "sub-105",
    questId: "proof-of-deploy",
    builder: "Nora Chen",
    address: "0x88B1...701D",
    proofType: "Transaction",
    proofLink: "0xbeef...92a1",
    submittedAt: "May 25, 2026",
    status: "Rejected",
    notes: "Missing public source repo. Asked builder to resubmit with reproducible script.",
  },
];

export const badges: Badge[] = [
  {
    id: "badge-01",
    questId: "proof-of-deploy",
    title: "Proof-of-Deploy",
    status: "Approved",
    issuer: "Portaldot Labs",
    issuedAt: "May 26, 2026",
    chain: "Portaldot Testnet",
    txHash: "0x7e31...aa90",
    summary:
      "Verified reproducible smart contract deployment with source, script, and transaction evidence.",
    evidence: "Contract source, deployment hash, and README checked by organizer.",
    builderAddress: "0x5D44...19CE",
    icon: "shield",
  },
  {
    id: "badge-02",
    questId: "builder-identity",
    title: "Composable Identity",
    status: "Approved",
    issuer: "BuildProof Guild",
    issuedAt: "May 26, 2026",
    chain: "Portaldot Testnet",
    txHash: "0x41b9...0fd2",
    summary:
      "Verified profile implementation showing shipped work, proof links, and badge metadata.",
    evidence: "Responsive profile demo and public repository reviewed.",
    builderAddress: "0x2F18...4C9A",
    icon: "badge",
  },
  {
    id: "badge-03",
    questId: "agentic-audit",
    title: "Audit Trail Pioneer",
    status: "Pending",
    issuer: "Portaldot Core",
    issuedAt: "Pending",
    chain: "Portaldot Testnet",
    txHash: "Queued after approval",
    summary:
      "Pending credential for an AI-assisted audit trail with build, review, and deploy evidence.",
    evidence: "Organizer review in progress for repository, tests, and demo video.",
    builderAddress: "0x9A12...B80F",
    icon: "radio",
  },
];

export const badgeIcons: Record<BadgeIconKey, LucideIcon> = {
  shield: ShieldCheck,
  badge: BadgeCheck,
  radio: RadioTower,
};

export const proofTypes = [
  { label: "GitHub repo", icon: GitBranch },
  { label: "Contract address", icon: Blocks },
  { label: "Demo video", icon: Code2 },
  { label: "Transaction hash", icon: ShieldCheck },
];

export const featuredAddress = "0x2F18...4C9A";

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  badges as defaultBadges,
  quests as defaultQuests,
  submissions as defaultSubmissions,
  type Badge,
  type ProofType,
  type Quest,
  type Submission,
  type SubmissionStatus,
} from "@/lib/mock-data";

const STORAGE_KEY = "buildproof-local-state-v1";

type BuildProofState = {
  quests: Quest[];
  submissions: Submission[];
  badges: Badge[];
};

type Toast = {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info";
};

type CreateQuestInput = Omit<Quest, "id" | "status" | "metrics">;

type SubmitProofInput = {
  questId: string;
  builder: string;
  address: string;
  proofType: ProofType;
  proofLink: string;
  notes: string;
};

type BuildProofContextValue = BuildProofState & {
  isReady: boolean;
  toasts: Toast[];
  createQuest: (input: CreateQuestInput) => Quest;
  submitProof: (input: SubmitProofInput) => Submission;
  reviewSubmission: (submissionId: string, status: Exclude<SubmissionStatus, "Pending">) => void;
  notify: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

const defaultState: BuildProofState = {
  quests: defaultQuests,
  submissions: defaultSubmissions,
  badges: defaultBadges,
};

const BuildProofContext = createContext<BuildProofContextValue | null>(null);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nowLabel() {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function shortHash(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, "0")}...demo`;
}

export function BuildProofProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuildProofState>(defaultState);
  const [isReady, setIsReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setState(JSON.parse(stored) as BuildProofState);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [isReady, state]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const createQuest = useCallback(
    (input: CreateQuestInput) => {
      const baseId = slugify(input.title) || "quest";
      const quest: Quest = {
        ...input,
        id: `${baseId}-${Date.now().toString(36)}`,
        status: "Open",
        metrics: { submissions: 0, approvals: 0, badges: 0 },
      };

      setState((current) => ({
        ...current,
        quests: [quest, ...current.quests],
      }));
      pushToast({
        type: "success",
        title: "Quest created",
        description: "Your quest is now available on the quest board.",
      });
      return quest;
    },
    [pushToast],
  );

  const submitProof = useCallback(
    (input: SubmitProofInput) => {
      const submission: Submission = {
        ...input,
        id: `sub-${Date.now().toString(36)}`,
        submittedAt: nowLabel(),
        status: "Pending",
      };

      setState((current) => ({
        ...current,
        submissions: [submission, ...current.submissions],
        quests: current.quests.map((quest) =>
          quest.id === input.questId
            ? {
                ...quest,
                status: "Reviewing",
                metrics: {
                  ...quest.metrics,
                  submissions: quest.metrics.submissions + 1,
                },
              }
            : quest,
        ),
      }));
      pushToast({
        type: "success",
        title: "Proof submitted",
        description: "The submission is now waiting in the review queue.",
      });
      return submission;
    },
    [pushToast],
  );

  const reviewSubmission = useCallback(
    (submissionId: string, status: Exclude<SubmissionStatus, "Pending">) => {
      setState((current) => {
        const submission = current.submissions.find((item) => item.id === submissionId);
        const quest = submission
          ? current.quests.find((item) => item.id === submission.questId)
          : undefined;

        if (!submission || !quest) {
          pushToast({
            type: "error",
            title: "Review failed",
            description: "Could not find the submission to review.",
          });
          return current;
        }

        const wasApproved = submission.status === "Approved";
        const nextSubmissions = current.submissions.map((item) =>
          item.id === submissionId ? { ...item, status } : item,
        );
        const shouldCreateBadge =
          status === "Approved" &&
          !current.badges.some(
            (badge) => badge.questId === quest.id && badge.builderAddress === submission.address,
          );

        const nextBadge: Badge | null = shouldCreateBadge
          ? {
              id: `badge-${Date.now().toString(36)}`,
              questId: quest.id,
              title: `${quest.title} Credential`,
              status: "Approved",
              issuer: quest.organizer,
              issuedAt: nowLabel(),
              chain: "Portaldot Testnet",
              txHash: shortHash(`${submission.id}-${submission.proofLink}`),
              summary: `Verified proof-of-work for ${quest.title}.`,
              evidence: `${submission.proofType} proof reviewed: ${submission.proofLink}`,
              builderAddress: submission.address,
              icon: "shield",
            }
          : null;

        return {
          ...current,
          submissions: nextSubmissions,
          badges: nextBadge ? [nextBadge, ...current.badges] : current.badges,
          quests: current.quests.map((item) =>
            item.id === quest.id
              ? {
                  ...item,
                  status: status === "Approved" ? "Awarded" : item.status,
                  metrics: {
                    ...item.metrics,
                    approvals:
                      status === "Approved" && !wasApproved
                        ? item.metrics.approvals + 1
                        : item.metrics.approvals,
                    badges: nextBadge ? item.metrics.badges + 1 : item.metrics.badges,
                  },
                }
              : item,
          ),
        };
      });

      pushToast({
        type: status === "Approved" ? "success" : "info",
        title: status === "Approved" ? "Submission approved" : "Submission rejected",
        description:
          status === "Approved"
            ? "A verified badge was added to the builder profile."
            : "The submission status has been updated.",
      });
    },
    [pushToast],
  );

  const value = useMemo(
    () => ({
      ...state,
      isReady,
      toasts,
      createQuest,
      submitProof,
      reviewSubmission,
      notify: pushToast,
      dismissToast,
    }),
    [createQuest, dismissToast, isReady, pushToast, reviewSubmission, state, submitProof, toasts],
  );

  return <BuildProofContext.Provider value={value}>{children}</BuildProofContext.Provider>;
}

export function useBuildProof() {
  const context = useContext(BuildProofContext);
  if (!context) {
    throw new Error("useBuildProof must be used inside BuildProofProvider");
  }
  return context;
}

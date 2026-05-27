"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Check, ClipboardCheck, ExternalLink, ShieldAlert, X } from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubmissionStatus } from "@/lib/mock-data";

const statusClass: Record<SubmissionStatus, string> = {
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  Approved: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  Rejected: "border-red-300/40 bg-red-400/10 text-red-100",
};

export default function ReviewPage() {
  const router = useRouter();
  const { quests, submissions, reviewSubmission, isReady } = useBuildProof();
  const pendingCount = submissions.filter((item) => item.status === "Pending").length;
  const approvedCount = submissions.filter((item) => item.status === "Approved").length;

  function approve(submissionId: string, address: string) {
    reviewSubmission(submissionId, "Approved");
    window.setTimeout(() => {
      router.push(`/profile/${encodeURIComponent(address)}`);
    }, 450);
  }

  return (
    <PageShell className="space-y-8">
      <SectionHeading
        eyebrow="Organizer review"
        title="Approve proof, trigger a verified badge"
        description="Review local submissions, approve or reject them, and create verified profile credentials before blockchain integration."
      />
      {!isReady ? <LoadingState /> : null}
      {isReady && submissions.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No submissions yet"
          description="Submit proof from a quest detail page and it will appear here for organizer review."
          action={
            <Link href="/quests">
              <Button>Open quests</Button>
            </Link>
          }
        />
      ) : null}
      {isReady && submissions.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {submissions.map((submission) => {
              const quest = quests.find((item) => item.id === submission.questId);
              return (
                <Card key={submission.id} className="bg-card">
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={statusClass[submission.status]}>
                            {submission.status}
                          </Badge>
                          <Badge>{submission.proofType}</Badge>
                        </div>
                        <CardTitle className="mt-3">{submission.builder}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {quest?.title ?? "Unknown quest"} • {submission.submittedAt}
                        </p>
                      </div>
                      <Link href={`/quests/${submission.questId}`}>
                        <Button variant="outline" size="sm">
                          Quest
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border border-slate-700 bg-slate-950/30 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                        Proof link
                      </p>
                      <p className="mt-2 break-all text-sm text-muted-foreground">
                        {submission.proofLink}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{submission.notes}</p>
                    {submission.status === "Pending" ? (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={() => approve(submission.id, submission.address)}>
                          <Check className="h-4 w-4" />
                          Approve and mint badge
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => reviewSubmission(submission.id, "Rejected")}
                        >
                          <X className="h-4 w-4" />
                          Reject proof
                        </Button>
                      </div>
                    ) : (
                      <Link href={`/profile/${encodeURIComponent(submission.address)}`}>
                        <Button variant="outline">
                          View builder profile
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <aside className="space-y-5">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Review queue</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-md bg-slate-950/30 p-4">
                  <p className="text-3xl font-black">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending review</p>
                </div>
                <div className="rounded-md bg-slate-950/30 p-4">
                  <p className="text-3xl font-black">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved proofs</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-sky-400/20 bg-sky-400/10">
              <CardContent className="p-5">
                <ShieldAlert className="mb-4 h-7 w-7 text-sky-200" />
                <h2 className="text-xl font-black">MVP reviewer promise</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The organizer only needs to answer one question: does the proof
                  satisfy the quest requirements?
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-400/20 bg-emerald-400/10">
              <CardContent className="p-5">
                <BadgeCheck className="mb-4 h-7 w-7 text-emerald-200" />
                <h2 className="text-xl font-black">Badge preview</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Approval adds a local verified badge to the builder profile with
                  issuer, evidence, chain, and transaction-style metadata.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : null}
    </PageShell>
  );
}

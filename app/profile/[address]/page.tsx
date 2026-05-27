"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  Github,
  Medal,
  RadioTower,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeIcons, type SubmissionStatus } from "@/lib/mock-data";

const badgeStateStyles: Record<
  SubmissionStatus,
  {
    label: string;
    badge: string;
    icon: string;
    card: string;
  }
> = {
  Approved: {
    label: "Verified",
    badge: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
    icon: "border-sky-400/30 bg-sky-400/10 text-sky-200",
    card: "hover:border-sky-400/50",
  },
  Pending: {
    label: "Pending",
    badge: "border-amber-300/40 bg-amber-400/10 text-amber-100",
    icon: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    card: "hover:border-amber-400/50",
  },
  Rejected: {
    label: "Rejected",
    badge: "border-red-300/40 bg-red-400/10 text-red-100",
    icon: "border-red-400/30 bg-red-400/10 text-red-200",
    card: "hover:border-red-400/50",
  },
};

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const { badges, quests, submissions, isReady } = useBuildProof();
  const cleanAddress = decodeURIComponent(params.address);
  const profileBadges = badges.filter((badge) => badge.builderAddress === cleanAddress);
  const approved = submissions.filter(
    (submission) => submission.address === cleanAddress && submission.status === "Approved",
  );

  if (!isReady) {
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8">
      <Link
        href="/quests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quests
      </Link>
      <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <Card className="overflow-hidden bg-card">
            <div className="h-28 border-b border-slate-700 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.9)),linear-gradient(90deg,#0B1020,#111827)]" />
            <CardContent className="-mt-10 p-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-sky-400/40 bg-[#0B1020] shadow-glow">
                <WalletCards className="h-9 w-9 text-sky-200" />
              </div>
              <h1 className="mt-5 text-3xl font-black">Ayo Mensah</h1>
              <p className="mt-2 text-sm font-semibold text-sky-200">
                Verified technical contributor on Portaldot.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{cleanAddress}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>
                  <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                  Verified builder
                </Badge>
                <Badge className="border-sky-400/30 bg-sky-400/10 text-sky-100">
                  Portaldot Testnet
                </Badge>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Frontend and smart-contract builder with reviewed repositories,
                deployment evidence, and repeatable technical proofs.
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Link href="/quests">
                  <Button size="sm">Find quests</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Builder stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-slate-950/30 p-3">
                <p className="font-black">{approved.length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="rounded-md bg-slate-950/30 p-3">
                <p className="font-black">{profileBadges.length}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
              <div className="rounded-md bg-slate-950/30 p-3">
                <p className="font-black">{profileBadges.length > 0 ? "96%" : "0%"}</p>
                <p className="text-xs text-muted-foreground">Proof score</p>
              </div>
            </CardContent>
          </Card>
        </aside>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-sky-300">
              Builder credentials
            </p>
            <h2 className="mt-2 text-3xl font-black">Verified builder profile</h2>
          </div>
          {profileBadges.length === 0 ? (
            <EmptyState
              icon={Medal}
              title="No badges on this profile yet"
              description="Approve a submission for this address and the generated credential will appear here."
              action={
                <Link href="/review">
                  <Button>Open review queue</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {profileBadges.map((badge) => {
                const Icon = badgeIcons[badge.icon];
                const quest = quests.find((item) => item.id === badge.questId);
                const state = badgeStateStyles[badge.status];
                return (
                  <Card
                    key={badge.id}
                    className={`bg-card transition ${state.card} flex h-full flex-col`}
                  >
                    <CardHeader className="min-h-42">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${state.icon}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge className={state.badge}>{state.label}</Badge>
                      </div>

                      <CardTitle className="line-clamp-2">
                        {badge.title}
                      </CardTitle>

                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {badge.summary}
                      </p>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col space-y-4">
                      <div className="min-h-26 rounded-md border border-slate-700 bg-slate-950/30 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                          Proof reviewed
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {badge.evidence}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex min-h-11 justify-between gap-4 rounded-md bg-slate-950/30 p-3">
                          <span className="text-muted-foreground">Quest</span>
                          <span className="line-clamp-1 text-right font-semibold">
                            {quest?.title}
                          </span>
                        </div>

                        <div className="flex min-h-11 justify-between gap-4 rounded-md bg-slate-950/30 p-3">
                          <span className="text-muted-foreground">Issuer</span>
                          <span className="line-clamp-1 text-right font-semibold">
                            {badge.issuer}
                          </span>
                        </div>

                        <div className="flex min-h-11 justify-between gap-4 rounded-md bg-slate-950/30 p-3">
                          <span className="text-muted-foreground">Issued</span>
                          <span className="line-clamp-1 text-right font-semibold">
                            {badge.issuedAt}
                          </span>
                        </div>

                        <div className="flex min-h-11 justify-between gap-4 rounded-md bg-slate-950/30 p-3">
                          <span className="text-muted-foreground">Chain</span>
                          <span className="line-clamp-1 text-right font-semibold">
                            {badge.chain}
                          </span>
                        </div>

                        <div className="flex min-h-11 justify-between gap-4 rounded-md bg-slate-950/30 p-3">
                          <span className="text-muted-foreground">Tx</span>
                          <span className="line-clamp-1 text-right font-semibold">
                            {badge.txHash}
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" className="mt-auto w-full">
                        View badge proof
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
          <Card className="border-sky-400/20 bg-sky-400/10">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <RadioTower className="h-7 w-7 shrink-0 text-sky-200" />
                <div>
                  <h2 className="text-xl font-black">Ready for more proof</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Builder profiles make approved work easy for future
                    organizers to verify.
                  </p>
                </div>
              </div>
              <Link href="/quests">
                <Button>
                  Submit another proof
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

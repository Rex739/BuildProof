"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Code2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { PageShell } from "@/components/page-shell";
import { QuestCard } from "@/components/quest-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const flow = [
  {
    title: "Create quest",
    body: "Organizers publish a technical task with accepted proof types.",
    icon: ClipboardCheck,
  },
  {
    title: "Submit proof",
    body: "Builders attach a repo, contract, demo, or transaction hash.",
    icon: Code2,
  },
  {
    title: "Review work",
    body: "Judges inspect the evidence and approve or reject fast.",
    icon: ShieldCheck,
  },
  {
    title: "Mint badge",
    body: "Approved builders receive a verified on-chain badge.",
    icon: BadgeCheck,
  },
];

export default function Home() {
  const { quests, submissions } = useBuildProof();
  const featured = quests.slice(0, 2);
  const pending = submissions.filter((submission) => submission.status === "Pending").length;

  return (
    <PageShell className="space-y-14 pb-16">
      <section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge className="mb-5">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Portaldot-native proof-of-work verification
          </Badge>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            Verify builders by what they actually ship.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            BuildProof helps hackathon organizers create technical quests,
            review public evidence, and award verified on-chain badges to real
            builders.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quests">
              <Button size="lg">
                Explore quests
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/review">
              <Button size="lg" variant="outline">
                Review submissions
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] border border-sky-400/10 bg-sky-400/5 blur-xl" />
          <Card className="relative overflow-hidden bg-slate-900/90">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-sky-300">Live MVP board</p>
                  <CardTitle className="mt-1 text-2xl">Quest verification status</CardTitle>
                </div>
                <Badge className="border-slate-500/50 bg-slate-800 text-slate-100">
                  Demo data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {quests.map((quest) => (
                <Link
                  key={quest.id}
                  href={`/quests/${quest.id}`}
                  className="block rounded-lg border border-slate-700 bg-slate-950/35 p-4 transition hover:border-sky-400/50 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{quest.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{quest.organizer}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-md bg-slate-800/70 p-2">
                      <p className="font-black">{quest.metrics.submissions}</p>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                    </div>
                    <div className="rounded-md bg-slate-800/70 p-2">
                      <p className="font-black">{quest.metrics.approvals}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="rounded-md bg-slate-800/70 p-2">
                      <p className="font-black">{quest.metrics.badges}</p>
                      <p className="text-xs text-muted-foreground">Badged</p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-4">
                <p className="text-sm text-muted-foreground">Pending organizer reviews</p>
                <p className="mt-1 text-3xl font-black">{pending}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {flow.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="bg-card">
              <CardContent className="p-5">
                <Icon className="mb-4 h-6 w-6 text-sky-300" />
                <h2 className="font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-sky-300">
              Featured quests
            </p>
            <h2 className="mt-2 text-3xl font-black">Ready for builder proof</h2>
          </div>
          <Link href="/quests">
            <Button variant="outline">
              See all quests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

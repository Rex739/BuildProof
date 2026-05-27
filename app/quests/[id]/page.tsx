"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Send,
  WalletCards,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useBuildProof } from "@/components/buildproof-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProofType } from "@/lib/mock-data";

const proofTypeOptions: ProofType[] = ["GitHub", "Contract", "Demo", "Transaction"];

export default function QuestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { quests, submitProof, notify, isReady } = useBuildProof();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quest = quests.find((item) => item.id === params.id);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quest) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const proofLink = String(form.get("proofLink") || "").trim();
    if (!proofLink) {
      notify({
        type: "error",
        title: "Proof link required",
        description: "Add a repo, contract address, demo URL, or transaction hash.",
      });
      return;
    }

    setIsSubmitting(true);
    submitProof({
      questId: quest.id,
      builder: String(form.get("builder") || "Demo Builder").trim(),
      address: String(form.get("address") || "0xDEMO...BEEF").trim(),
      proofType: String(form.get("proofType") || "GitHub") as ProofType,
      proofLink,
      notes: String(form.get("notes") || "Submitted for organizer review.").trim(),
    });

    window.setTimeout(() => {
      router.push("/review");
    }, 450);
  }

  if (!isReady) {
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  }

  if (!quest) {
    return (
      <PageShell className="space-y-6">
        <Link
          href="/quests"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quests
        </Link>
        <EmptyState
          icon={ClipboardList}
          title="Quest not found"
          description="This quest may have been removed from local storage. Return to the quest board to pick another one."
          action={
            <Link href="/quests">
              <Button>Open quest board</Button>
            </Link>
          }
        />
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
      <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{quest.category}</Badge>
              <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-100">
                {quest.difficulty}
              </Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{quest.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {quest.brief}
            </p>
          </div>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Quest requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quest.requirements.map((requirement) => (
                  <div key={requirement} className="flex gap-3 rounded-md bg-slate-950/30 p-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-6 text-muted-foreground">{requirement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Accepted proof types</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {quest.acceptedProofs.map((proof) => (
                <Badge key={proof}>{proof}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-5">
          <Card className="bg-card">
            <CardHeader>
              <p className="text-sm font-semibold text-sky-300">{quest.organizer}</p>
              <CardTitle>Submit proof</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input name="builder" defaultValue="Ayo Mensah" placeholder="Builder name" />
                <Input name="address" defaultValue="0x2F18...4C9A" placeholder="Wallet address" />
                <select
                  name="proofType"
                  defaultValue="GitHub"
                  className="h-11 w-full rounded-md border border-input bg-slate-950/30 px-3 text-sm text-foreground outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {proofTypeOptions.map((proofType) => (
                    <option key={proofType}>{proofType}</option>
                  ))}
                </select>
                <Input
                  name="proofLink"
                  placeholder="Proof link, contract address, or transaction hash"
                  required
                />
                <Textarea name="notes" placeholder="Add a short note for the organizer" />
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit proof"}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <WalletCards className="h-4 w-4" />
                  Connect wallet placeholder
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Reward</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-200" />
                <div>
                  <p className="font-bold">{quest.reward}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Created locally after organizer approval.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-slate-950/30 p-3">
                  <p className="font-black">{quest.metrics.submissions}</p>
                  <p className="text-xs text-muted-foreground">Proofs</p>
                </div>
                <div className="rounded-md bg-slate-950/30 p-3">
                  <p className="font-black">{quest.metrics.approvals}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <div className="rounded-md bg-slate-950/30 p-3">
                  <p className="font-black">{quest.metrics.badges}</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </PageShell>
  );
}

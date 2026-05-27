"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarClock, ListChecks, Plus } from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { proofTypes, type Quest } from "@/lib/mock-data";

const acceptedProofLabels = proofTypes.map((proof) => proof.label);

export default function CreateQuestPage() {
  const router = useRouter();
  const { createQuest, notify } = useBuildProof();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const organizer = String(form.get("organizer") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const brief = String(form.get("brief") || "").trim();
    const requirements = String(form.get("requirements") || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!title || !organizer || !summary || !brief || requirements.length === 0) {
      notify({
        type: "error",
        title: "Quest needs a little more detail",
        description: "Add a title, organizer, summary, brief, and at least one requirement.",
      });
      return;
    }

    setIsSubmitting(true);
    const quest = createQuest({
      title,
      organizer,
      sponsor: organizer,
      difficulty: String(form.get("difficulty") || "Intermediate") as Quest["difficulty"],
      reward: String(form.get("reward") || "Verified Builder Badge"),
      due: String(form.get("due") || "May 30, 2026"),
      category: String(form.get("category") || "Developer Infra"),
      summary,
      brief,
      requirements,
      acceptedProofs: acceptedProofLabels,
    });

    window.setTimeout(() => {
      router.push(`/quests/${quest.id}`);
    }, 450);
  }

  return (
    <PageShell className="space-y-8">
      <SectionHeading
        eyebrow="Organizer cockpit"
        title="Create a technical quest"
        description="Define the technical work, proof requirements, and reward. The quest is stored locally for this MVP demo."
      />
      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Quest details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Quest title</span>
                  <Input name="title" defaultValue="Ship a verifiable builder proof" required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Organizer</span>
                  <Input name="organizer" defaultValue="Portaldot Core" required />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Category</span>
                  <Input name="category" defaultValue="Developer Infra" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Difficulty</span>
                  <select
                    name="difficulty"
                    defaultValue="Intermediate"
                    className="h-11 w-full rounded-md border border-input bg-slate-950/30 px-3 text-sm text-foreground outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  >
                    <option>Starter</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>
              </div>
              <label className="space-y-2 block">
                <span className="text-sm font-semibold">Short summary</span>
                <Input
                  name="summary"
                  defaultValue="Build and submit public technical evidence for organizer review."
                  required
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-semibold">Quest brief</span>
                <Textarea
                  name="brief"
                  defaultValue="Create a working technical demo, publish the proof, and include enough context for a reviewer to verify that the builder shipped the work."
                  required
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Due date</span>
                  <Input name="due" defaultValue="May 30, 2026" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Reward</span>
                  <Input name="reward" defaultValue="Verified Builder Badge" />
                </label>
              </div>
              <label className="space-y-2 block">
                <span className="text-sm font-semibold">Requirements</span>
                <Textarea
                  name="requirements"
                  defaultValue={
                    "Public GitHub repository\nDemo link or video\nClear setup instructions\nProof metadata for review"
                  }
                  required
                />
              </label>
              <div className="space-y-3">
                <p className="text-sm font-semibold">Accepted proof types</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {proofTypes.map((proof) => {
                    const Icon = proof.icon;
                    return (
                      <div
                        key={proof.label}
                        className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950/30 p-3"
                      >
                        <Icon className="h-5 w-5 text-sky-300" />
                        <span className="text-sm font-semibold">{proof.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" type="submit" disabled={isSubmitting}>
                  <Plus className="h-5 w-5" />
                  {isSubmitting ? "Publishing..." : "Publish quest"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/quests")}
                >
                  Preview board
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <aside className="space-y-5">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Judge-friendly setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["Simple scope", "One proof link should be enough to understand the builder's work."],
                ["Clear evidence", "Require repo, demo, contract, or transaction hash depending on the quest."],
                ["Fast approval", "Approved submissions immediately map to a badge in the local flow."],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-3 rounded-md bg-slate-950/30 p-3">
                  <ListChecks className="mt-0.5 h-5 w-5 text-sky-300" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-amber-400/20 bg-amber-400/10">
            <CardContent className="p-5">
              <Badge className="mb-4">
                <CalendarClock className="mr-2 h-3.5 w-3.5" />
                3-day MVP mode
              </Badge>
              <h2 className="text-xl font-black">No blockchain integration yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The full flow runs locally with browser storage so judges can click
                through the verification loop today.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                type="button"
                onClick={() => router.push("/review")}
              >
                Go to review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </PageShell>
  );
}

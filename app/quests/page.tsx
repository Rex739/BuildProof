"use client";

import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageShell } from "@/components/page-shell";
import { QuestCard } from "@/components/quest-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function QuestsPage() {
  const { quests, isReady } = useBuildProof();

  return (
    <PageShell className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Quest board"
          title="Technical quests that reward verified proof"
          description="Pick a quest, inspect the requirements, and submit a proof link that an organizer can review."
        />
        <Link href="/create">
          <Button size="lg">
            <Plus className="h-5 w-5" />
            Create quest
          </Button>
        </Link>
      </div>
      {!isReady ? <LoadingState /> : null}
      {isReady && quests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No quests yet"
          description="Create the first technical quest to start collecting proof-of-work submissions."
          action={
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4" />
                Create quest
              </Button>
            </Link>
          }
        />
      ) : null}
      {isReady && quests.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
}

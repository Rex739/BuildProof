import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quest } from "@/lib/mock-data";

export function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Card className="group flex h-full flex-col bg-card transition hover:-translate-y-1 hover:border-sky-400/50 hover:bg-slate-800/80">
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{quest.category}</Badge>
          <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-100">
            {quest.status}
          </Badge>
        </div>
        <CardTitle>{quest.title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{quest.summary}</p>
      </CardHeader>
      <CardContent className="mt-auto space-y-5">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-md bg-slate-950/30 p-3">
            <Users className="mb-2 h-4 w-4 text-sky-300" />
            <p className="font-bold">{quest.metrics.submissions}</p>
            <p className="text-xs text-muted-foreground">Proofs</p>
          </div>
          <div className="rounded-md bg-slate-950/30 p-3">
            <BadgeCheck className="mb-2 h-4 w-4 text-emerald-300" />
            <p className="font-bold">{quest.metrics.badges}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
          <div className="rounded-md bg-slate-950/30 p-3">
            <Clock className="mb-2 h-4 w-4 text-amber-300" />
            <p className="font-bold">{quest.due.split(",")[0]}</p>
            <p className="text-xs text-muted-foreground">Due</p>
          </div>
        </div>
        <Link href={`/quests/${quest.id}`}>
          <Button className="w-full">
            View quest
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

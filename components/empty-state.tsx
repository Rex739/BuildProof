import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed bg-card">
      <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-sky-400/30 bg-sky-400/10 text-sky-200">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

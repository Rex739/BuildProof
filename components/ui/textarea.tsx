import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-input bg-slate-950/30 px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20",
        className,
      )}
      {...props}
    />
  );
}

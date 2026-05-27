import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 text-xs font-semibold text-sky-100",
        className,
      )}
      {...props}
    />
  );
}

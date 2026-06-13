import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("flex min-h-28 w-full rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-3 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };

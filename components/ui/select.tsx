import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn("flex h-[42px] w-full rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };

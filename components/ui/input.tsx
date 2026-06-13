import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn("flex h-[42px] w-full rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]", className)}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };

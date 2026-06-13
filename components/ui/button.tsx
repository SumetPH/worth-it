"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-[var(--accent-foreground)] hover:border-[#5eead4] hover:bg-[#5eead4]",
        secondary: "border border-[var(--border)] bg-[var(--card-muted)] px-4 py-2 text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--card-raised)]",
        ghost: "border border-transparent px-3 py-2 text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--card-raised)]",
        destructive: "bg-[var(--danger)] px-4 py-2 text-white hover:opacity-90",
        outline: "border border-[var(--border)] bg-transparent px-4 py-2 text-[var(--foreground)] hover:bg-[var(--card-raised)]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };

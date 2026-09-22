import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-14 w-full rounded-2xl border border-border-strong bg-surface-strong/70 px-5 text-base text-foreground placeholder:text-muted-foreground/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

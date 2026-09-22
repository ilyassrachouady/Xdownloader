import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-accent-strong to-[color:var(--accent-glow)] text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.7)] hover:brightness-110 hover:shadow-[0_14px_40px_-10px_rgba(139,92,246,0.85)] active:scale-[0.98]",
        secondary:
          "bg-surface-strong text-foreground border border-border-strong hover:border-accent/50 hover:bg-surface",
        ghost:
          "hover:bg-surface-elevated text-muted",
        outline:
          "border border-border-strong bg-transparent hover:border-accent/50 hover:bg-surface-elevated/50 text-foreground",
        soft:
          "bg-accent/12 text-accent hover:bg-accent/20 border border-accent/25",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-7 text-base rounded-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

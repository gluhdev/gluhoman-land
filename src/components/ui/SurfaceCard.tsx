import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceCardVariants = cva(
  "rounded-2xl transition-shadow duration-300",
  {
    variants: {
      variant: {
        elevated:
          "bg-white border border-neutral-200/70 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)]",
        bordered: "bg-white border border-neutral-200",
        flat: "bg-neutral-50",
        glass:
          "bg-white/85 backdrop-blur-md border border-white/40 shadow-lg",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "elevated",
      padding: "md",
    },
  }
);

export interface SurfaceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceCardVariants> {
  asChild?: boolean;
}

export const SurfaceCard = React.forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(surfaceCardVariants({ variant, padding }), className)}
      {...props}
    />
  )
);
SurfaceCard.displayName = "SurfaceCard";

export { surfaceCardVariants };

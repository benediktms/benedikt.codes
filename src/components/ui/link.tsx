import { cn } from "@/lib/utils";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const anchorVariants = cva("hover:underline hover:cursor-pointer", {
  variants: {
    color: {
      green: "text-green-600 dark:text-green-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      blue: "text-blue-600 dark:text-blue-400",
    },
  },
  defaultVariants: {
    color: "yellow",
  },
});

type Color = "green" | "yellow" | "blue";

export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof anchorVariants> {
  color: Color;
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ href, color, className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        {...props}
        ref={ref}
        href={href}
        className={cn(anchorVariants({ color, className }))}
      >
        {children}
      </Comp>
    );
  },
);
Link.displayName = "Link";

export { Link, anchorVariants };

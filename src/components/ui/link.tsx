import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({ href, className, children, ...props }: Props) => {
  return (
    <a
      {...props}
      href={href}
      className={cn(
        "text-green-600 dark:text-green-400 hover:underline",
        className,
      )}
    >
      {children}
    </a>
  );
};

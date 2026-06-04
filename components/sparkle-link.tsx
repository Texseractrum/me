import type { ReactNode } from "react";

interface SparkleLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function SparkleLink({ href, children, className }: SparkleLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

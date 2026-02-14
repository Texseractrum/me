"use client";

import { useState } from "react";
import { Sparkles } from "./sparkles";

interface SparklesLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function SparklesLink({
  href,
  children,
  className = "",
  target,
  rel,
}: SparklesLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className="relative inline-block">
      {isHovered && (
        <div className="absolute -inset-2 pointer-events-none overflow-visible">
          <Sparkles density={6} speed={1.2} size={2} />
        </div>
      )}
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </a>
    </span>
  );
}

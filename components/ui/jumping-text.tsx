"use client";

import React from "react";

interface JumpingTextProps {
  children: string;
  className?: string;
}

export function JumpingText({ children, className = "" }: JumpingTextProps) {
  const letters = children.split("").map((char, index) => {
    // Preserve spaces with a non-breaking space wrapped in span
    if (char === " ") {
      return (
        <span key={index} className="jump-letter" style={{ animationDelay: `${index * 0.05}s` }}>
          &nbsp;
        </span>
      );
    }
    return (
      <span key={index} className="jump-letter" style={{ animationDelay: `${index * 0.05}s` }}>
        {char}
      </span>
    );
  });

  return <span className={className}>{letters}</span>;
}

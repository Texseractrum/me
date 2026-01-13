"use client";

interface JumpingTextProps {
  text: string;
  className?: string;
}

export function JumpingText({ text, className = "" }: JumpingTextProps) {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <span key={index} className={char === " " ? "" : "jump-letter"}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

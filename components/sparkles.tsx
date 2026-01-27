"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function Sparkles({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useRef<Sparkle[]>([]);

  useEffect(() => {
    // Generate sparkles
    sparkles.current = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1.5,
    }));
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      {children}
      {sparkles.current.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-400 dark:text-yellow-300"
          >
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
          </svg>
        </span>
      ))}
      <style jsx>{`
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

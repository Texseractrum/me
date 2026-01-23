"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function Sparkles({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 1 + 0.5,
    });

    const initialSparkles = Array.from({ length: 3 }, generateSparkle);
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkles = [...prev];
        if (newSparkles.length < 5) {
          newSparkles.push(generateSparkle());
        }
        return newSparkles.slice(-5);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <svg
            className="text-yellow-400 dark:text-yellow-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0l1.545 8.455L22 12l-8.455 1.545L12 22l-1.545-8.455L2 12l8.455-1.545z" />
          </svg>
        </span>
      ))}
      {children}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: string;
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
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 8,
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1,
    });

    const initialSparkles = Array.from({ length: 5 }, generateSparkle);
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkles = prev.slice(-4);
        return [...newSparkles, generateSparkle()];
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animation: `sparkle-fade ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              className="fill-yellow-400 dark:fill-yellow-300"
            />
          </svg>
        </span>
      ))}
      {children}
    </span>
  );
}

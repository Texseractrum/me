'use client';

import { useMemo } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface SparklesProps {
  children: React.ReactNode;
  count?: number;
  className?: string;
}

export function Sparkles({ children, count = 8, className = '' }: SparklesProps) {
  // Generate sparkles once using useMemo to ensure consistency between server and client
  const sparklesList = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 1 + 1.5,
    }));
  }, [count]);

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {sparklesList.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute animate-sparkle"
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
              className="absolute"
              style={{
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              viewBox="0 0 160 160"
              fill="none"
            >
              <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                className="fill-yellow-400 dark:fill-yellow-300"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

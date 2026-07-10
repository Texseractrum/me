'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

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
  density?: number;
  className?: string;
}

export function Sparkles({ children, density = 10, className = '' }: SparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const sparkles: Sparkle[] = Array.from({ length: density }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
            }}
          >
            <svg
              width={sparkle.size}
              height={sparkle.size}
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill={theme === 'dark' ? '#FBBF24' : '#F59E0B'}
              />
            </svg>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
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

"use client";

import { useEffect, useRef, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}

function SparkleIcon({ size, opacity, rotation }: { size: number; opacity: number; rotation: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ opacity, transform: `rotate(${rotation}deg)`, transition: "opacity 0.4s" }}
    >
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  );
}

interface SparkleLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SparkleLink({ href, children, className }: SparkleLinkProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addSparkle = () => {
    const id = counterRef.current++;
    const sparkle: Sparkle = {
      id,
      x: Math.random() * 120 - 10,
      y: Math.random() * 120 - 10,
      size: Math.random() * 8 + 6,
      opacity: 1,
      rotation: Math.random() * 360,
    };
    setSparkles((prev) => [...prev, sparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 600);
  };

  const startSparkles = () => {
    addSparkle();
    intervalRef.current = setInterval(addSparkle, 150);
  };

  const stopSparkles = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => stopSparkles(), []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onMouseEnter={startSparkles}
      onMouseLeave={stopSparkles}
      style={{ position: "relative", display: "inline-block" }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            pointerEvents: "none",
            color: "gold",
            animation: "sparkle-fade 0.6s ease-out forwards",
          }}
        >
          <SparkleIcon size={s.size} opacity={s.opacity} rotation={s.rotation} />
        </span>
      ))}
      {children}
      <style>{`
        @keyframes sparkle-fade {
          0%   { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.3) translateY(-8px); }
        }
      `}</style>
    </a>
  );
}

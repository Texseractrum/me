"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function Sparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sparkleCount = 50;
    const sparkles: Sparkle[] = [];

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
      });
    }

    sparklesRef.current = sparkles;

    const sparkleElements = containerRef.current.querySelectorAll(".sparkle");

    sparkleElements.forEach((element, index) => {
      const sparkle = sparkles[index];

      gsap.fromTo(
        element,
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: sparkle.delay,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        }
      );

      gsap.to(element, {
        rotation: 360,
        duration: 3 + Math.random() * 2,
        delay: sparkle.delay,
        repeat: -1,
        ease: "none",
      });
    });

    return () => {
      gsap.killTweensOf(sparkleElements);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {sparklesRef.current.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="currentColor"
              className="text-neutral-400 dark:text-neutral-500"
            />
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="url(#sparkle-gradient)"
              className="opacity-70"
            />
            <defs>
              <radialGradient id="sparkle-gradient">
                <stop offset="0%" stopColor="oklch(1 0 0)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="oklch(1 0 0)" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

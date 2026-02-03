'use client';

import { useEffect, useRef } from 'react';

interface SparkleProps {
  className?: string;
  color?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
}

export function Sparkle({
  className = '',
  color = 'var(--color-accent-9)',
  count = 8,
  minSize = 4,
  maxSize = 8,
}: SparkleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';

      const size = Math.random() * (maxSize - minSize) + minSize;
      const duration = Math.random() * 1000 + 500;
      const delay = Math.random() * 2000;
      const angle = Math.random() * 360;
      const distance = Math.random() * 20 + 10;

      sparkle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        animation: sparkle-float ${duration}ms ease-in-out ${delay}ms infinite;
        opacity: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        --angle: ${angle}deg;
        --distance: ${distance}px;
        box-shadow: 0 0 ${size}px ${color};
      `;

      container.appendChild(sparkle);
    };

    for (let i = 0; i < count; i++) {
      createSparkle();
    }

    return () => {
      container.innerHTML = '';
    };
  }, [color, count, minSize, maxSize]);

  return (
    <div
      ref={containerRef}
      className={`sparkle-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    />
  );
}

interface SparkleWrapperProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
}

export function SparkleWrapper({
  children,
  className = '',
  color,
  count = 6,
}: SparkleWrapperProps) {
  return (
    <span className={`sparkle-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <Sparkle color={color} count={count} />
    </span>
  );
}

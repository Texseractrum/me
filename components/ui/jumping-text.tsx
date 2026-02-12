'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface JumpingTextProps {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  jumpHeight?: number;
}

export default function JumpingText({
  text,
  className = '',
  stagger = 0.05,
  delay = 0,
  duration = 0.5,
  jumpHeight = 10,
}: JumpingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = lettersRef.current;

    gsap.fromTo(
      letters,
      {
        y: 0,
      },
      {
        y: -jumpHeight,
        duration: duration,
        stagger: stagger,
        delay: delay,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      }
    );

    // Add continuous subtle bounce on hover
    letters.forEach((letter) => {
      if (!letter) return;

      const handleMouseEnter = () => {
        gsap.to(letter, {
          y: -jumpHeight * 0.5,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        });
      };

      letter.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        letter.removeEventListener('mouseenter', handleMouseEnter);
      };
    });
  }, [stagger, delay, duration, jumpHeight]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

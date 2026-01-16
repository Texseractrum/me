"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  opacity: number;
}

interface SparklesProps {
  density?: number;
  speed?: number;
  size?: number;
  className?: string;
}

export function Sparkles({
  density = 3,
  speed = 1,
  size = 2,
  className = "",
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const createParticle = (): Particle => {
      const maxLife = 60 + Math.random() * 60;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * size + 1,
        speedX: (Math.random() - 0.5) * speed * 0.5,
        speedY: (Math.random() - 0.5) * speed * 0.5,
        life: 0,
        maxLife,
        opacity: 0,
      };
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.current.length < density) {
        particles.current.push(createParticle());
      }

      const currentTheme = resolvedTheme || theme || "dark";
      const isDark = currentTheme === "dark";

      particles.current = particles.current.filter((particle) => {
        particle.life++;
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        const lifeRatio = particle.life / particle.maxLife;
        if (lifeRatio < 0.2) {
          particle.opacity = lifeRatio * 5;
        } else if (lifeRatio > 0.8) {
          particle.opacity = (1 - lifeRatio) * 5;
        } else {
          particle.opacity = 1;
        }

        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.6;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#ffffff" : "#000000";
        ctx.fill();

        const crossSize = particle.size * 1.5;
        ctx.strokeStyle = isDark ? "#ffffff" : "#000000";
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(particle.x - crossSize, particle.y);
        ctx.lineTo(particle.x + crossSize, particle.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y - crossSize);
        ctx.lineTo(particle.x, particle.y + crossSize);
        ctx.stroke();

        ctx.restore();

        return particle.life < particle.maxLife;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [density, speed, size, theme, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

const FONT_FAMILY =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
const RAMP = " .:-=+*cxzoaX#%@";
// A character cell is roughly twice as tall as it is wide.
const CELL_ASPECT = 2;

interface SmokeAsciiProps {
  className?: string;
  src?: string;
  /** Number of character columns sampled from the video. */
  cols?: number;
  /** Luma at or below this is background (blank). */
  black?: number;
  /** Luma at or above this maps to the densest glyph. */
  white?: number;
}

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (id: number) => void;
};

/**
 * Full-bleed ASCII smoke rendered live from a small looping video, so it runs
 * at the video's native 60fps without shipping thousands of text frames.
 */
export function SmokeAscii({
  className = "",
  src = "/animations/smoke/smoke60.mp4",
  cols = 160,
  black = 32,
  white = 110,
}: SmokeAsciiProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pre = preRef.current;
    if (!wrap || !pre) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const video = document.createElement("video") as FrameCallbackVideo;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let rows = Math.round((cols * (16 / 9)) / CELL_ASPECT);
    let handle = 0;
    let stopped = false;
    let shown = false;
    const range = Math.max(1, white - black);
    const last = RAMP.length - 1;

    const measureCharWidth = () => {
      const c = document.createElement("canvas").getContext("2d");
      if (!c) return 0.6;
      c.font = `100px ${FONT_FAMILY}`;
      return c.measureText("M").width / 100;
    };
    const charWidth = measureCharWidth();

    const fit = () => {
      const lineHeight = charWidth * CELL_ASPECT;
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      // "cover": fill the container in both directions, crop the overflow
      const fontSize = Math.max(width / (cols * charWidth), height / (rows * lineHeight));
      const gridWidth = cols * charWidth * fontSize;
      const gridHeight = rows * lineHeight * fontSize;
      pre.style.fontSize = `${fontSize}px`;
      pre.style.lineHeight = `${lineHeight * fontSize}px`;
      pre.style.width = `${gridWidth}px`;
      pre.style.height = `${gridHeight}px`;
      pre.style.left = `${(width - gridWidth) / 2}px`;
      pre.style.top = `${(height - gridHeight) / 2}px`;
    };

    const draw = () => {
      if (!ctx || video.readyState < 2) return;
      ctx.drawImage(video, 0, 0, cols, rows);
      const data = ctx.getImageData(0, 0, cols, rows).data;
      let out = "";
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const luma = data[(y * cols + x) * 4];
          if (luma <= black) {
            line += " ";
          } else {
            const v = Math.min(1, (luma - black) / range);
            line += RAMP[Math.max(1, Math.round(v * last))];
          }
        }
        out += line.trimEnd() + "\n";
      }
      pre.textContent = out;
      if (!shown) {
        shown = true;
        wrap.style.opacity = "";
      }
    };

    const loop = () => {
      draw();
      schedule();
    };
    const schedule = () => {
      if (stopped) return;
      handle = video.requestVideoFrameCallback
        ? video.requestVideoFrameCallback(loop)
        : requestAnimationFrame(loop);
    };

    video.addEventListener("loadedmetadata", () => {
      if (video.videoWidth && video.videoHeight) {
        rows = Math.round((cols * (video.videoHeight / video.videoWidth)) / CELL_ASPECT);
      }
      canvas.width = cols;
      canvas.height = rows;
      fit();
    });

    video.addEventListener("loadeddata", () => {
      draw();
      if (reduceMotion) return;
      video
        .play()
        .then(schedule)
        .catch(() => {
          // Autoplay blocked (e.g. iOS low-power mode): keep the first frame.
        });
    });

    video.src = src;

    const observer = new ResizeObserver(fit);
    observer.observe(wrap);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!reduceMotion) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(handle);
      cancelAnimationFrame(handle);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, cols, black, white]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ${className}`}
      style={{ opacity: 0 }}
    >
      <pre
        ref={preRef}
        className="absolute m-0 whitespace-pre"
        style={{ fontFamily: FONT_FAMILY }}
      />
    </div>
  );
}

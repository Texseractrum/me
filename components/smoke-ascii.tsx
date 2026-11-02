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

    const BASE_FONT = 10; // px; the grid is scaled with a transform to cover the container
    pre.style.fontSize = `${BASE_FONT}px`;
    pre.style.transformOrigin = "0 0";

    // Measure the real rendered glyph width in the DOM (canvas metrics can differ per browser)
    const measureCharWidth = () => {
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${FONT_FAMILY};font-size:${BASE_FONT}px;`;
      probe.textContent = "M".repeat(100);
      wrap.appendChild(probe);
      const width = probe.getBoundingClientRect().width / 100;
      probe.remove();
      return width || BASE_FONT * 0.6;
    };

    const fit = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      const charWidth = measureCharWidth();
      const lineHeight = charWidth * CELL_ASPECT;
      pre.style.lineHeight = `${lineHeight}px`;
      const gridWidth = cols * charWidth;
      const gridHeight = rows * lineHeight;
      pre.style.width = `${gridWidth}px`;
      pre.style.height = `${gridHeight}px`;
      // "cover": fill the container in both directions, crop the overflow
      const scale = Math.max(width / gridWidth, height / gridHeight) * 1.02;
      const x = (width - gridWidth * scale) / 2;
      const y = (height - gridHeight * scale) / 2;
      pre.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
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
    document.fonts?.ready.then(fit).catch(() => {});

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
        className="absolute left-0 top-0 m-0 overflow-hidden whitespace-pre"
        style={{ fontFamily: FONT_FAMILY }}
      />
    </div>
  );
}

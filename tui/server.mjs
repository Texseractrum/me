import fs from "node:fs";
import path from "node:path";
import { generateKeyPairSync } from "node:crypto";
import ssh2 from "ssh2";

const { Server } = ssh2;

const ESC = "\x1b[";
const RESET = `${ESC}0m`;
const DIM = `${ESC}90m`;
const BRIGHT = `${ESC}97m`;
const HIDE_CURSOR = `${ESC}?25l`;
const SHOW_CURSOR = `${ESC}?25h`;
const ALT_SCREEN = `${ESC}?1049h`;
const MAIN_SCREEN = `${ESC}?1049l`;
const CLEAR = `${ESC}2J`;
const HOME = `${ESC}H`;

const FRAME_DIR = path.join(process.cwd(), "public", "animations", "cube", "high");
const DEFAULT_WEB_BASE_URL = "https://me-ssh.fly.dev";
const DEFAULT_HOST_KEY_PATH = path.join(process.cwd(), "data", "tui-host-key.pem");
const DEFAULT_TUI_FPS = 20;
const TUI_FPS = Math.max(1, Number(process.env.TUI_FPS) || DEFAULT_TUI_FPS);
const FRAME_INTERVAL_MS = Math.round(1000 / TUI_FPS);
const DEFAULT_ASCII_SCALE = 0.78;
const ASCII_SCALE = clamp(Number(process.env.TUI_ASCII_SCALE) || DEFAULT_ASCII_SCALE, 0.25, 1);

const timeline = [
  ["Sparkles", "(YC W26)", "CEO"],
  ["Structured", "(YC F25)", "SWE"],
  ["Cursor", "", "Ambassador"],
  ["Iterate", "", "SWE Intern"],
  ["UCL", "", "Dropout"],
];

const investments = [
  ["Touchmark", "(S26)"],
  ["Byteport", "(W26)"],
  ["Forum", "(W26)"],
  ["Flick", "(F25)"],
  ["Zephyr Fusion", "(F25)"],
];

const links = [
  "GitHub: github.com/Texseractrum",
  "X: x.com/aidaniil",
  "LinkedIn: linkedin.com/in/aidaniilbekirov",
  "Email: dan@sparkles.dev",
  "Substack: substack.aidaniil.com",
];

let externalState = {
  location: "-",
  track: "-",
  updatedAt: null,
};

const frames = loadFrames();
const frameBox = getFrameBox(frames);

function loadFrames() {
  try {
    return fs
      .readdirSync(FRAME_DIR)
      .filter((file) => /^frame_\d+\.txt$/.test(file))
      .sort()
      .map((file) => fs.readFileSync(path.join(FRAME_DIR, file), "utf8"));
  } catch (error) {
    console.warn(`Unable to load ASCII frames from ${FRAME_DIR}: ${error.message}`);
    return [
      [
        "        .-.",
        "     .-'   '-.",
        "   .'  .---.  '.",
        "  /   /     \\   \\",
        " |   |       |   |",
        "  \\   \\     /   /",
        "   '.  '---'  .'",
        "     '-.   .-'",
        "        '-'",
      ].join("\n"),
    ];
  }
}

function getHostKey() {
  if (process.env.TUI_HOST_KEY) {
    return process.env.TUI_HOST_KEY.replaceAll("\\n", "\n");
  }

  const keyPath = process.env.TUI_HOST_KEY_PATH || DEFAULT_HOST_KEY_PATH;
  if (fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath, "utf8");
  }

  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.mkdirSync(path.dirname(keyPath), { recursive: true });
  fs.writeFileSync(keyPath, privateKey, { mode: 0o600 });
  return fs.readFileSync(keyPath, "utf8");
}

async function refreshExternalState() {
  const baseUrl = process.env.WEB_BASE_URL || DEFAULT_WEB_BASE_URL;

  const [location, spotify] = await Promise.all([
    fetchJson(`${baseUrl}/api/location`),
    fetchJson(`${baseUrl}/api/spotify`),
  ]);

  const city = location?.city;
  const country = location?.country;
  const title = spotify?.title;
  const artist = spotify?.artist;

  externalState = {
    location: city ? `${city}${country ? `, ${country}` : ""}` : "-",
    track: title ? `${title}${artist ? ` - ${artist}` : ""}` : "-",
    updatedAt: new Date(),
  };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "me-tui/1.0",
      },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

class TuiSession {
  constructor(stream, size = {}) {
    this.stream = stream;
    this.cols = Number(size.cols) || 100;
    this.rows = Number(size.rows) || 32;
    this.frame = 0;
    this.scroll = 0;
    this.investmentsOpen = true;
    this.paused = false;
    this.artOnly = false;
    this.closed = false;
    this.lastInfo = "i toggle investments  a art  r refresh  space pause  j/k scroll  q quit";
    this.interval = null;
  }

  start() {
    this.stream.write(`${ALT_SCREEN}${HIDE_CURSOR}${CLEAR}${HOME}`);
    this.stream.on("data", (data) => this.handleInput(data));
    this.stream.on("close", () => this.close(false));
    this.stream.on("error", () => this.close(false));

    refreshExternalState().then(() => this.render());
    this.interval = setInterval(() => {
      if (!this.paused) {
        this.frame = (this.frame + 1) % frames.length;
      }
      this.render();
    }, FRAME_INTERVAL_MS);
    this.render();
  }

  resize(size = {}) {
    this.cols = Number(size.cols) || this.cols;
    this.rows = Number(size.rows) || this.rows;
    this.render();
  }

  handleInput(data) {
    const input = data.toString("utf8");

    if (input.includes("\x03") || input.includes("q")) {
      this.close(true);
      return;
    }

    if (input.includes("i") || input.includes("\r")) {
      this.investmentsOpen = !this.investmentsOpen;
      this.lastInfo = this.investmentsOpen
        ? "Angel investments opened"
        : "Angel investments closed";
      this.render();
      return;
    }

    if (input.includes(" ")) {
      this.paused = !this.paused;
      this.lastInfo = this.paused ? "Animation paused" : "Animation running";
      this.render();
      return;
    }

    if (input.includes("a")) {
      this.artOnly = !this.artOnly;
      this.lastInfo = this.artOnly ? "Full animation view" : "Profile view";
      this.render();
      return;
    }

    if (input.includes("r")) {
      this.lastInfo = "Refreshing website state";
      refreshExternalState().then(() => {
        this.lastInfo = "Website state refreshed";
        this.render();
      });
      this.render();
      return;
    }

    if (input.includes("j") || input.includes("\x1b[B")) {
      this.scroll += 1;
      this.render();
      return;
    }

    if (input.includes("k") || input.includes("\x1b[A")) {
      this.scroll = Math.max(0, this.scroll - 1);
      this.render();
    }
  }

  close(endStream) {
    if (this.closed) return;
    this.closed = true;
    if (this.interval) clearInterval(this.interval);
    this.stream.write(`${SHOW_CURSOR}${MAIN_SCREEN}${RESET}`);
    if (endStream) {
      this.stream.exit?.(0);
      this.stream.end();
    }
  }

  render() {
    if (this.closed) return;
    this.stream.write(`${HOME}${renderScreen(this)}`);
  }
}

function renderScreen(state) {
  const cols = Math.max(40, state.cols);
  const rows = Math.max(12, state.rows);
  const header = `${formatCell("* Dan Bekirov", Math.max(16, cols - 32), BRIGHT)}${formatCell("aidaniil.com", 16, DIM)}${formatCell("SSH", 8, DIM)}`;
  const footerText = `ssh aidaniil.com | ${state.lastInfo}`;
  const footer = formatCell(footerText, cols, DIM);
  const divider = style("-".repeat(cols), DIM);

  const bodyRows = rows - 4;
  const split = cols >= 100 && bodyRows >= 18;
  const body = state.artOnly
    ? buildAsciiPane(state, cols, bodyRows, { full: true })
    : split
      ? renderSplitBody(state, cols, bodyRows)
      : renderStackedBody(state, cols, bodyRows);

  return [header, divider, ...body, divider, footer]
    .slice(0, rows)
    .map((line) => formatAnsiLine(line, cols))
    .join("\r\n");
}

function renderSplitBody(state, cols, rows) {
  const leftWidth = Math.min(48, Math.max(36, Math.floor(cols * 0.34)));
  const gutter = 3;
  const rightWidth = cols - leftWidth - gutter;
  const left = visibleWindow(buildContentLines(state), rows, leftWidth, state.scroll);
  const right = buildAsciiPane(state, rightWidth, rows);
  const out = [];

  for (let i = 0; i < rows; i += 1) {
    out.push(
      `${formatCell(left[i] || "", leftWidth)}${style(" | ", DIM)}${formatCell(right[i] || "", rightWidth)}`
    );
  }

  return out;
}

function renderStackedBody(state, cols, rows) {
  const contentLines = buildContentLines(state);
  const minAsciiRows = rows >= 16 ? 4 : 0;
  const contentRows = Math.min(contentLines.length, rows - minAsciiRows - (minAsciiRows > 0 ? 1 : 0));
  const asciiRows = rows - contentRows - (contentRows < rows ? 1 : 0);
  const content = visibleWindow(contentLines, contentRows, cols, state.scroll);
  if (asciiRows <= 0) return content.slice(0, rows);

  const ascii = buildAsciiPane(state, cols, asciiRows);
  return [...content, style("-".repeat(cols), DIM), ...ascii].slice(0, rows);
}

function buildContentLines(state) {
  const lines = [
    "/home/dan",
    "",
    "CEO @ Sparkles.dev (YC W26)",
    "Backed by Y Combinator",
    "Angels from OpenAI, Anthropic, a16z,",
    "General Catalyst, Cloudflare, and more",
    "",
    "Experience",
  ];

  timeline.forEach(([name, batch, role], index) => {
    const marker = index === 0 ? "*" : "|";
    lines.push(`${marker} ${padRight(name, 12)} ${padRight(batch, 8)} ${role}`);
  });

  lines.push("", `Angel investments ${state.investmentsOpen ? "-" : "+"}`);
  if (state.investmentsOpen) {
    investments.forEach(([name, batch]) => {
      lines.push(`  ${padRight(name, 16)} ${batch}`);
    });
  }

  lines.push("", `Location  ${externalState.location}`, `Track     ${externalState.track}`, "", "Links");
  links.forEach((link) => lines.push(`- ${link}`));

  if (externalState.updatedAt) {
    lines.push("", `Updated ${externalState.updatedAt.toISOString().slice(11, 19)} UTC`);
  }

  return lines;
}

function buildAsciiPane(state, width, rows, options = {}) {
  const frame = frames[state.frame % frames.length] || "";
  if (options.full) return fitAscii(frame, width, rows);

  const title = `/space/ascii ${state.frame + 1}/${frames.length}${state.paused ? " paused" : ""}`;
  const artRows = Math.max(1, rows - 2);
  const art = fitAscii(frame, width, artRows);
  return [title, "", ...art].slice(0, rows);
}

function fitAscii(frame, width, height) {
  const cropped = cropAscii(frame, frameBox);
  if (cropped.length === 0) return centerLines([""], width, height);

  const renderWidth = Math.max(1, Math.floor(width * ASCII_SCALE));
  const renderHeight = Math.max(1, Math.floor(height * ASCII_SCALE));
  const sourceHeight = frameBox.height;
  const sourceWidth = frameBox.width;
  if (sourceWidth <= renderWidth && sourceHeight <= renderHeight) {
    return centerLines(cropped, width, height);
  }

  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = renderWidth / renderHeight;
  const targetWidth =
    targetAspect > sourceAspect
      ? Math.max(1, Math.min(renderWidth, Math.round(renderHeight * sourceAspect)))
      : renderWidth;
  const targetHeight =
    targetAspect > sourceAspect
      ? renderHeight
      : Math.max(1, Math.min(renderHeight, Math.round(renderWidth / sourceAspect)));
  const normalized = cropped.map((line) => line.padEnd(sourceWidth, " "));
  const rendered = [];

  for (let row = 0; row < targetHeight; row += 1) {
    const sourceTop = Math.floor((row * sourceHeight) / targetHeight);
    const sourceBottom = Math.max(sourceTop + 1, Math.floor(((row + 1) * sourceHeight) / targetHeight));
    let next = "";

    for (let col = 0; col < targetWidth; col += 1) {
      const sourceLeft = Math.floor((col * sourceWidth) / targetWidth);
      const sourceRight = Math.max(sourceLeft + 1, Math.floor(((col + 1) * sourceWidth) / targetWidth));
      next += sourceGlyph(normalized, sourceTop, sourceBottom, sourceLeft, sourceRight);
    }

    rendered.push(next);
  }

  return centerLines(rendered, width, height);
}

function getFrameBox(frameList) {
  let top = Infinity;
  let bottom = -1;
  let left = Infinity;
  let right = -1;

  for (const frame of frameList) {
    const lines = frame.split(/\r?\n/);
    for (let row = 0; row < lines.length; row += 1) {
      const line = lines[row];
      for (let col = 0; col < line.length; col += 1) {
        if (line[col] !== " ") {
          top = Math.min(top, row);
          bottom = Math.max(bottom, row);
          left = Math.min(left, col);
          right = Math.max(right, col);
        }
      }
    }
  }

  if (bottom < top || right < left) {
    return { top: 0, bottom: 0, left: 0, right: 0, width: 1, height: 1 };
  }

  return {
    top,
    bottom,
    left,
    right,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

function cropAscii(frame, box) {
  const lines = frame.split(/\r?\n/);
  const output = [];

  for (let row = box.top; row <= box.bottom; row += 1) {
    const line = lines[row] || "";
    output.push(line.slice(box.left, box.right + 1).padEnd(box.width, " "));
  }

  return output;
}

function sourceGlyph(lines, top, bottom, left, right) {
  let best = " ";
  let bestWeight = 0;
  let totalWeight = 0;
  let count = 0;

  for (let row = top; row < bottom; row += 1) {
    const line = lines[row] || "";
    for (let col = left; col < right; col += 1) {
      const char = line[col] || " ";
      const weight = glyphWeight(char);
      totalWeight += weight;
      count += 1;

      if (weight > bestWeight) {
        best = char;
        bestWeight = weight;
      }
    }
  }

  if (bestWeight === 0 || count === 0) return " ";

  const density = totalWeight / count;
  if (density < 0.1) return densityGlyph(lines, top, bottom, left, right);
  return best;
}

function densityGlyph(lines, top, bottom, left, right) {
  const ramp = " .,:;-=+*#";
  let total = 0;
  let count = 0;
  let nonSpace = 0;

  for (let row = top; row < bottom; row += 1) {
    const line = lines[row] || "";
    for (let col = left; col < right; col += 1) {
      const weight = glyphWeight(line[col] || " ");
      total += weight;
      count += 1;
      if (weight > 0) nonSpace += 1;
    }
  }

  if (nonSpace === 0 || count === 0) return " ";

  const density = Math.min(1, (total / count) * 1.25);
  const index = Math.max(1, Math.min(ramp.length - 1, Math.round(density * (ramp.length - 1))));
  return ramp[index];
}

function glyphWeight(char) {
  if (!char || char === " ") return 0;
  if (char === "." || char === "`" || char === "'") return 0.18;
  if (char === "," || char === ":" || char === ";") return 0.28;
  if (char === "-" || char === "_" || char === "~") return 0.38;
  if (char === "/" || char === "\\" || char === "|" || char === "(" || char === ")") return 0.48;
  if (char === "=" || char === "+" || char === "*" || char === "<" || char === ">") return 0.62;
  if (/[A-Za-z0-9]/.test(char)) return 0.72;
  if (char === "#" || char === "@" || char === "&" || char === "%") return 1;
  return 0.55;
}

function visibleWindow(lines, rows, width, scroll) {
  const maxScroll = Math.max(0, lines.length - rows);
  const start = Math.min(Math.max(0, scroll), maxScroll);
  return lines.slice(start, start + rows).map((line) => truncate(line, width));
}

function centerLines(lines, width, height) {
  const cropped = lines.slice(0, height);
  const topPad = Math.max(0, Math.floor((height - cropped.length) / 2));
  const output = Array.from({ length: topPad }, () => "");

  for (const line of cropped) {
    const text = truncate(line, width);
    const left = Math.max(0, Math.floor((width - text.length) / 2));
    output.push(`${" ".repeat(left)}${text}`);
  }

  while (output.length < height) output.push("");
  return output.slice(0, height);
}

function formatCell(text, width, ansi = "") {
  const next = padRight(truncate(stripAnsi(String(text)), width), width);
  return ansi ? `${ansi}${next}${RESET}` : next;
}

function formatAnsiLine(line, width) {
  const visible = stripAnsi(line);
  if (visible.length >= width) return line;
  return `${line}${" ".repeat(width - visible.length)}`;
}

function style(text, ansi) {
  return `${ansi}${text}${RESET}`;
}

function padRight(text, width) {
  const next = String(text);
  if (next.length >= width) return next;
  return `${next}${" ".repeat(width - next.length)}`;
}

function truncate(text, width) {
  const next = String(text);
  if (next.length <= width) return next;
  if (width <= 1) return next.slice(0, width);
  return `${next.slice(0, width - 1)}~`;
}

function stripAnsi(text) {
  return String(text).replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "");
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function renderSnapshot(command = "") {
  const size = String(command).match(/(\d{2,3})x(\d{2,3})/);
  const cols = Number(size?.[1] || process.env.SNAPSHOT_COLS) || 120;
  const rows = Number(size?.[2] || process.env.SNAPSHOT_ROWS) || 36;
  const state = {
    cols,
    rows,
    frame: 0,
    scroll: 0,
    investmentsOpen: !command.includes("no-investments"),
    paused: true,
    artOnly: /\bart\b/.test(command),
    lastInfo: "snapshot",
  };

  return `${renderScreen(state)}\r\n`;
}

const server = new Server(
  {
    hostKeys: [getHostKey()],
    ident: "SSH-2.0-me-tui",
  },
  (client, info) => {
    console.log(`connection from ${info.ip}`);

    client
      .on("authentication", (ctx) => ctx.accept())
      .on("ready", () => {
        client.on("session", (accept) => {
          const session = accept();
          let size = { cols: 100, rows: 32 };
          let tui = null;

          session.on("pty", (acceptPty, _reject, info = {}) => {
            size = {
              cols: info.cols || size.cols,
              rows: info.rows || size.rows,
            };
            acceptPty?.();
          });

          session.on("window-change", (acceptWindow, _reject, info = {}) => {
            size = {
              cols: info.cols || size.cols,
              rows: info.rows || size.rows,
            };
            acceptWindow?.();
            tui?.resize(size);
          });

          session.on("shell", (acceptShell) => {
            const stream = acceptShell();
            tui = new TuiSession(stream, size);
            tui.start();
          });

          session.on("exec", (acceptExec, _reject, info = {}) => {
            const stream = acceptExec();
            refreshExternalState().finally(() => {
              stream.write(renderSnapshot(info.command || ""));
              stream.exit(0);
              stream.end();
            });
          });
        });
      })
      .on("error", (error) => {
        console.warn(`client error: ${error.message}`);
      });
  }
);

const port = Number(process.env.TUI_PORT || process.env.PORT || 2222);
const host = process.env.TUI_HOST || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`me TUI listening on ${host}:${port}`);
});

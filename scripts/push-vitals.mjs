#!/usr/bin/env node
// Reads the latest Fitbit/Google wearable summary from the local Air Stats MCP
// server and pushes a small, public subset to aidaniil.com. Run by launchd.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AIRSTATS =
  "/Users/lv/Library/Application Support/Air Stats/Agent/Air Stats Agent.app/Contents/MacOS/AirStats";
const ENDPOINT = process.env.VITALS_ENDPOINT ?? "https://www.aidaniil.com/api/vitals";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const key = readFileSync(join(root, ".env.local"), "utf8").match(/^STATS_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) throw new Error("STATS_API_KEY missing from .env.local");

function summary() {
  return new Promise((resolve, reject) => {
    const child = spawn(AIRSTATS, ["--mcp"], { stdio: ["pipe", "pipe", "ignore"] });
    const timer = setTimeout(() => { child.kill(); reject(new Error("Air Stats timed out")); }, 90_000);
    let buf = "";
    const send = (msg) => child.stdin.write(JSON.stringify(msg) + "\n");
    child.stdout.on("data", (chunk) => {
      buf += chunk;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.id === 1) {
          send({ jsonrpc: "2.0", method: "notifications/initialized" });
          send({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_health_summary", arguments: {} } });
        } else if (msg.id === 2) {
          clearTimeout(timer);
          child.kill();
          if (msg.error || msg.result?.isError) reject(new Error(JSON.stringify(msg.error ?? msg.result)));
          else resolve(msg.result.structuredContent ?? JSON.parse(msg.result.content[0].text));
        }
      }
    });
    child.on("error", reject);
    send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "push-vitals", version: "1" } } });
  });
}

const s = await summary();
const latest = s.latest ?? {};
const vitals = {
  heartRate: latest.heartRate && { bpm: latest.heartRate.beatsPerMinute, measuredAt: latest.heartRate.measuredAt },
  restingHeartRate: latest.restingHeartRate?.value,
  sleep: latest.sleep?.isMainSleep && { minutesAsleep: latest.sleep.minutesAsleep, end: latest.sleep.end },
  steps: s.today?.steps != null && { count: s.today.steps, asOf: s.devices?.[0]?.lastSync ?? s.fetchedAt },
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": key },
  body: JSON.stringify(vitals),
});
console.log(new Date().toISOString(), res.status, await res.text());
if (!res.ok) process.exit(1);

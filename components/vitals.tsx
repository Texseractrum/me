import type { Vitals as VitalsData } from "@/lib/health";
import { Row } from "@/components/row";
import { Heartbeat } from "@/components/heartbeat";

const FRESH_MS = 20 * 60 * 1000;

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

function dayIn(timeZone: string, t: number | string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "short" }).format(new Date(t));
}

export function Vitals({
  vitals,
  now,
  timeZone = "America/Los_Angeles",
}: {
  vitals: VitalsData | null;
  now: number;
  timeZone?: string;
}) {
  if (!vitals) return null;
  const { heartRate, restingHeartRate, sleep, steps } = vitals;
  const fresh = heartRate && now - Date.parse(heartRate.measuredAt) < FRESH_MS;
  const sleptRecently = sleep && now - Date.parse(sleep.end) < 20 * 3600_000;
  const stepsToday = steps && dayIn(timeZone, steps.asOf) === dayIn(timeZone, now);

  return (
    <>
      {heartRate && (
        <Row label="Heart rate">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[2ch]">
            <span>
              {heartRate.bpm} bpm
              {restingHeartRate && <span className="text-dim">, resting {restingHeartRate}</span>}
            </span>
            <span className="inline-flex items-baseline gap-[1ch] text-dim">
              {fresh && <Heartbeat bpm={heartRate.bpm} />}
              {ago(heartRate.measuredAt, now)}
            </span>
          </div>
        </Row>
      )}
      {sleep && sleptRecently && (
        <Row label="Sleep">
          {Math.floor(sleep.minutesAsleep / 60)}h {sleep.minutesAsleep % 60}m
          <span className="text-dim"> last night</span>
        </Row>
      )}
      {steps && stepsToday && (
        <Row label="Steps">
          {steps.count.toLocaleString("en-US")}
          <span className="text-dim"> today</span>
        </Row>
      )}
    </>
  );
}

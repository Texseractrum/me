import type { Vitals as VitalsData } from "@/lib/health";
import { Row } from "@/components/row";

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
  const { heartRate, sleep, steps } = vitals;
  const sleptRecently = sleep && now - Date.parse(sleep.end) < 20 * 3600_000;
  const stepsToday = steps && dayIn(timeZone, steps.asOf) === dayIn(timeZone, now);

  const parts: React.ReactNode[] = [];
  if (heartRate) parts.push(<span key="hr">{heartRate.bpm} bpm</span>);
  if (sleep && sleptRecently)
    parts.push(
      <span key="sleep">
        {Math.floor(sleep.minutesAsleep / 60)}h {sleep.minutesAsleep % 60}m<span className="text-dim"> sleep</span>
      </span>,
    );
  if (steps && stepsToday)
    parts.push(
      <span key="steps">
        {steps.count.toLocaleString("en-US")}
        <span className="text-dim"> steps</span>
      </span>,
    );
  if (!parts.length) return null;

  // One line: heart rate, last night's sleep, today's steps. Freshness on the right.
  return (
    <Row label="Vitals">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[2ch]">
        <span className="sm:truncate">
          {parts.map((part, i) => (
            <span key={i}>
              {i > 0 && <span className="text-dim">, </span>}
              {part}
            </span>
          ))}
        </span>
        {heartRate && (
          <span className="text-right text-dim">{ago(heartRate.measuredAt, now)}</span>
        )}
      </div>
    </Row>
  );
}

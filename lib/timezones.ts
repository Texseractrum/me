const CITY_TIMEZONES: Record<string, string> = {
  "san francisco": "America/Los_Angeles",
  "los angeles": "America/Los_Angeles",
  "palo alto": "America/Los_Angeles",
  "mountain view": "America/Los_Angeles",
  seattle: "America/Los_Angeles",
  "new york": "America/New_York",
  boston: "America/New_York",
  miami: "America/New_York",
  austin: "America/Chicago",
  chicago: "America/Chicago",
  london: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  amsterdam: "Europe/Amsterdam",
  lisbon: "Europe/Lisbon",
  dubai: "Asia/Dubai",
  singapore: "Asia/Singapore",
  tokyo: "Asia/Tokyo",
};

export function timezoneFor(city?: string | null) {
  return city ? CITY_TIMEZONES[city.trim().toLowerCase()] : undefined;
}

/** Request time for server components (kept out of render for lint purity). */
export function requestTime() {
  return Date.now();
}

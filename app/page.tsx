import { getLocation } from "@/lib/location";
import { ThemeToggle } from "@/components/theme-toggle";
import { SmokeAscii } from "@/components/smoke-ascii";
import { Experience, type Role } from "@/components/experience";
import { getNowPlaying } from "@/lib/spotify";
import { NowPlaying } from "@/components/now-playing";
import { Writing } from "@/components/writing";
import { Row } from "@/components/row";
import { LocalTime } from "@/components/local-time";
import { requestTime, timezoneFor } from "@/lib/timezones";
import { getPosts } from "@/lib/substack";
import { getVitals } from "@/lib/health";
import { Vitals } from "@/components/vitals";

const roles: Role[] = [
  {
    name: "Sparkles",
    href: "https://sparkles.dev",
    batch: "YC W26",
    role: "CEO",
    current: true,
  },
  {
    name: "Structured",
    href: "https://getstructured.ai",
    batch: "YC F25",
    role: "SWE",
  },
  { name: "Cursor", href: "https://cursor.com", role: "Ambassador" },
  { name: "Iterate", href: "https://iterate.com", role: "SWE Intern" },
  { name: "UCL", href: "https://ucl.ac.uk", role: "Dropout" },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const location = await getLocation();
  const timeZone = timezoneFor(location.city);
  const [spotify, posts, vitals] = await Promise.all([
    getNowPlaying(),
    getPosts(3),
    getVitals(timeZone),
  ]);
  const now = requestTime();

  const links = [
    { label: "GitHub", href: "https://github.com/Texseractrum" },
    { label: "X", href: "https://x.com/aidaniil" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aidaniilbekirov/" },
    { label: "Substack", href: "https://substack.aidaniil.com" },
    { label: "Email", href: "mailto:dan@sparkles.dev" },
  ];

  return (
    <main className="relative min-h-screen bg-background text-ink">
      <SmokeAscii className="fixed inset-0 z-0 text-neutral-500 opacity-25 [mask-image:linear-gradient(to_bottom,transparent_0%,black_55%)] dark:text-neutral-400 dark:opacity-30 md:left-auto md:w-[54vw] md:text-neutral-700 md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent_0%,black_35%)] md:dark:text-neutral-300 md:dark:opacity-100" />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)] md:items-center md:px-12 lg:px-16">
        {/* Everything below sits on a 64ch measure and a 24px line. */}
        <div className="type-grid flex w-full max-w-[64ch] flex-col gap-y-[72px] font-mono">
          <header>
            <div className="flex justify-between">
              <h1 className="font-medium">Dan Bekirov</h1>
              <ThemeToggle />
            </div>
            <p className="text-dim">
              CEO of Sparkles (YC W26). Backed by Y Combinator and angels from
              OpenAI, Anthropic, a16z, General Catalyst and Cloudflare.
            </p>
          </header>

          <div className="flex flex-col gap-y-12">
            <Row label="Work">
              <Experience roles={roles} />
            </Row>

            {posts.length > 0 && (
              <Row label="Writing">
                <Writing posts={posts} />
              </Row>
            )}

            <div>
              <Row label="Location">
                <span>
                  {location.city ?? "Unknown"}
                  {timeZone && (
                    <>
                      <span className="text-dim">, </span>
                      <LocalTime timeZone={timeZone} initial={now} />
                    </>
                  )}
                </span>
              </Row>
              <NowPlaying initial={spotify} />
              <Vitals vitals={vitals} now={now} timeZone={timeZone} />
            </div>
          </div>

          <nav aria-label="Elsewhere">
            <ul className="flex flex-wrap gap-x-[3ch]">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-dim hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <aside aria-hidden="true" className="hidden md:block" />
      </div>
    </main>
  );
}

import { getLocation } from "@/lib/location";
import { ThemeToggle } from "@/components/theme-toggle";
import { SparkleLink } from "@/components/sparkle-link";
import { SmokeAscii } from "@/components/smoke-ascii";
import { AngelInvestments } from "@/components/angel-investments";
import { Experience, type Role } from "@/components/experience";
import { getNowPlaying } from "@/lib/spotify";
import { NowPlaying } from "@/components/now-playing";
import { Writing } from "@/components/writing";
import { LocalTime } from "@/components/local-time";
import { requestTime, timezoneFor } from "@/lib/timezones";
import { getPosts } from "@/lib/substack";

const roles: Role[] = [
  {
    name: "Sparkles",
    href: "https://sparkles.dev",
    batch: "(YC W26)",
    role: "CEO",
    current: true,
    sparkle: true,
  },
  {
    name: "Structured",
    href: "https://getstructured.ai",
    batch: "(YC F25)",
    role: "SWE",
  },
  { name: "Cursor", href: "https://cursor.com", role: "Ambassador" },
  { name: "Iterate", href: "https://iterate.com", role: "SWE Intern" },
  { name: "UCL", href: "https://ucl.ac.uk", role: "Dropout" },
];

const angelInvestments = [
  {
    name: "Touchmark",
    batch: "(S26)",
    href: "https://touchmark.ai",
  },
  {
    name: "Byteport",
    batch: "(W26)",
    href: "https://byteport.com",
  },
  {
    name: "Forum",
    batch: "(W26)",
    href: "https://forum.market",
  },
  {
    name: "Flick",
    batch: "(F25)",
    href: "https://flick.art",
  },
  {
    name: "Zephyr Fusion",
    batch: "(F25)",
    href: "https://zephyrfusion.com",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [location, spotify, posts] = await Promise.all([
    getLocation(),
    getNowPlaying(),
    getPosts(3),
  ]);
  const now = requestTime();
  const timeZone = timezoneFor(location.city);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SmokeAscii className="fixed inset-0 z-0 text-neutral-500 opacity-25 [mask-image:linear-gradient(to_bottom,transparent_0%,black_55%)] dark:text-neutral-400 dark:opacity-30 md:left-auto md:w-[54vw] md:text-neutral-700 md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent_0%,black_35%)] md:dark:text-neutral-300 md:dark:opacity-100" />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] md:items-center md:px-10 lg:gap-20 lg:px-14">
        <div className="grid h-[calc(100svh-8rem)] min-h-0 max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
          <header>
            <div className="flex items-start justify-between">
              <h1 className="font-mono text-base font-medium tracking-tight">
                Dan Bekirov
              </h1>
              <ThemeToggle />
            </div>
            <p className="mt-2 font-mono text-base text-neutral-500">
              CEO @{" "}
              <SparkleLink
                href="https://sparkles.dev"
                className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
              >
                Sparkles.dev
              </SparkleLink>{" "}
              (YC W26)
            </p>
            <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-neutral-400">
              Backed by Y Combinator and angels from OpenAI, Anthropic, a16z,
              General Catalyst, Cloudflare, and more.
            </p>
          </header>

          <div className="flex min-h-0 flex-col gap-10 overflow-y-auto py-10 pr-1 sm:gap-11 sm:py-12 [mask-image:linear-gradient(to_bottom,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Experience roles={roles} />

            <Writing posts={posts} now={now} />

            <AngelInvestments investments={angelInvestments} />

            <section>
              <div className="flex items-baseline gap-4">
                <span className="w-28 sm:w-32 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
                  Location
                </span>
                <span className="flex min-w-0 items-baseline gap-3 font-mono">
                  <span className="min-w-0 truncate text-base text-neutral-600 dark:text-neutral-400">
                    {location.city ?? "—"}
                    {location.country && (
                      <span className="text-neutral-400">, {location.country}</span>
                    )}
                  </span>
                  {timeZone && <LocalTime timeZone={timeZone} initial={now} />}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-4">
                <span className="w-28 sm:w-32 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
                  Track
                </span>
                <NowPlaying initial={spotify} />
              </div>
            </section>
          </div>

          <nav>
            <ul className="flex flex-wrap gap-6 font-mono text-base">
              <li>
                <a
                  href="https://github.com/Texseractrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/aidaniil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/aidaniilbekirov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:dan@sparkles.dev"
                  className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://substack.aidaniil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
                >
                  Substack
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <aside aria-hidden="true" className="hidden md:block" />
      </div>
    </main>
  );
}

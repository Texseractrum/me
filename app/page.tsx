import { getLocation } from "@/lib/location";
import { ThemeToggle } from "@/components/theme-toggle";
import { SparkleLink } from "@/components/sparkle-link";
import { SpaceAscii } from "@/components/space-ascii";
import { AngelInvestments } from "@/components/angel-investments";
import { getNowPlaying } from "@/lib/spotify";

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
  const [location, spotify] = await Promise.all([
    getLocation(),
    getNowPlaying(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] md:items-center md:px-10 lg:gap-20 lg:px-14">
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

          <div className="flex min-h-0 flex-col gap-12 overflow-y-auto py-10 pr-1 sm:gap-16 sm:py-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <section>
              <div className="relative">
                <div className="absolute left-1 top-2 h-[calc(100%-16px)] w-px bg-neutral-200 dark:bg-neutral-700" />

                <div className="relative flex items-center gap-4 pb-5">
                  <div className="relative z-10">
                    <div className="relative h-2 w-2 rounded-full bg-black dark:bg-white" />
                  </div>
                  <div className="flex flex-1 items-baseline">
                    <SparkleLink
                      href="https://sparkles.dev"
                      className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                    >
                      Sparkles
                    </SparkleLink>
                    <span className="w-20 font-mono text-sm text-neutral-400">
                      (YC W26)
                    </span>
                    <span className="ml-auto font-mono text-sm text-neutral-400">
                      CEO
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4 pb-5">
                  <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="flex flex-1 items-baseline">
                    <a
                      href="https://getstructured.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                    >
                      Structured
                    </a>
                    <span className="w-20 font-mono text-sm text-neutral-400">
                      (YC F25)
                    </span>
                    <span className="ml-auto font-mono text-sm text-neutral-400">
                      SWE
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4 pb-5">
                  <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="flex flex-1 items-baseline">
                    <a
                      href="https://cursor.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                    >
                      Cursor
                    </a>
                    <span className="w-20" />
                    <span className="ml-auto font-mono text-sm text-neutral-400">
                      Ambassador
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4 pb-5">
                  <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="flex flex-1 items-baseline">
                    <a
                      href="https://iterate.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                    >
                      Iterate
                    </a>
                    <span className="w-20" />
                    <span className="ml-auto font-mono text-sm text-neutral-400">
                      SWE Intern
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="flex flex-1 items-baseline">
                    <a
                      href="https://ucl.ac.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                    >
                      UCL
                    </a>
                    <span className="w-20" />
                    <span className="ml-auto font-mono text-sm text-neutral-400">
                      Dropout
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <AngelInvestments investments={angelInvestments} />

            <section>
              <div className="flex items-baseline gap-4">
                <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
                  Location
                </span>
                <span className="font-mono text-base text-neutral-600 dark:text-neutral-400">
                  {location.city ?? "—"}
                  {location.country && (
                    <span className="text-neutral-400">, {location.country}</span>
                  )}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-4">
                <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
                  Track
                </span>
                {spotify.title ? (
                  <a
                    href={spotify.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                  >
                    {spotify.title}
                    {spotify.artist && (
                      <span className="text-neutral-400"> · {spotify.artist}</span>
                    )}
                  </a>
                ) : (
                  <span className="font-mono text-base text-neutral-600 dark:text-neutral-400">
                    —
                  </span>
                )}
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

        <aside className="flex min-h-[42vh] items-center justify-center md:min-h-[calc(100vh-8rem)] md:justify-end">
          <SpaceAscii />
        </aside>
      </div>
    </main>
  );
}

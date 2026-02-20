import { getLocation } from "@/lib/location";
import { ThemeToggle } from "@/components/theme-toggle";
import TypingText from "@/components/ui/shadcn-io/typing-text";

export const dynamic = "force-dynamic";

export default async function Home() {
  const location = await getLocation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
        <header className="mb-16">
          <div className="flex items-start justify-between">
            <h1 className="font-mono text-base font-medium tracking-tight">
              Ai Daniil Bekirov
            </h1>
            <ThemeToggle />
          </div>
          <p className="mt-1 font-mono text-sm text-purple-400">
            (yes this is my legal name, but you can call me Dan)
          </p>
          <p className="mt-2 font-mono text-base text-purple-500">
            CEO @{" "}
            <a
              href="https://sparkles.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
            >
              Sparkles.dev
            </a>{" "}
            (YC W26)
          </p>
        </header>

        <section className="mb-16">
          <p className="font-mono text-base leading-relaxed text-purple-600 dark:text-purple-400">
            <TypingText
              text="Building software with care. "
              as="span"
              loop={false}
              typingSpeed={40}
              showCursor={false}
            />
            <TypingText
              text="Tinkering with Sandboxes and Agents."
              as="span"
              loop={false}
              typingSpeed={40}
              initialDelay={2000}
              showCursor={true}
              cursorClassName="bg-purple-600 dark:bg-purple-400"
            />
          </p>
        </section>

        <section className="mb-16">
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-1 top-2 h-[calc(100%-16px)] w-px bg-purple-200 dark:bg-purple-800" />

            {/* Sparkles */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10">
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-purple-600 opacity-75 dark:bg-purple-400" />
                <div className="relative h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400" />
              </div>
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://sparkles.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
                >
                  Sparkles
                </a>
                <span className="w-20 font-mono text-sm text-purple-400">
                  (YC W26)
                </span>
                <span className="ml-auto font-mono text-sm text-purple-400">
                  CEO
                </span>
              </div>
            </div>

            {/* Structured */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-700" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://getstructured.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
                >
                  Structured
                </a>
                <span className="w-20 font-mono text-sm text-purple-400">
                  (YC F25)
                </span>
                <span className="ml-auto font-mono text-sm text-purple-400">
                  SWE
                </span>
              </div>
            </div>

            {/* Cursor */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-700" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://cursor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
                >
                  Cursor
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-purple-400">
                  Ambassador
                </span>
              </div>
            </div>

            {/* Iterate */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-700" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://iterate.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
                >
                  Iterate
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-purple-400">
                  SWE Intern
                </span>
              </div>
            </div>

            {/* UCL */}
            <div className="relative flex items-center gap-4">
              <div className="relative z-10 h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-700" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://ucl.ac.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-purple-600 underline decoration-purple-300 underline-offset-2 transition-colors hover:text-purple-900 hover:decoration-purple-900 dark:text-purple-400 dark:decoration-purple-600 dark:hover:text-purple-200 dark:hover:decoration-purple-200"
                >
                  UCL
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-purple-400">
                  Dropout
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 space-y-5">
          <div className="flex items-baseline gap-4">
            <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-purple-400">
              About
            </span>
            <span className="font-mono text-base text-purple-600 dark:text-purple-400">
              20<span className="mx-2 text-purple-300">·</span>🇺🇦
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-purple-400">
              Current location
            </span>
            <span className="font-mono text-base text-purple-600 dark:text-purple-400">
              {location.city ?? "—"}
              {location.country && (
                <span className="text-purple-400">, {location.country}</span>
              )}
            </span>
          </div>

        </section>

        <nav className="mt-auto">
          <ul className="flex gap-6 font-mono text-base">
            <li>
              <a
                href="https://github.com/Texseractrum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 transition-colors duration-200 hover:text-purple-900 dark:hover:text-purple-200"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com/aidaniil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 transition-colors duration-200 hover:text-purple-900 dark:hover:text-purple-200"
              >
                X
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/aidaniilbekirov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 transition-colors duration-200 hover:text-purple-900 dark:hover:text-purple-200"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:dan@sparkles.dev"
                className="text-purple-400 transition-colors duration-200 hover:text-purple-900 dark:hover:text-purple-200"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://substack.aidaniil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 transition-colors duration-200 hover:text-purple-900 dark:hover:text-purple-200"
              >
                Substack
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

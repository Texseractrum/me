import { getLocation } from "@/lib/location";
import { ThemeToggle } from "@/components/theme-toggle";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import { JumpingText } from "@/components/ui/jumping-text";

export const dynamic = "force-dynamic";

export default async function Home() {
  const location = await getLocation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
        <header className="mb-16">
          <div className="flex items-start justify-between">
            <h1 className="font-mono text-base font-medium tracking-tight">
              <JumpingText>Ai Daniil Bekirov</JumpingText>
            </h1>
            <ThemeToggle />
          </div>
          <p className="mt-1 font-mono text-sm text-neutral-400">
            <JumpingText>(yes this is my legal name, but you can call me Dan)</JumpingText>
          </p>
          <p className="mt-2 font-mono text-base text-neutral-500">
            <JumpingText>CEO @ </JumpingText>
            <a
              href="https://sparkles.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
            >
              <JumpingText>Sparkles.dev</JumpingText>
            </a>{" "}
            <JumpingText>(YC W26)</JumpingText>
          </p>
        </header>

        <section className="mb-16">
          <p className="font-mono text-base leading-relaxed text-neutral-600 whitespace-nowrap dark:text-neutral-400">
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
              cursorClassName="bg-neutral-600 dark:bg-neutral-400"
            />
          </p>
        </section>

        <section className="mb-16">
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-1 top-2 h-[calc(100%-16px)] w-px bg-neutral-200 dark:bg-neutral-700" />

            {/* Sparkles */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10">
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-black opacity-75 dark:bg-white" />
                <div className="relative h-2 w-2 rounded-full bg-black dark:bg-white" />
              </div>
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://sparkles.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                >
                  <JumpingText>Sparkles</JumpingText>
                </a>
                <span className="w-20 font-mono text-sm text-neutral-400">
                  <JumpingText>(YC W26)</JumpingText>
                </span>
                <span className="ml-auto font-mono text-sm text-neutral-400">
                  <JumpingText>CEO</JumpingText>
                </span>
              </div>
            </div>

            {/* Structured */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://getstructured.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                >
                  <JumpingText>Structured</JumpingText>
                </a>
                <span className="w-20 font-mono text-sm text-neutral-400">
                  <JumpingText>(YC F25)</JumpingText>
                </span>
                <span className="ml-auto font-mono text-sm text-neutral-400">
                  <JumpingText>SWE</JumpingText>
                </span>
              </div>
            </div>

            {/* Cursor */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://cursor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                >
                  <JumpingText>Cursor</JumpingText>
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-neutral-400">
                  <JumpingText>Ambassador</JumpingText>
                </span>
              </div>
            </div>

            {/* Iterate */}
            <div className="relative flex items-center gap-4 pb-5">
              <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://iterate.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                >
                  <JumpingText>Iterate</JumpingText>
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-neutral-400">
                  <JumpingText>SWE Intern</JumpingText>
                </span>
              </div>
            </div>

            {/* UCL */}
            <div className="relative flex items-center gap-4">
              <div className="relative z-10 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex flex-1 items-baseline">
                <a
                  href="https://ucl.ac.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-28 font-mono text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-white"
                >
                  <JumpingText>UCL</JumpingText>
                </a>
                <span className="w-20" />
                <span className="ml-auto font-mono text-sm text-neutral-400">
                  <JumpingText>Dropout</JumpingText>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 space-y-5">
          <div className="flex items-baseline gap-4">
            <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
              <JumpingText>About</JumpingText>
            </span>
            <span className="font-mono text-base text-neutral-600 dark:text-neutral-400">
              <JumpingText>20</JumpingText><span className="mx-2 text-neutral-300"><JumpingText>·</JumpingText></span><JumpingText>🇺🇦</JumpingText>
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400">
              <JumpingText>Current location</JumpingText>
            </span>
            <span className="font-mono text-base text-neutral-600 dark:text-neutral-400">
              <JumpingText>{location.city ?? "—"}</JumpingText>
              {location.country && (
                <span className="text-neutral-400"><JumpingText>, {location.country}</JumpingText></span>
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
                className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
              >
                <JumpingText>GitHub</JumpingText>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/aidaniil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
              >
                <JumpingText>X</JumpingText>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/aidaniilbekirov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
              >
                <JumpingText>LinkedIn</JumpingText>
              </a>
            </li>
            <li>
              <a
                href="mailto:dan@sparkles.dev"
                className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
              >
                <JumpingText>Email</JumpingText>
              </a>
            </li>
            <li>
              <a
                href="https://substack.aidaniil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
              >
                <JumpingText>Substack</JumpingText>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

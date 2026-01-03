export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
        <header className="mb-16">
          <h1 className="font-mono text-sm font-medium tracking-tight">
            Your Name
          </h1>
          <p className="mt-1 font-mono text-sm text-neutral-500">
            Software Engineer
          </p>
        </header>

        <section className="mb-16">
          <p className="max-w-md font-mono text-sm leading-relaxed text-neutral-600">
            Building software with care. Currently focused on distributed
            systems and developer tools.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-neutral-400">
            Now
          </h2>
          <p className="font-mono text-sm text-neutral-600">
            Working on something new.
          </p>
        </section>

        <nav className="mt-auto">
          <ul className="flex gap-6 font-mono text-sm">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors duration-200 hover:text-black"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors duration-200 hover:text-black"
              >
                X
              </a>
            </li>
            <li>
              <a
                href="mailto:you@email.com"
                className="text-neutral-400 transition-colors duration-200 hover:text-black"
              >
                Email
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

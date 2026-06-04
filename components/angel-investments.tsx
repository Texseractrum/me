"use client";

import { useId, useState } from "react";

interface Investment {
  name: string;
  batch: string;
  href: string;
}

interface AngelInvestmentsProps {
  investments: Investment[];
}

export function AngelInvestments({ investments }: AngelInvestmentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const investmentsId = useId();

  return (
    <section>
      <button
        type="button"
        aria-controls={investmentsId}
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-baseline gap-4 text-left"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="w-36 shrink-0 font-mono text-sm uppercase tracking-widest text-neutral-400 transition-colors duration-300 group-aria-expanded:text-neutral-500 dark:group-aria-expanded:text-neutral-300">
          Angel investments
        </span>
        <span className="font-mono text-sm text-neutral-400 transition-colors duration-300">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      <div
        id={investmentsId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-5 max-h-44 overflow-y-auto overscroll-contain sm:ml-40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-0 flex-col gap-3">
              {investments.map((investment) => (
                <a
                  key={investment.href}
                  href={investment.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  className="group inline-flex w-fit max-w-full min-w-0 items-baseline gap-3 font-mono"
                >
                  <span className="text-base text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors group-hover:text-black group-hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-600 dark:group-hover:text-white dark:group-hover:decoration-white">
                    {investment.name}
                  </span>
                  <span className="shrink-0 text-sm text-neutral-400">
                    {investment.batch}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

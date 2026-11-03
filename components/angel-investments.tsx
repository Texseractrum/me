import { Fragment } from "react";

interface Investment {
  name: string;
  batch: string;
  href: string;
}

export function AngelInvestments({ investments }: { investments: Investment[] }) {
  return (
    <p>
      {investments.map((item, i) => (
        <Fragment key={item.href}>
          <span className="whitespace-nowrap">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/75 hover:text-ink"
          >
            {item.name}
          </a>{" "}
          <span className="text-dim">
            {item.batch}
            {i < investments.length - 1 ? "," : ""}
          </span>
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}

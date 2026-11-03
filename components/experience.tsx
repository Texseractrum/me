export interface Role {
  name: string;
  href: string;
  role: string;
  batch?: string;
  current?: boolean;
}

// name | batch | role, on fixed character columns so every row lines up.
export function Experience({ roles }: { roles: Role[] }) {
  return (
    <ul>
      {roles.map((item) => (
        <li key={item.href} className="grid grid-cols-[12ch_8ch_1fr]">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={item.current ? "text-ink" : "text-ink/75 hover:text-ink"}
          >
            {item.name}
          </a>
          <span className="text-dim">{item.batch}</span>
          <span className="text-right text-dim">{item.role}</span>
        </li>
      ))}
    </ul>
  );
}

// Latest commit by Dan across the Sparkles org (private, via a read-only
// fine-grained token) and his own public repos.
const TOKEN = process.env.GITHUB_TOKEN;
const USER = "Texseractrum";
const ORG = "sparklesdotdev";
const API = "https://api.github.com";

export interface Commit {
  repo: string;
  private: boolean;
  message?: string; // only for public repos
  url?: string;
  date: string;
}

interface Repo {
  name: string;
  full_name: string;
  private: boolean;
  pushed_at: string;
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "aidaniil.com",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getLastCommit(): Promise<Commit | null> {
  const [orgRepos, userRepos] = await Promise.all([
    TOKEN ? gh<Repo[]>(`/orgs/${ORG}/repos?sort=pushed&per_page=4&type=all`) : null,
    gh<Repo[]>(`/users/${USER}/repos?sort=pushed&per_page=3`),
  ]);
  const repos = [...(orgRepos ?? []), ...(userRepos ?? [])];

  const latest = await Promise.all(
    repos.map(async (repo): Promise<Commit | null> => {
      const commits = await gh<
        { html_url: string; commit: { message: string; author: { date: string } } }[]
      >(`/repos/${repo.full_name}/commits?author=${USER}&per_page=1`);
      const c = commits?.[0];
      if (!c) return null;
      return {
        repo: repo.name,
        private: repo.private,
        message: repo.private ? undefined : c.commit.message.split("\n")[0],
        url: repo.private ? undefined : c.html_url,
        date: c.commit.author.date,
      };
    }),
  );

  return (
    latest
      .filter((c): c is Commit => c !== null)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0] ?? null
  );
}

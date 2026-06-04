# Deployment

Production should run from the Fly app `me-ssh`.

## Current Fly Layout

- Web: process group `web`, internal port `3000`.
- TUI: machines `0804293a1073d8` and `865ed1ae0e6e28`, existing image `registry.fly.io/me-ssh:deployment-01KJNTAMKQVDB7Y49PSME3KXZ9`, internal port `22`.
- Location store: Supabase when `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are present. `DATABASE_URL` is currently only a fallback until Supabase is verified.

Expected Fly services:

```text
22  -> 22    raw TCP, TUI
80  -> 3000  HTTP, web
443 -> 3000  HTTP+TLS, web
```

## Web Image

Deploy only the web process group without replacing the TUI machines:

```bash
flyctl deploy --config fly.web.toml --process-groups web --ha=false --remote-only
```

Do not run a normal full-app deploy against `me-ssh` from this repo unless the TUI source has been moved into the repo too.

## TUI Image

The SSH TUI source lives in `tui/server.mjs` and uses the current website
content plus the ASCII frames in `public/animations/cube/high`.

Run it locally on port `2222`:

```bash
bun run tui:dev
ssh -p 2222 localhost
```

Deploy only the TUI process group without replacing the web machine:

```bash
flyctl deploy --config fly.tui.toml --process-groups app --ha=false --remote-only
```

By default the TUI generates an ephemeral SSH host key at boot. To keep SSH
clients from warning after every deploy, set a stable PEM host key as a Fly
secret:

```bash
openssl genrsa 2048 > /tmp/me-tui-host-key
flyctl secrets set -a me-ssh TUI_HOST_KEY="$(cat /tmp/me-tui-host-key)"
```

## Location API

The location API uses `LOCATION_API_KEY` for writes and stores the current location in the `app_location` table.

```bash
curl -X POST https://me-ssh.fly.dev/api/location \
  -H "x-api-key: $LOCATION_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"city":"London","country":"United Kingdom"}'
```

For Supabase, create this table in SQL editor:

```sql
create table if not exists public.app_location (
  id integer primary key default 1 check (id = 1),
  city text not null,
  country text,
  updated_at timestamptz not null default now()
);
```

The required Fly secrets are:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
SUPABASE_PUBLISHABLE_KEY
LOCATION_API_KEY
```

## DNS

Cloudflare records for `aidaniil.com` and `www.aidaniil.com` should be DNS-only, not proxied, so SSH can reach Fly on port `22`.

```text
A     aidaniil.com      213.188.223.191
AAAA  aidaniil.com      2a09:8280:1::db:33a0:0
A     www.aidaniil.com  213.188.223.191
AAAA  www.aidaniil.com  2a09:8280:1::db:33a0:0
```

Remove Vercel records such as `216.198.79.1` from production DNS.

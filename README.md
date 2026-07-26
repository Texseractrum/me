# Personal Website

A personal website built with Next.js, React, TypeScript, and Tailwind CSS. It includes live Spotify and location endpoints, plus an optional SSH terminal interface.

## Development

Install dependencies and start the web app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run tui` starts the SSH terminal interface on port `2222`.
- `npm run tui:dev` starts the terminal interface with the development port explicitly set.

## Environment Variables

The core site runs without additional configuration. Optional integrations use these variables:

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` enable Spotify data.
- `LOCATION_API_KEY` protects location updates.
- `WEB_BASE_URL` configures the web app URL used by the terminal interface.
- `TUI_HOST`, `TUI_PORT`, `TUI_HOST_KEY`, and `TUI_HOST_KEY_PATH` configure the SSH server.

Store local values in `.env.local` and do not commit secrets.

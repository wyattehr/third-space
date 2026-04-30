# Copilot Instructions for Third Space

- This repo is a tiny full-stack Node web app with no framework.
- `server.js` is the entire backend: static file serving from `public/` and a minimal JSON-backed API at `/api/space`.
- The frontend lives in `public/`: `index.html`, `styles.css`, and `app.js`.
- Persistent state is stored in `data/space.json`; the server creates it automatically on first run.

## Key project behavior

- `npm start` / `node server.js` starts the app on port `3000` by default.
- `public/app.js` polls `GET /api/space` every 2.5s and saves edits with `PUT /api/space` after a 500ms debounce.
- The app uses built-in Node modules only: `http`, `fs/promises`, `path`.
- No build step exists; files are served directly from disk.
- The `public/` directory is the static GitHub Pages-ready site. The Node backend is only available when running locally.

## What to change carefully

- `server.js` handles both API routing and static asset delivery. Keep the `/api/space` contract stable.
- `data/space.json` is the single source of truth for saved text. Treat it like state and not as a compile artifact.
- `public/app.js` controls the shared editor status flow: `Live`, `Editing`, `Saving`, `Save failed`.
- When hosted on GitHub Pages, the frontend falls back to localStorage if `/api/space` is unavailable.

## Useful notes for fixes or features

- If you add routes, preserve static serving behavior for `GET` / `HEAD` requests.
- `server.js` enforces a request body cap at 100,000 chars for PUT payloads.
- The frontend expects `text` and `updatedAt` in the API response.

## Developer commands

- `npm start` — launch the server
- Open `http://localhost:3000`
- Use `PORT` / `HOST` env vars for alternate local bindings

## GitHub Pages deployment

 - The repo includes `.github/workflows/deploy-pages.yml` to publish `public/` to GitHub Pages on `main` pushes.
 - The hosted site is static and cannot access `server.js` on GitHub Pages.

## Where to look first

- `server.js` for backend logic and API behavior
- `public/app.js` for client save/load flow
- `README.md` and `documentation/third-space-stack-breakdown.md` for the repo’s current intended architecture

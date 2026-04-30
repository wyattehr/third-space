# Third Space

Third Space is starting as a small shared text space. Anyone who opens the page can edit the same text box, and the server keeps the latest version in `data/space.json`.

## Run it

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## What this teaches

- `public/index.html` is the page structure.
- `public/styles.css` controls the visual design.
- `public/app.js` runs in the browser, loads the shared text, and saves edits.
- `server.js` serves the website and exposes the `/api/space` API.
- `data/space.json` is the first simple database.

This is intentionally small. The next natural steps are user identity, community pages, real-time updates with WebSockets, and location-gated participation.

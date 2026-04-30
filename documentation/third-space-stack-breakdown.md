# Third Space: Tech Breakdown

This document explains the small website currently running on your computer. It is written as a beginner-friendly overview for someone coming from embedded systems.

## Where the project lives

```text
/Users/wyattehr/Developer/Third Space
```

## What this site is right now

Third Space is currently a tiny full-stack web app.

It lets someone open a webpage, edit a shared text box, and save the latest text on the server.

It is not public on the internet yet. It is hosted locally on your machine.

## How it is hosted

The site is hosted by running:

```bash
node server.js
```

That starts a local web server at:

```text
http://127.0.0.1:3000
```

`127.0.0.1` means "this computer." Other people on the internet cannot access it yet.

Port `3000` is the local network port the server listens on.

If the `node server.js` process stops, the website goes offline.

## The current tech stack

The app uses:

- HTML for the page structure
- CSS for the visual design
- Browser JavaScript for interactivity
- Node.js for the backend server
- A JSON file as the first simple database
- Localhost for hosting on your own machine

There are no external frameworks yet. No React, no Express, no cloud hosting, and no production database.

That is intentional. This version keeps the moving parts visible.

## File-by-file breakdown

### `server.js`

This is the backend.

It starts the local server and listens at:

```text
http://127.0.0.1:3000
```

It does two jobs:

1. Serves the website files from the `public` folder.
2. Provides an API for reading and saving the shared text.

The API routes are:

```text
GET /api/space
```

This reads the current shared text.

```text
PUT /api/space
```

This saves new shared text.

In embedded terms, think of `server.js` like the firmware task that owns the external interface and controls access to persistent state.

### `public/index.html`

This is the page structure.

It defines the visible elements:

- the page title
- the "Third Space" heading
- the shared text box
- the status label
- the last-saved text
- the character count

HTML is the skeleton of the page.

### `public/styles.css`

This controls how the page looks.

It defines:

- colors
- fonts
- spacing
- layout
- mobile behavior
- textarea styling
- focus styling
- status badge styling

CSS is the visual layer.

### `public/app.js`

This is the browser-side behavior.

It runs inside the browser after the page loads.

It does things like:

- fetch the current shared text from the server
- put that text into the textarea
- notice when someone types
- wait briefly before saving
- send new text to the server
- update the "Live", "Saving", or "Save failed" status
- update the character count
- poll the server every few seconds for changes

In embedded terms, this is like the UI loop running on the client side.

### `data/space.json`

This is the first simple database.

It stores the current text and the last updated timestamp.

Example:

```json
{
  "text": "Welcome to Third Space.",
  "updatedAt": "2026-04-30T01:18:45.856Z"
}
```

This is fine for learning, but it is not what you would use for a real public app long term.

Eventually this would probably become a real database like Postgres.

### `package.json`

This is Node project metadata.

It says what the project is called and defines the start command:

```json
"start": "node server.js"
```

Once npm is available, that means you can run:

```bash
npm start
```

instead of:

```bash
node server.js
```

### `README.md`

This is the basic project readme.

It explains how to run the app and what the main files are.

## What happens when you open the site

When you visit:

```text
http://127.0.0.1:3000
```

this happens:

1. The browser sends a request to the local Node server.
2. `server.js` returns `public/index.html`.
3. The browser loads `public/styles.css`.
4. The browser loads `public/app.js`.
5. `public/app.js` calls `GET /api/space`.
6. `server.js` reads `data/space.json`.
7. The browser puts the saved text into the textarea.

## What happens when you edit the text box

When you type:

1. `public/app.js` notices the change.
2. It waits about half a second.
3. It sends the new text to `PUT /api/space`.
4. `server.js` receives the new text.
5. `server.js` writes it into `data/space.json`.
6. The browser updates the status to "Live."

The browser also checks the server every few seconds to see whether the text changed somewhere else.

That is called polling.

Later, a more advanced version would probably use WebSockets so changes appear instantly.

## Frontend versus backend

The frontend is everything that runs in the browser:

- `public/index.html`
- `public/styles.css`
- `public/app.js`

The backend is what runs on your computer as the server:

- `server.js`

The storage is:

- `data/space.json`

## Why the browser does not write the file directly

Browsers are sandboxed.

A webpage cannot freely write to arbitrary files on your computer. That would be a huge security problem.

So the browser asks the server to save the text.

The server is allowed to access the file system, so it writes the data.

That separation is one of the core ideas in web development.

## Current limitations

This first version is intentionally simple.

It does not have:

- user accounts
- authentication
- permissions
- moderation
- real-time collaboration
- a real database
- public hosting
- geographic verification
- security hardening
- backups

Those are future layers.

## Likely next steps

A reasonable learning path would be:

1. Get comfortable running the server locally.
2. Learn the difference between frontend code and backend code.
3. Replace the JSON file with a real database.
4. Add real-time updates with WebSockets.
5. Add user identity.
6. Add community pages.
7. Add location-based participation.
8. Deploy the site publicly.

## The important mental model

This is the core loop:

```text
Browser -> Server -> Storage
Browser <- Server <- Storage
```

The browser is the interface.

The server is the authority.

The storage is memory that survives refreshes and restarts.

That is the foundation of the full-stack web model.

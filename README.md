# Ideal Resume Generator

This app generates a fictional “ideal resume” from a pasted job description while following the structure of the uploaded sample resume:

- centered header with name and contact line
- uppercase section headings with divider rules
- entry rows with left-aligned organization and right-aligned dates
- italic role lines
- quantified bullet-driven accomplishments

The generated identity and experiences are intentionally fake. The output is meant to help applicants study what a strong, tailored resume could look like for a given JD.

## What it does

- accepts a raw JD
- can send it to a local server endpoint backed by the Volcengine Ark Responses API
- can also call Ark directly from the browser when the user pastes an API key into the page
- requests structured JSON output for the full resume
- validates that every bullet contains measurable impact before accepting the response
- falls back to a deterministic local sample generator if the API is unavailable
- renders the result in a print-friendly layout inspired by the reference resume
- supports browser print to PDF

## Run locally

```bash
npm install
npm run dev
```

## Environment setup

Preferred local setup: create a local `.env` file in the project root by copying `.env.example`, then fill in your credentials:

```env
ARK_API_KEY=<REDACTED>
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL=doubao-seed-2-1-pro-260628
```

Then run:

```bash
npm install
npm run dev
```

The server loads `.env` automatically through `dotenv`.

This setup is useful for local development because requests go through `server.mjs`, which keeps the key out of the browser and exposes debug logs through `/api/debug-log`.

## GitHub hosting

This project can also be hosted as a static site on GitHub Pages.

- build the app and deploy the `dist/` folder to GitHub Pages
- open the hosted page
- paste a Volcengine Ark API key into the `API key` field below the `Generate ideal resume` button
- click `Generate ideal resume`

If you publish this repository to GitHub Pages under `https://github.com/chenzhuoxuanczx-bit/Ideal_resume-generator`, the site URL will be:

- [https://chenzhuoxuanczx-bit.github.io/Ideal_resume-generator/](https://chenzhuoxuanczx-bit.github.io/Ideal_resume-generator/)

When the `API key` field is filled, the browser calls Ark directly and does not require the local backend. This makes GitHub Pages deployment possible, but it also means the key is used in the browser session, so it should only be entered by the person using the page for themselves.

## Build

```bash
npm run build
```

## Notes

- The deterministic rule-based generator still works without any external API key.
- Live generation can run through `server.mjs` in local development or directly from the browser when the page-level API key field is used.
- The local rule-based generator in `src/resume-generator.ts` remains as a fallback and as a sample preview mode.
- Every experience, project, and leadership bullet is required to include a measurable impact signal such as a percentage, count, revenue number, scale metric, or time reduction.

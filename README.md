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
- sends it to a local server endpoint backed by the Volcengine Ark Responses API
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

Preferred setup: create a local `.env` file in the project root by copying `.env.example`, then fill in your credentials:

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

This project now treats `.env` as the single runtime configuration source for Ark credentials.

## Build

```bash
npm run build
```

## Notes

- The current implementation uses a deterministic rule-based generator, so it works without any external API keys.
- Live generation now runs through `server.mjs`, which keeps the Ark API key on the server side and uses a structured schema.
- The local rule-based generator in `src/resume-generator.ts` remains as a fallback and as a sample preview mode.
- Every experience, project, and leadership bullet is required to include a measurable impact signal such as a percentage, count, revenue number, scale metric, or time reduction.

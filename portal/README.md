# IDP Developer Portal

> Next.js 14 (App Router) · TypeScript · Tailwind CSS

The portal is the public face of the Internal Developer Platform. Developers browse scaffolds and blueprints, generate a ready-to-use ZIP, and find all platform documentation in one place.

## Quick start

```bash
npm install
cp .env.example .env.local   # no required vars for local dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero landing page — featured scaffolds and blueprints |
| `/scaffolds` | Full scaffold catalog |
| `/scaffolds/[id]` | Scaffold detail: features, stack table, quickstart, structure, **generator wizard** |
| `/blueprints` | Full blueprint catalog grouped by category |
| `/blueprints/[id]` | Blueprint detail: resources, architecture diagram, config table, deploy command |
| `/docs` | Documentation hub |
| `/api/generate` | POST — generates and returns a scaffold ZIP |

## Key components

| Component | Purpose |
|-----------|---------|
| `GeneratorWizard` | Service name + description form → calls `/api/generate` → downloads ZIP |
| `DeployBlock` | Shows CDK deploy command with one-click copy |
| `ScaffoldCard` / `BlueprintCard` | Catalog grid cards with hover effects |
| `Badge` | Colour-coded tag pill (5 variants) |
| `Navbar` | Sticky nav with IDP brand + route links |

## Catalog data source

All scaffold and blueprint metadata lives in **`src/data/catalog.ts`**. This is the single source of truth consumed by both the UI pages and the `/api/generate` route handler. Adding a new entry here automatically makes it appear in the catalog — no other changes needed.

## Adding a new scaffold

1. Add a `Scaffold` entry to `scaffolds[]` in `src/data/catalog.ts`
2. Add a file factory function `get<Name>Files(name, description)` in `src/app/api/generate/route.ts`
3. Register it in the `scaffoldFiles` map in the same file

## Environment variables

No required variables for the portal itself. The generator runs entirely server-side using `JSZip`.

## Build & deploy

```bash
npm run build   # Next.js production build
npm start       # Start production server
```

The portal can be deployed to any Node.js host (Vercel, ECS, App Runner, etc.).

# Pharmatiya Health — Phase 1 website

Static marketing site for Pharmatiya Health, rebuilt from the approved Phase 1
architecture and wireframes.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · statically
exported. No client-side JavaScript beyond the mobile menu and the contact
form's conditional fields. Charts are hand-authored inline SVG rather than a
charting library — they are fixed figures, not live data, so a runtime
dependency would cost hundreds of kilobytes for nothing.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run typecheck
```

## Structure

```
app/                  routes, one directory per page
components/layout/    Header, Navigation, MobileNavigation, Footer
components/ui/        Button, Field, SectionHeader, DataLabel
components/evidence/  ForestPlot, KaplanMeierGraphic, CohortDiagram,
                      CostEffectivenessPlane, DatasetMap, TherapeuticMatrix,
                      CaseStudies, Figure
components/sections/  Hero, Proof, ServiceTeasers, NextGenTeaser,
                      WorkflowDiagram, ContactRouting, DigestSignup, CTA
lib/site.ts           all copy, figures and pending-input flags
docs/                 architecture, wireframes, roadmap, client report
```

`lib/site.ts` is the single place to change content. Anything awaiting client
input is flagged there with the input number from the architecture document.

## Outstanding client inputs

The build is complete, but these are unresolved and are marked in the UI
rather than filled with invented content:

| # | Input | Affects |
|---|---|---|
| 1 | Team and office photography | About hero, team section |
| 2 | Case studies | Evidence — renders a confidentiality statement instead |
| 3 | Service descriptions verified | Services copy |
| 4 | Dataset name clearance | Named sources suppressed site-wide |
| 5 | NextGen AI product detail | Product page throughout |
| 6 | Contact routing and calendar | Contact routing destinations, booking |
| 7 | Licensed typeface | Display face (Spectral is the placeholder) |
| 8 | Vector logo | Typographic wordmark stands in |
| 9 | Compliance review windows | NextGen AI trust claims |
| 10 | Hosting | Form endpoint — submission is disabled until configured |

Two decisions are also open: the public product name (NextGen AI vs
RWE - Builder, set in `lib/site.ts`) and confirmation of the "1,000+ synopses"
figure.

## Before launch

Apply 301 redirects from the Squarespace URLs — `/home` → `/`,
`/new-dropdown` → `/nextgen-ai/`, `/cart` → `/`. The redirect map is in
`docs/phase1-roadmap.html`.

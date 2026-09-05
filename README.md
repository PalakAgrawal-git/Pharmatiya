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

## Study list

The NextGen AI page carries a keyword search over Pharmatiya's study list,
rebuilt from the search on the current homepage. Data is pulled from the same
Google Sheet at **build time**, not in the browser:

```bash
GOOGLE_SHEETS_API_KEY=... PHARMATIYA_SHEET_ID=... npm run studies
```

That writes `data/studies.json`, which is imported into the bundle. The sheet
stays the editing surface — re-run after changes.

The live site fetches the sheet client-side with the API key and sheet ID
embedded in page source, so anyone can read the key and query the sheet. That
key should be rotated and restricted, and it is not reproduced here.

`data/studies.json` is committed empty. The finder shows a clear notice rather
than fabricated study records until it is populated.

## Adding people to the team

The About page renders `lib/team.ts` in order. To add someone, copy the
template at the bottom of that file, fill it in, and add it to the `team`
array -- nothing else changes.

Only `id`, `name`, `role` and `bio` are required. `credentials`, `education`,
`licensure`, `affiliations`, `credits` and `photo` are all optional and are
simply not rendered when absent, so a sparse entry still looks finished.

Headshots go in `public/team/` and are referenced as `photo: "/team/name.jpg"`.
Leave `photo: null` and a typographic panel stands in -- never a stock
portrait. Set `roleConfirmed: false` to publish a title with a visible
"to confirm" marker.

## Published record

The Evidence page carries 47 publications, abstracts, posters, a patent and a
book chapter (2003-2022), searchable and filterable by type. Entries with a
DOI, PMID or patent number link to the source, so a buyer can verify them
without contacting Pharmatiya.

`data/publications.json` is generated from the supplied bibliography:

```bash
python scripts/build-publications.py
```

Only the published record is used. Personal contact details, licence numbers
and client engagements that do not appear in the literature are deliberately
excluded -- see the Disclosure note below.

## Disclosure boundary

The supplied resume contains material that is NOT on the site by decision:

- Personal phone number, personal email address, pharmacy licence numbers.
- Named value-based-care engagements (Aetna/Inova, Aetna/Medtronic,
  Aetna/Merck) and named product initiatives (Ozempic, CAR-T, Entresto,
  Januvia). These are not in the published literature and need client
  clearance before publication.
- Personal revenue figures.

Employer names appear only where they are already inside a published citation
or affiliation.

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

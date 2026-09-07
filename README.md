# Pharmatiya Health — Phase 1 website

Static marketing site for Pharmatiya Health, rebuilt from the approved Phase 1
architecture and wireframes.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · statically
exported. Charts are hand-authored inline SVG rather than a charting library —
they are fixed figures, not live data, so a runtime dependency would cost
hundreds of kilobytes for nothing.

Client-side JavaScript is limited to the mobile menu, the contact form's
conditional fields, the study finder, the publication list, and two small
motion helpers (`Reveal`, `CountUp`). Every one of those is progressive
enhancement: the server renders the finished state, so with JavaScript off the
page is complete — nothing hidden, figures drawn, numbers already counted. All
motion is suppressed under `prefers-reduced-motion`.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run typecheck
./scripts/build-pages.sh   # build AND publish into the repo root (see Deployment)
```

## Structure

```
app/                  routes, one directory per page
components/layout/    Header, Navigation, MobileNavigation, Footer
components/ui/        Button, Field, SectionHeader, DataLabel
components/evidence/  ForestPlot, KaplanMeierGraphic, CohortDiagram,
                      CostEffectivenessPlane, DatasetMap, TherapeuticMatrix,
                      CaseStudies, PublicationList, Figure
components/sections/  Hero, Proof, ServiceTeasers, ServiceProcess,
                      NextGenTeaser, WorkflowDiagram, CoverageBand,
                      Milestones, TeamRoster, StudyFinder, ContactRouting,
                      DigestSignup, CTA
components/motion/    Reveal (scroll reveal), CountUp (counting figures)
components/layout/    …plus GraphGround, the plotting-paper page ground
lib/site.ts           all copy, figures and pending-input flags
lib/team.ts           the team roster
docs/                 architecture, wireframes, roadmap, client report,
                      and the client content request (HTML, PDF, DOCX)
```

### Which figure belongs to which page

Home and Evidence show **results** — forest plot, cohort attrition,
cost-effectiveness plane, survival curves. Services shows **process**, via
`ServiceProcess`, because it is the only page answering "what actually happens
if we hire you". They previously shared two of the same three charts, so a
visitor clicking a homepage teaser was shown the same figure twice. Keep that
split when adding figures: a chart on Services that also appears on Home makes
the two pages read as one page twice.

Copy has the same rule. Each service carries both a `problem` (Services: what
the client arrived with) and a `teaser` (Home: what the engagement produces).
They must not be interchangeable.

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

## Motion and conventions

All motion is defined once in `app/globals.css` and driven by an ancestor
carrying `data-reveal="shown"`, which `Reveal` sets when the element scrolls
into view. Every "off" state lives inside a `@keyframes from`, never in a base
style, so without JavaScript the page renders complete rather than blank.

| Class | Used for |
|---|---|
| `draw` | Stroke drawing along a path — survival curves |
| `grow-x` | Growing from one edge — confidence intervals, timeline duration bars |
| `pop-in` | Scaling up from centre — scatter replicates |
| `fall-in` | Arriving from above — cohort boxes, timeline entries, process stages |
| `rule-grow` | Section heading hairlines drawing left to right |
| `spine-draw` | Vertical connectors on the About timeline |
| `lift` / `lift-inverse` / `rule-row` | Hover affordance on panels and list rows |

Two conventions worth keeping: a **hollow marker** means an endpoint or an
unknown (the undated founding entry, the final process stage), against filled
markers for evidenced steps; and a figure's **accessible description carries
the full numbers** even where the drawn figure has been simplified, so nothing
is lost to a screen reader.

Anything set at a scale — a timeline bar, a plotted point — is derived from the
underlying number rather than positioned by eye. A label and a graphic reading
from separate sources is a figure waiting to contradict itself.

### Two traps already paid for

- **`backdrop-filter` makes an element a containing block for
  `position: fixed` descendants.** The header carries a blur, so the mobile
  menu nested inside it resolved `inset-0` against the header box and collapsed
  to a 375×76 strip with unclickable links. It is now portalled to `<body>`.
- **`ch` units resolve against the font-size of the element they are set on.**
  `max-w-[28ch]` on a `<blockquote>` meant 28 characters of inherited 17px body
  text, capping the homepage pull-quote at 286px and wrapping 45px display type
  into eleven two-word lines. Put the measure on the element that carries the
  type.

## Deployment

GitHub Pages for this repository is set to **Deploy from a branch**, which
serves the repository's own files — not a build artifact. `next build` writes
to `./out`, which `.gitignore` excludes, so the built site is invisible to that
setting. With no `index.html` in the published directory, Pages falls back to
Jekyll and publishes `README.md` as the homepage. That is what the site URL
served for some time, while `.github/workflows/deploy.yml` built and uploaded a
correct artifact on every push that nothing ever served: with a branch source,
those deployments are created and then ignored.

**Pages source must be: Branch `main`, Folder `/docs`.**

So the build is committed into `docs/`:

```bash
./scripts/build-pages.sh    # then commit the result
```

Run it after **any** content or component change, or the live site keeps
serving the previous build. The script removes only what a previous build
generated, so the hand-authored documents in `docs/` — architecture,
wireframes, roadmap, the content request — survive it.

`docs/.nojekyll` is load-bearing. Without it Pages runs Jekyll, and Jekyll
skips directories beginning with an underscore — which drops `_next/` and takes
every stylesheet and script with it.

Publishing from `docs/` rather than the repository root is deliberate. The
served directory exposes every tracked file in it, and serving from the root
meant `Rajesh Mehta Resumeh.docx` — personal phone number, email, licence
numbers, named engagements, revenue figures — was downloadable from the live
site, contradicting the Disclosure boundary above. Those files stay in the
repository and are no longer published. Anything genuinely meant to be public
belongs in `docs/`.

To verify a change the way Pages will serve it, copy the tracked contents of
`docs/` under a `/Pharmatiya/` path and serve that; the base path matters, as
assets are prefixed with it.

**The tidier alternative:** switching Settings → Pages → Source to
**GitHub Actions** makes the existing workflow the live deployment and removes
the need to commit build output at all. Nothing else has to change.

## Before launch

Apply 301 redirects from the Squarespace URLs — `/home` → `/`,
`/new-dropdown` → `/nextgen-ai/`, `/cart` → `/`. The redirect map is in
`docs/phase1-roadmap.html`.

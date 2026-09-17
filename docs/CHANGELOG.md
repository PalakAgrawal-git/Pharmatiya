# Changelog

Notable changes, newest first. Written to keep the client-facing documents in
`docs/` honest — several of them describe how the site behaves, so a change to
that behaviour has to be recorded here or those documents quietly go stale.

---

## 2026-09-17 — Evidence page redesigned

- **Hero**: four figures at a glance, counted from the archive (49 entries,
  15 publications, 12 areas, 20 years), and jump links to each section.
- **Selected studies** are cards: area, title, the lead figure, the question,
  with data, method and finding in an expandable panel and the citation at
  the foot. The null result keeps its badge.
- **Therapeutic areas** are a ranked bar chart with a count for every area,
  from the archive. Eight areas previously showed a dash, and the
  infectious-disease count was stale (26; it is 27 since the ICAAC poster
  was added).
- **Data coverage** and **Methods** are card sets with chips.
- **Published record** entries carry a type badge and their venue.
- Sections are consistently numbered 01–05 with one heading pattern.

### Correction: "peer-reviewed"

The site labelled all 15 entries in the bibliography's "Publications"
section as peer-reviewed journal papers — on the homepage band, the About
band and the archive filter. That section includes an arXiv preprint, an
ISPOR conference item and entries with no journal named. The label is now
"publications" everywhere, with JAMA and Circulation named as examples;
nothing on the site claims peer review.

---

## 2026-09-17 — the synopsis is a client document

The synopsis is what a client receives, and it was being shown in the
website's own dark styling. It is now a separate deliverable
(`lib/synopsisDocument.ts`):

- **In the conversation** it arrives as a document card: a miniature page,
  the title, a reference number (`PH-SYN-YYYYMMDD-XXXX`), the date and its
  sections, with *Open document* and *Download Word*.
- **Open document** shows it in a viewer: white A4 page, Pharmatiya®
  letterhead, reference and date, a draft-status notice, a summary table,
  seven numbered sections with numbered sub-sections, tables for the study
  question and stakeholder value, a reviewer sign-off block and a
  confidential-draft footer.
- **Save as PDF** prints the document through the browser's own PDF output,
  with A4 margins and page-break rules. **Download Word** saves a `.doc`
  named by the reference number, with the on-screen backdrop removed.
- The viewer, the PDF and the Word file come from one HTML template, so they
  cannot differ. The document's styling is fixed and independent of the
  site's theme.

---

## 2026-09-17 — NextGen AI becomes an application

The builder looked like every other section of the site. The NextGen AI page
now opens on a working AI workspace instead of a page header:

- **Sidebar**: New synopsis, recent synopses (kept in this browser only),
  and the three-step framework.
- **Conversation**: a welcome prompt with four worked examples, user and
  assistant turns, and a composer that grows with the text (Enter sends,
  Shift+Enter adds a line).
- **Visible working steps**, each reporting what the builder actually found
  in the question: condition, ICD-10-CM code family, data sources and
  audience, outcomes. No scripted "thinking" text.
- **The synopsis arrives section by section** as a card: study question,
  then each of the three steps (collapsible), then value and review. Copy
  and Download on every result.
- **Follow-ups refine the draft.** Each new message is read together with
  the earlier ones and the synopsis is rebuilt, so "Add adherence as an
  outcome" adds adherence. Four one-click refinements are offered.
- **Patient details are refused** in the conversation, as before.
- No model is named. In this build the draft is made in the browser, and
  the Trust section says so; with `NEXT_PUBLIC_SYNOPSIS_API` set, the same
  workspace talks to the model-backed service.

---

## 2026-09-17 — the synopsis builder moves into the site; placeholders removed

The old site is being replaced by this one, and the domain will move with it.
The "Open RWE - Builder" link pointed at `app.pharmatiya.net`, which would stop
resolving at that point — so the product now lives on the NextGen AI page.

### The builder

- **Same interaction as the live product.** One problem statement in, one
  structured synopsis out, in Pharmatiya's three-step framework: Step 0
  Feasibility, Step 1 Retrospective Study, Step 2 Pragmatic Outreach. Three
  worked examples start it in one click. Copy and download (.txt) included.
- **How the live product actually works**, read from its public code: it
  requires a login, allows free users three synopses a week, and sends the
  statement to its own server at `/api/generate-synopsis`, which calls
  **OpenAI**. The model and version are not visible from outside.
- **Why the AI can't simply be dropped in here.** This site is static. A
  model call needs an API key, and a key placed in a static site is readable
  by every visitor. So the builder has two modes (`lib/synopsis.ts`):
  - **Now:** the synopsis is drafted in the visitor's browser from the
    framework — condition, data sources, audience and outcomes are read from
    the statement, with ICD-10-CM code families for about forty conditions.
    Nothing is sent or stored, and the page says exactly that.
  - **Later:** set `NEXT_PUBLIC_SYNOPSIS_API` at build time to the
    model-backed endpoint. The builder uses the live product's contract
    unchanged (`{ problem }` in, `{ synopsis }` out) and the trust copy on
    the page switches to describe it. The endpoint must allow requests from
    the new domain (CORS).
- **Patient data is refused.** Statements containing a social security
  number, medical record number, date of birth, email, phone number or a
  patient name are rejected before anything is drafted.

### Page corrections that came with it

- *How it works* now describes the real flow — describe, structure,
  review — not the concept deck's data-source picker, which the shipped
  product does not have.
- *The model does* now lists what the product demonstrably does. "Summarises
  literature" is gone; nothing in the product shows it.
- *Trust* has four statements, all true of this build: no patient data,
  review every time, where the question goes, and what the tool does not do.

### Forms now send

- The contact form's submit button was disabled, and the digest signup did
  nothing. Both now go through `lib/submit.ts`: a form service when
  `NEXT_PUBLIC_FORM_ENDPOINT` is set, otherwise the visitor's email app opens
  with the message written and addressed. Required fields are checked and the
  result is announced.

### Placeholders

- **All client-input placeholders are removed** from every page, along with
  the component that drew them. The outstanding items are still listed in
  `docs/content-required.html`; the site no longer shows them.
- The *Illustrative data* captions on the homepage figures stay. They are not
  placeholders — they say the figures show the form of the output rather
  than results.

---

## 2026-09-17 — client materials incorporated

Seven files supplied by Pharmatiya: the Pharmatiya product deck, the Avalere
deck, the RWE presentation (Oct 2025, as .pptx and .pdf), the ICAAC poster,
"All Abstracts - MP" and the principal's biography.

### Used, and where

- **About.** The chronology is rewritten from the biography, naming
  Intermountain, ActiveHealth Management and Healthagen as career history.
  The opening column now carries the name's meaning from the product deck
  ("matiya: revolution, a gift of goodness, respectable"). The roster bio is
  updated, and the ADA Overcoming Therapeutic Inertia advisory role added.
  **Client input 14 is resolved** — the Outcomes Research division was
  Healthagen — and its slot is removed.
- **Evidence.** New *Selected studies* section: four published studies from
  the abstracts file and the poster, with figures quoted as reported,
  co-authorship shown as published, and one null result marked as such.
- **Archive.** Two entries added (49 total, 15 peer-reviewed): the 2020
  *J Clin Transl Endocrinol* guideline-conformance paper, and the ICAAC
  rapid-identification poster (undated — the file carries no year).
  `scripts/build-publications.py` now carries both forward on a rerun.
- **Counts are derived, not typed.** The homepage band, the About chart and
  the Evidence introduction now count from `data/publications.json`, so they
  cannot drift from the archive again.
- **Homepage figure 03 is real data.** The invented cohort counts are
  replaced with the published mSToPS participant flow (Steinhubl et al.,
  JAMA 2018). Figures 02 and 04 are now captioned *Illustrative data*.
- **Services.** *Who uses real-world evidence* (from the RWE deck's
  stakeholder map); *Three retrospective designs* (redrawn from the deck's
  study-design slide, positions taken from its geometry); methodology and
  cohort-definition wording extended from the abstracts file.
- **NextGen AI.** *How it works* now opens with the ask → choose data → read
  the answer flow from the product deck, with the deck's example questions
  and follow-up actions. The example answer is shown as its structure with
  blanks, not with the deck's figures.

### Deliberately not used

- **The Avalere deck, in full.** It is another company's confidential
  business plan — P&L, BD timeline, pricing tiers, internal staff notes, and
  references to Excelra and Sanguine products. None of it describes
  Pharmatiya.
- **The pharma "network" slides.** They list companies at previous
  employers, and one version is titled "multiple discussions, no yield".
  Showing those names would claim clients the practice does not have.
- **The COVID-19 treatment slide.** A hypothetical with drug susceptibility
  figures for remdesivir and hydroxychloroquine. Unsafe to publish.
- **The COVID-19 sample abstract.** A template with XXX in every result.
- **The product deck's demo results** (12 million members, 580,000 metformin
  users, an average age of 36). Concept mock-up figures, not data.
- **Market-sizing slides**, the **$30k–$300k pricing** (Avalere's, not
  Pharmatiya's — client input 13 stays open), the **Aetna patent superlative**,
  the **"only scientist" sales claim**, the **current employer's name and
  strategy**, and a **third party's email address** on the poster.

### Questions this raised — answered 2026-09-17

- **Name the current employer?** No change: the work is described, the
  employer is not named.
- **"12 years" or "25+ years"?** 25+ stands.
- **Registered trademark.** Confirmed registered. The ® now follows the name
  in the header wordmark, the footer and the About name panel, hidden from
  screen readers; the footer states "Pharmatiya® is a registered trademark"
  in words.
- **The RWE deck is marked "Confidential".** No change: its concepts stay
  paraphrased.

### Header fixes found while adding the mark

- Between roughly 1024 and 1150px the header broke "NextGen AI" and the
  booking link onto two lines. Labels are now kept on one line; they fit at
  the existing spacing with no overflow.
- The booking link was 42px tall with its arrow riding at the top edge — a
  side effect of the width-reserving label added to stop the nav shifting.
  A grid takes its baseline from its first item, and that item had zero
  height. The visible label now comes first. Tab positions are unchanged
  across pages.

### Security

- **The repository is public, and the résumé was downloadable from it**
  (raw.githubusercontent.com returned 200). Pages itself is fine — the
  Actions workflow deploys only the build. The four client source files are
  now untracked and the root is git-ignored for client material, **but they
  remain in the repository's history**. Making the repository private, or
  rewriting history, is needed to close this.

---

## 2026-09-08 — editorial redesign

Twelve commits, merged to `main` from
`claude/site-design-enhancement-66ierr`. Reviewed on merge: typecheck and
build both pass, 12 static routes generated.

**Two items still need a decision.** See *Open questions* — both are live on
`main` now rather than pending.

### Security

- **The résumé was downloadable from the live site.** GitHub Pages was serving
  the repository root, and every tracked file in a served directory is
  publicly fetchable — so `Rajesh Mehta Resumeh.docx` returned HTTP 200,
  along with the Phase 1 summary and the publications PDF. That file carries
  the personal phone number, personal email, pharmacy licence numbers, named
  client engagements and revenue figures that this project explicitly excludes
  from the site. The site was publishing precisely what it documents itself as
  withholding.

  Fixed by moving the published build into `docs/` and serving from there, so
  only the built site is exposed. Verified: all six pages return 200 from the
  new tree; the résumé and publications PDF return 404.

  **Requires a settings change:** Pages source must be set to *Branch `main`,
  folder `/docs`*. The root build was deliberately left in place so the live
  site keeps serving until that switch is made.

### Design

- **The visual system was rebuilt as an editorial research document** across
  all six routes. Proposition, routes, evidence, publications, service
  definitions and the voice of the copy are untouched — this is presentation
  only.

  Bone paper over cool grey, one muted petrol accent used sparingly, a single
  deep ground used exactly three times. A twelve-column grid with controlled
  asymmetry replaces the symmetrical stacks. The homepage reads as a numbered
  document — 01 the record, 02 services, 03 coverage, 04 the product — with
  the three services in three different arrangements rather than one repeated
  three times.

- **Every bordered container was removed** — thirteen down to zero — and
  replaced with rules, grid and space. Contact routing, case studies, the
  services index, the study finder, both paginations, the trust grid and the
  model/researcher comparison were all card sets.

- **New apparatus:** `SectionLabel` (running heads), `Statement`,
  `ArrowLink`, `Breadcrumbs`. `GraphGround` removed.

- Buttons are near-square and used once per page; every other action is an
  arrow link, including the header CTA. Form fields are bottom-ruled rather
  than boxed. Navigation marks the current page with a hairline rather than a
  weight change.

- **Accessibility fixes found while verifying:** `--color-faint` measured
  2.95:1 on paper — failing AA outright while carrying figure captions, entry
  counts and every mono label — and is now derived from the contrast
  requirement rather than set by eye. The publication-archive arrow was
  revealed on hover only, so it was neither an affordance at rest nor
  reachable by keyboard.

- Home was restored to the desktop navigation. The redesign had dropped it on
  the assumption the wordmark covers it, leaving the desktop bar showing five
  items where the mobile menu and footer both showed six.

### SEO and metadata

- Favicon added (`app/icon.svg`, a falling step curve — the Kaplan–Meier mark
  the site is built around) plus `apple-icon.png`. The missing favicon was the
  site's only console error. Both use Next's file convention rather than
  `metadata.icons`, which emits paths verbatim and therefore 404s under a
  basePath.
- Open Graph image, 1200×630, in the site's own visual language.
- Breadcrumbs rendered from `nav`, with matching `BreadcrumbList` JSON-LD so
  markup and structured data cannot disagree.
- Structured data consolidated into one `@graph`: Organization,
  ProfessionalService and WebSite, cross-referenced by `@id`. No street
  address or opening hours asserted, because neither has been supplied.
- `llms.txt` added, including three things a summariser should not get wrong:
  figures marked illustrative are not client results, no client is named, and
  pending markers await input rather than indicating something missing.
- Spectral was loading an italic face no markup uses. Fonts down from 36 files
  / 460K to 14.

### Open questions

1. **Pending markers no longer render.** `Pending` returns `null` unless
   `NEXT_PUBLIC_SHOW_PENDING=true`. The reasoning is sound for a public
   launch — "screenshot pending", "title to confirm" and the rest made a
   finished site read as unfinished. But the site has not launched, and the
   three client-facing documents in `docs/` all state that these markers are
   visible:

   - `content-required.html` — "the page carries a visible marker"
   - `content-required-summary.html` — "currently shows a visible 'title to
     confirm' marker"
   - `content-required-onepage.html` — "that part of the site says so"

   Verified: zero occurrences of pending text across the built Home, About,
   Services, NextGen AI and Contact pages.

   As merged, those three documents are wrong. Either the review build sets
   `NEXT_PUBLIC_SHOW_PENDING=true` while Pharmatiya is still reviewing, or the
   documents and their PDFs need rewording. Nothing is lost either way — the
   flags stay in `lib/site.ts` and the reasons stay in code comments.

2. **Build output is committed twice.** The root build remains in place
   alongside the `docs/` build so the live site does not go down mid-switch.
   Until Pages is pointed at `/docs`, the résumé is still fetchable from the
   live site — the fix is not in effect until that setting changes. Once it
   does, the root copy should be deleted. Note the
   `.github/workflows/deploy.yml` Actions workflow also still exists and builds
   from source — switching Pages to *GitHub Actions* instead would remove the
   need to commit any build output at all, and is the cleaner end state.

---

## 2026-09-08 — `main`

- One-page version of the content request (562 words), organised by what the
  client has to do rather than by where items land on the site.
- Two-page summary of the same.
- Print stylesheet and PDF of the 31-item content checklist. Print grid pinned
  explicitly: setting the print font-size in points changes what a `rem`
  resolves to, so A4's content width landed just under the 52rem breakpoint
  and the three columns silently collapsed.

## 2026-09-07 — `main`

- **Client content checklist** — 31 items audited from the codebase rather than
  from memory: every `<Pending>` marker rendering on the site, every `PENDING`
  note in `lib/site.ts`, and the two data files that ship empty by design.
- **Services stopped reusing the homepage's figures.** The cohort diagram and
  cost-effectiveness plane appeared on both pages, renumbered — so a visitor
  clicking a homepage teaser saw the same chart twice. Results now belong to
  Home and Evidence; Services carries a four-stage process rail per service.

## 2026-09-05 — `main`

- Firm voice throughout, and a drop-in team roster (`lib/team.ts`).
- The supplied publication record used across the site: 47 entries, 2003–2022,
  searchable and filterable, with DOI, PMID and patent links. Replaced the
  unverifiable "1,000+ synopses" claim with countable figures.
- Motion, scale and section rhythm — survival curves that draw as they scroll
  in, forest-plot intervals growing from their point estimates.

## 2026-09-04 — `main`

- Phase 1 website built in Next.js: six pages, statically exported.
- Study finder on the NextGen AI page, rebuilt from the search on the live
  site, which has no handler attached and returns nothing for any query.

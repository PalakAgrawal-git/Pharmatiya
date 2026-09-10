# Emergent prompts — Pharmatiya Health

Emergent is an agentic **app builder**, not a design tool. That makes it a
poor fit for the marketing site — which already exists as a Next.js static
export, is deployed, and does not need rebuilding — and a very good fit for
the things that site genuinely cannot do, because a static export has no
server.

**The real gaps today, verified in the code:**

| Gap | Current state |
|---|---|
| Contact form | `app/contact/page.tsx` offers a `mailto:` link only. There is no form and no backend. |
| Digest signup | `DigestSignup.tsx` calls `event.preventDefault()` and stops. The field is inert. |
| Publication search | `StudyFinder.tsx` filters a bundled JSON array in the browser. Fine at 47 records, not at 500. |
| Client portal / RWE-Builder | Lives at `app.pharmatiya.net`, entirely separate, undocumented. |

So use Emergent for **a companion service**, not a replacement site. Prompt 1
is the one worth running first.

> **Before you paste anything:** Emergent's default stack is React + FastAPI +
> MongoDB. The marketing site is Next.js 16 with a static export. Do not let
> it "migrate" or "improve" the existing site — ask it for a standalone
> service with a documented HTTP API, and wire the static site to that API
> afterwards. Say so explicitly; it will otherwise offer to rebuild everything.

---

## Part 1 — Context preamble (paste at the top of every prompt)

> **Client:** Pharmatiya Health, an independent health economics and outcomes
> research (HEOR) and real-world evidence (RWE) consultancy in the United
> States. Users are senior pharmaceutical and device staff — market access,
> medical affairs, HEOR — plus payer-side analysts.
>
> **Existing system, which you must not modify or rebuild:** a Next.js 16
> marketing site with a static export, deployed on GitHub Pages. It has no
> server runtime. I need a separate service with a documented JSON API that
> the static site can call from the browser.
>
> **Non-negotiable constraints:**
> - This is a healthcare-adjacent business. **No protected health information
>   (PHI) may be stored, logged, transmitted or accepted anywhere.** Reject and
>   do not persist any free-text field that looks like patient data.
> - Do not invent seed data: no fake client names, case studies, study
>   outcomes, testimonials, publications or metrics. Where sample data is
>   needed to demonstrate a screen, label it clearly as sample data.
> - Store no secrets in client-side code. Every API key stays server-side and
>   is read from environment variables.
> - All endpoints that accept input must rate-limit and validate server-side.
> - WCAG 2.1 AA for any UI you generate.
>
> **Visual system, if you generate any UI** — match these exactly:
> - Dark ground `#0b1211`; lifted panel `#1b2725`; recessed band `#0e1716`
> - Text `#e9ece9` primary, `#a7b1ad` secondary, `#8f9995` captions
> - Hairlines `#26332f`; control borders `#5a6b66`; single teal accent `#5cc4b2`
> - Fira Sans for UI and body; Instrument Serif for display lines only;
>   JetBrains Mono uppercase at 0.16em tracking for labels and figures
> - Hairline rules and whitespace instead of cards and shadows. No gradients on
>   components, no pill buttons, no icon sets, no stock imagery.

---

## Part 2 — Build prompts

### 1. Enquiry intake service — *start here*
> Build a standalone enquiry intake service with a JSON API and a minimal
> admin view.
>
> **Public endpoint** `POST /api/enquiries` accepting: name, work email,
> organisation, enquiry type (one of: evidence generation, real-world data
> analytics, access and value strategy, NextGen AI, other), and a message.
> Validate server-side, reject disposable-email domains, rate-limit by IP,
> and include a honeypot field plus a minimum time-on-form check rather than
> a CAPTCHA. On success, store the enquiry and send two emails: a
> notification to the practice and an acknowledgement to the sender stating
> the response window.
>
> **Admin view** behind authentication: a list of enquiries with status
> (new / acknowledged / qualified / closed), filterable by type and date,
> with a detail view and an internal notes field. No public registration —
> accounts are created by an administrator only.
>
> **Explicitly:** the message field must warn users not to include patient
> data, and the service must not log message bodies to stdout or to any
> third-party analytics.

### 2. Publication archive API
> Build a service that owns the practice's publication archive: 47 records
> today, designed for several hundred. Each record has year, authors, title,
> journal or conference, type (journal article, abstract, poster, patent,
> book chapter), DOI, and therapeutic areas as tags.
>
> Provide `GET /api/publications` with full-text search across title and
> authors, filters for year range, type and therapeutic area, sorting, and
> cursor pagination. Provide an authenticated admin UI to add, edit and
> bulk-import records from CSV. Return a stable JSON shape and document it
> with OpenAPI. Seed the database from a CSV I will supply — do not generate
> publication records yourself.

### 3. Evidence digest subscription
> Build a double opt-in email subscription service. `POST /api/subscribe`
> takes an email address and sends a confirmation link; only confirmed
> addresses enter the list. Provide one-click unsubscribe with a signed token
> that requires no login, an admin view of subscriber counts and confirmation
> rates, and a CSV export. Comply with CAN-SPAM: every message carries a
> physical postal address and a working unsubscribe link. Do not send any
> campaign automatically — composing and sending is a manual admin action.

### 4. Feasibility request tool
> Build an authenticated tool where a prospective client describes a research
> question and receives a structured feasibility summary. The form captures:
> the question, the population in plain language, the comparison, the outcome,
> the time horizon, and which data sources they already hold. It produces a
> PICOT-structured summary and a checklist of what would be needed to answer
> it, and routes the request to the practice.
>
> **Critical:** the tool must not state whether a study is feasible, estimate
> a sample size, or predict a result. It structures the question and hands it
> to a human. Every output screen must say that a researcher reviews the
> request before any answer is given.

---

## What to do with the output

- **Take:** the API, the database schema, the admin UI, the deployment.
- **Wire in:** point the static site's form at the new `POST /api/enquiries`
  endpoint, and swap `StudyFinder.tsx` from the bundled JSON to the
  publications API once it holds more records than a browser should.
- **Do not take:** any rebuild of the marketing site, any copy it writes, any
  seed data it invents, or any claim about the practice's capabilities.
- **Check before shipping:** that no API key appears in client-side bundles,
  that message bodies are not logged, and that the admin view is not
  publicly registrable.

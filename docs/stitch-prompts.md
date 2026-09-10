# Google Stitch prompts — Pharmatiya Health

Stitch generates screen layouts from a text description. It does **not** know
this codebase, will not reproduce the hand-authored SVG figures, and will
invent placeholder copy unless told not to. So the workflow that actually
works is:

1. Paste the **System preamble** (Part 1) at the top of every prompt.
2. Add **one screen prompt** (Part 2) underneath it.
3. Treat what comes back as **layout exploration only** — take the
   arrangement, not the code, not the colours it approximates, and never the
   copy it writes.

---

## Part 1 — System preamble (paste every time)

> Design a page for **Pharmatiya Health**, an independent health economics
> and outcomes research (HEOR) and real-world evidence (RWE) consultancy in
> the United States. The audience is senior: market access directors, medical
> affairs leads, HEOR managers and payer-side analysts at pharmaceutical and
> device companies. They read AI and vendor claims adversarially. The site
> must read as a scientific document, not as a SaaS product page.
>
> **Register.** Contemporary scientific journal. Apparatus is part of the
> identity: running heads, figure numbers, section marks, hairline rules.
> Hierarchy comes from scale, whitespace and typeface contrast — never from
> heavy weights, never from colour blocks, never from cards with shadows.
> No gradients on components, no glassmorphism, no rounded pill buttons, no
> icon sets, no stock photography, no hero illustration, no testimonial
> carousel, no logo wall.
>
> **Ground.** Dark. The page background is a deep blue-green near-black
> (#0b1211) with a fixed gradient: a teal pool at the top left, a faint warm
> wash at the top right, falling to #070d0c at the foot. Panels that need to
> lift off the ground use #1b2725; recessed bands use #0e1716.
>
> **Colour tokens — use these exact values.**
> - Background: `#0b1211` · Lifted panel: `#1b2725` · Recessed band: `#0e1716`
> - Primary text: `#e9ece9` · Secondary text: `#a7b1ad` · Captions/labels: `#8f9995`
> - Hairline rules: `#26332f` · Control borders: `#5a6b66`
> - Accent (single teal, spent sparingly): `#5cc4b2`
> - Data series: `#5cc4b2`, `#e0916d`, `#bcc08d`
>
> **Type — three voices, each with one job.**
> - **Fira Sans** — navigation, body, forms, listings, everything UI. Never above 600 weight.
> - **Instrument Serif** — display only. One clause per page, often italic, at 2.5–4rem.
> - **JetBrains Mono** — uppercase, letter-spaced 0.16em, at 11–13px. Section marks (`01 / THE RECORD`), figure numbers (`FIG. 01 / SURVIVAL ESTIMATE`), years, running heads. Never body copy.
>
> **Layout.** 12-column grid, max content width 85rem, page gutter scaling
> from 20px to 88px. Sections are separated by a 1px hairline rule and
> generous vertical padding (52–104px), not by background colour alternating
> on every section. Asymmetric columns are preferred over centred content.
>
> **Accessibility.** Every text colour must clear WCAG AA 4.5:1 against the
> surface it sits on. Control borders must clear 3:1. Minimum tap target 44px.
>
> **Content rule — this is absolute.** Do not invent client names, case
> studies, study outcomes, dataset names, therapeutic areas, testimonials,
> certifications, partner logos, employee numbers, revenue, accuracy
> percentages or ROI figures. Where you would normally place such content,
> place a labelled empty slot that says what is required instead.

---

## Part 2 — Screen prompts

Pick one and append it to the preamble.

### Homepage
> Design the homepage. Above the fold: a left column (7 of 12) with a small
> mono eyebrow, a two-line headline where only the closing clause switches to
> the italic display serif, a supporting paragraph, one filled primary button
> and one underlined text link with an arrow. The right column (5 of 12) holds
> a Kaplan–Meier survival chart hung on a hairline rule with a figure number
> and caption beneath it — no card, no frame, no shadow. Then, in order: a
> recessed statistics band with four figures; a "What we do" index of three
> services as repeated rows, each with a dark title block on the left, an
> argument in the middle and a data figure on the right; a data-coverage index
> numbered 01–03; a single lifted panel for the AI product; a closing
> call-to-action.

### Services detail page
> Design a services page with three long-form sections, alternating recessed
> and plain grounds. Each opens with a mono running head (`SERVICE 01 —`) and
> a hairline that runs to the edge. Inside: a two-column split with "The
> problem" set as a large statement on the left and "Our approach" as body
> copy on the right; below that a numbered horizontal process of four stages;
> below that two side-by-side lists, "Methodology" and "Deliverables". A
> sticky on-this-page navigation sits in the top right of the page header.

### Evidence / publications page
> Design a research archive page. A filterable list of 47 publications, each
> row showing year in mono, title, journal, and a DOI link, separated by
> hairline rules with no card or background per row. Above it, a therapeutic
> area matrix and a dataset coverage index. The page must work at 320px wide
> without horizontal scroll, so long DOI URLs must wrap.

### About page
> Design an about page in the firm's voice ("we", never a founder profile).
> Sections: a display-serif positioning statement; a recessed statistics band;
> a chronology told as a bar chart of published output per year from 2003 to
> 2022 with four working periods listed beneath it as a plain definition list;
> and a team roster of repeating entries, each with a name, a role and a
> three-line biography, ruled rather than boxed, that reads correctly with
> one entry or with eight.

### Contact page
> Design a contact page with a short form — name, work email, organisation,
> a select for enquiry type, and a message field — set on hairline-underlined
> inputs rather than boxed fields. Beside it, a column stating response time,
> what to include in a first message, and the office location. No map, no
> live-chat widget, no calendar embed.

---

## What to do with the output

- **Take:** section order, column splits, the rhythm of rules and space,
  ideas for the team roster and the publications list.
- **Ignore:** the generated code, its approximation of the palette, its
  typography scale, and every word of its copy.
- **Never paste generated copy into `lib/site.ts`.** That file is the single
  source of content for the site and everything in it is either supplied by
  the client or marked `PENDING`.

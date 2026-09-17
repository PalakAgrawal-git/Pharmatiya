import type { Synopsis } from "@/lib/synopsis";

/**
 * The synopsis as a client deliverable.
 *
 * On the website the synopsis was set in the website's own type and colours,
 * which made the thing a client receives look like a page of our site. This
 * renders it as a document instead: white paper, a letterhead, a reference
 * number, a draft status, numbered sections and tables.
 *
 * One HTML string serves three purposes, so they cannot drift apart:
 *   - the in-app viewer shows it in an iframe,
 *   - "Save as PDF" prints that iframe (the browser's own PDF output),
 *   - "Download Word" saves it as a .doc, which Word opens as a document.
 *
 * All styling is inline in the string and independent of the site's theme,
 * because the file has to look the same wherever it is opened.
 */

export type DocumentMeta = {
  reference: string;
  date: string;
};

export function makeMeta(seed: string, when = new Date()): DocumentMeta {
  const y = when.getFullYear();
  const m = String(when.getMonth() + 1).padStart(2, "0");
  const d = String(when.getDate()).padStart(2, "0");
  return {
    reference: `PH-SYN-${y}${m}${d}-${seed.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase()}`,
    date: when.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 18mm 16mm 20mm; }
  * { box-sizing: border-box; }
  html { background: #e9ecea; }
  body {
    margin: 0; padding: 32px 16px 48px;
    font-family: "Fira Sans", Calibri, Arial, sans-serif;
    color: #1d2624; font-size: 10.5pt; line-height: 1.55;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page {
    max-width: 794px; margin: 0 auto; background: #fff;
    padding: 56px 64px 48px; box-shadow: 0 2px 24px rgba(0,0,0,.12);
  }
  @media print {
    html, body { background: #fff; padding: 0; }
    .page { box-shadow: none; padding: 0; max-width: none; }
  }
  @media (max-width: 600px) { .page { padding: 32px 22px; } }

  .letterhead { display: flex; justify-content: space-between; align-items: flex-end;
    gap: 24px; padding-bottom: 14px; border-bottom: 2px solid #2f8f81; }
  .brand { font-size: 17pt; letter-spacing: -.01em; color: #0f1a18; }
  .brand span { color: #6b7572; }
  .brand sup { font-size: 7pt; }
  .docmeta { text-align: right; font-size: 8.5pt; color: #56605d; line-height: 1.5; }
  .docmeta b { color: #1d2624; font-weight: 600; }

  .kind { margin: 30px 0 0; font-size: 8pt; letter-spacing: .16em; text-transform: uppercase; color: #2f8f81; font-weight: 600; }
  h1 { margin: 6px 0 0; font-size: 21pt; line-height: 1.2; font-weight: 400; letter-spacing: -.015em; color: #0f1a18; }
  .status { margin: 18px 0 0; padding: 9px 12px; border-left: 3px solid #b8892a; background: #fbf6ea;
    font-size: 9pt; color: #5c4712; }

  table { width: 100%; border-collapse: collapse; margin: 10px 0 0; page-break-inside: avoid; }
  th, td { text-align: left; vertical-align: top; padding: 7px 10px; border: 1px solid #d6dcda; font-size: 9.5pt; }
  th { width: 28%; background: #f2f5f4; font-weight: 600; color: #2a3431; }
  .summary { margin-top: 20px; }

  h2 { margin: 30px 0 0; padding-top: 12px; border-top: 1px solid #d6dcda;
    font-size: 12.5pt; font-weight: 600; color: #0f1a18; page-break-after: avoid; }
  h2 .n { display: inline-block; min-width: 30px; color: #2f8f81; }
  h3 { margin: 16px 0 0; font-size: 10.5pt; font-weight: 600; color: #2a3431; page-break-after: avoid; }
  h3 .n { color: #6b7572; font-weight: 400; margin-right: 6px; }
  p { margin: 8px 0 0; }
  ul { margin: 6px 0 0; padding-left: 18px; }
  li { margin: 3px 0 0; }
  .lede { color: #3d4744; }
  .problem { margin: 10px 0 0; padding: 12px 14px; background: #f2f5f4; border-radius: 3px; font-style: italic; }
  .funnel { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 0; padding: 0; list-style: none; }
  .funnel li { margin: 0; padding: 4px 10px; border: 1px solid #b9d9d3; background: #eef7f5; border-radius: 12px; font-size: 9pt; }
  .text { white-space: pre-wrap; }

  .signoff { margin-top: 32px; page-break-inside: avoid; }
  .signoff td { height: 38px; }
  footer { margin-top: 36px; padding-top: 10px; border-top: 1px solid #d6dcda;
    display: flex; justify-content: space-between; gap: 16px; font-size: 8pt; color: #6b7572; }
`;

function shell(meta: DocumentMeta, title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — ${esc(meta.reference)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>${CSS}</style></head>
<body><div class="page">
<div class="letterhead">
  <div class="brand">Pharmatiya<sup>&reg;</sup> <span>Health</span></div>
  <div class="docmeta">HEOR / RWE Study Synopsis<br>Reference <b>${esc(meta.reference)}</b><br>${esc(meta.date)}</div>
</div>
${body}
<footer><span>Pharmatiya Health &middot; Confidential draft</span><span>${esc(meta.reference)}</span></footer>
</div></body></html>`;
}

const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

export function synopsisDocumentHtml(s: Synopsis, meta: DocumentMeta): string {
  let n = 0;
  const section = (title: string, inner: string) => {
    n += 1;
    return `<h2><span class="n">${n}.</span>${esc(title)}</h2>${inner}`;
  };

  // Sections are numbered as they are produced, so they must be produced in
  // the order they appear on the page.
  const problem = section("Problem statement", `<p class="problem">${esc(s.problem)}</p>`);
  const question = section(
    "Study question",
    `<p class="lede">The question the evidence has to answer, set out in population, exposure, comparator, outcome and time terms.</p>
     <table>${s.question.map((q) => `<tr><th>${esc(q.label)}</th><td>${esc(q.value)}</td></tr>`).join("")}</table>`,
  );
  const steps = s.steps
    .map((step) => {
      const k = n + 1;
      const subs = step.sections
        .map((sec, i) => {
          const content =
            sec.heading === "Conversion funnel"
              ? `<ol class="funnel">${sec.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`
              : list(sec.items);
          return `<h3><span class="n">${k}.${i + 1}</span>${esc(sec.heading)}</h3>${content}`;
        })
        .join("");
      return section(`${step.step} — ${step.name}`, subs);
    })
    .join("");
  const value = section(
    "Value by stakeholder",
    `<table>${s.value.map((v) => `<tr><th>${esc(v.audience)}</th><td>${esc(v.message)}</td></tr>`).join("")}</table>`,
  );
  const review = section("Review and limitations", list(s.review));

  const body = `
<p class="kind">Study synopsis &middot; Draft</p>
<h1>${esc(s.title)}</h1>
<div class="status"><b>Draft for expert review.</b> Prepared with Pharmatiya NextGen AI in Pharmatiya&rsquo;s three-step framework. A Pharmatiya researcher reviews and signs off every synopsis before it is used.</div>

<table class="summary">
  <tr><th>Prepared for</th><td>${esc(s.audience.join(", "))} stakeholders</td></tr>
  <tr><th>Condition</th><td>${esc(s.condition ?? "As defined in the problem statement")}</td></tr>
  <tr><th>Data sources</th><td>${esc(s.sources.join("; "))}</td></tr>
  <tr><th>Framework</th><td>Step 0 Feasibility &middot; Step 1 Retrospective study &middot; Step 2 Pragmatic outreach</td></tr>
  <tr><th>Status</th><td>Draft &mdash; not for distribution until reviewed</td></tr>
</table>

${problem}
${question}
${steps}
${value}
${review}

<table class="signoff">
  <tr><th>Reviewed by</th><td></td><th style="width:14%">Date</th><td style="width:22%"></td></tr>
  <tr><th>Approved for client use</th><td></td><th>Date</th><td></td></tr>
</table>`;

  return shell(meta, s.title, body);
}

/** For a synopsis returned as free text by a model-backed service. */
export function textDocumentHtml(text: string, meta: DocumentMeta): string {
  const body = `
<p class="kind">Study synopsis &middot; Draft</p>
<h1>HEOR / RWE study synopsis</h1>
<div class="status"><b>Draft for expert review.</b> Prepared with Pharmatiya NextGen AI. A Pharmatiya researcher reviews and signs off every synopsis before it is used.</div>
<div class="text" style="margin-top:22px">${esc(text)}</div>`;
  return shell(meta, "HEOR / RWE study synopsis", body);
}

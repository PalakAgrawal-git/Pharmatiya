/**
 * Selected published studies.
 *
 * Every figure here is quoted from an abstract or poster Pharmatiya supplied
 * ("All Abstracts - MP.docx" and the ICAAC poster file), and every study is
 * in data/publications.json under the id given. Nothing is rounded,
 * extrapolated or restated as a stronger claim than the authors made.
 *
 * These are published studies, not client engagements, and the page says so.
 * Our principal is a co-author on each; where he is not the first author the
 * citation shows it, because a credit list that reads as sole authorship when
 * it is not is exactly the kind of claim a reviewer checks.
 *
 * Deliberately excluded from the same source file:
 *   - the COVID-19 "sample report", which is a template with XXX in place of
 *     every result and was never a finding;
 *   - individual drug–outcome ratios from the sentinel study, which read as
 *     safety findings out of context and were published as illustrations of
 *     the method only;
 *   - "Beyond USA 300", which has no venue or year in the material supplied.
 */

export type Study = {
  id: string;
  /** Matching entry in data/publications.json. */
  archiveId: string;
  area: string;
  title: string;
  citation: string;
  /** The one number a reader should leave with, and what it measures. */
  lead: { value: string; label: string };
  question: string;
  data: string;
  method: string;
  finding: string;
  /** A study that found no difference, marked as such rather than hidden. */
  null?: boolean;
};

export const studies: Study[] = [
  {
    id: "sentinel",
    archiveId: "p23",
    area: "Pharmacovigilance",
    title: "A claims-based sentinel system for drug safety",
    citation:
      "Wei H, Mehta R, Steinberg G. ISPOR 18th Annual International Meeting, 2013.",
    lead: { value: "47,319", label: "indication–drug–outcome combinations, in under 48 hours" },
    question:
      "Can relationships between indications, drugs and outcomes be surfaced from routine claims fast enough to direct further study?",
    data:
      "De-identified claims for five million people over twelve months.",
    method:
      "Relative risk and chi-square for every combination of 73 drug categories and 39 health outcomes of interest. Indication from ICD-9 claims, exposure from NDC refills, and an outcome counted only if it appeared in months 6–12 and not in months 1–6.",
    finding:
      "The system produced 47,319 combinations in under 48 hours. At a threshold of at least five patients and a chi-square above 5, 13,094 of them (28%) were flagged for closer inspection — a way of targeting analysis rather than a list of conclusions.",
  },
  {
    id: "hai-burden",
    archiveId: "p22",
    area: "Infectious disease",
    title: "Incidence and cost of healthcare-associated infections",
    citation:
      "Pombo DJ, Lopansri BK, Keane M, Taylor C, Kleckner R, Sumner S, Mehta RR, Burke JP. IDSA, 2013.",
    lead: { value: "$33,626", label: "median total cost per patient with a healthcare-associated infection" },
    question:
      "What do device- and non-device-related infections actually cost an integrated health system, and how often do they occur?",
    data:
      "79,839 admissions from 62,647 adult patients at two urban hospitals, July 2008 to September 2010.",
    method:
      "Electronic surveillance with every case verified against NHSN definitions by three infection preventionists; clinical, cost and demographic data drawn from the enterprise data warehouse.",
    finding:
      "2,707 infections in 2,080 patients — 3.3% of patients, 8.5 per 1,000 patient-days, with a median stay of 12 days. Nearly half were not device-related, and C. difficile had become the most common microbial cause.",
  },
  {
    id: "cauti-coding",
    archiveId: "p27",
    area: "Infectious disease",
    title: "The under-estimated cost of catheter-associated UTI",
    citation:
      "Dascomb K, Mehta RR, Pombo DJ, Burke JP. IDSA 47th Annual Meeting, 2008.",
    lead: { value: "1.2% vs 5.6%", label: "of Medicare encounters coded for the infection, against those who actually developed it" },
    question:
      "When Medicare stopped paying for hospital-acquired infections, did the coded record reflect how often they happened?",
    data:
      "56,554 patients with an indwelling catheter at two tertiary hospitals, 2000–2008, including 28,888 Medicare patients.",
    method:
      "Matched case–control: 277 coded cases matched on sex, facility, surgery, admission year, severity of illness and DRG.",
    finding:
      "382 patients were coded; 1,604 developed the infection. Cases stayed longer (14.2 against 11.0 days) and cost more ($16,913 against $15,553 median per encounter). Cost estimates built on coded cases understate the real burden.",
  },
  {
    id: "rapid-id",
    archiveId: "p50",
    area: "Infectious disease",
    title: "Rapid versus overnight bacterial identification",
    citation:
      "Mehta RR, Burke JP, Pombo DJ. ICAAC, poster D-697.",
    lead: { value: "No difference", label: "in length of stay, variable cost or mortality" },
    question:
      "Would switching to a rapid identification platform deliver the shorter stays and lower costs reported elsewhere?",
    data:
      "1,959 inpatients at two hospitals — 653 cases and 1,306 matched controls — January 2002 to August 2003.",
    method:
      "Retrospective case–control, two controls per case matched on sex, APR-DRG severity and specimen type. Kaplan–Meier analysis of length of stay, adjusted for patients who died.",
    finding:
      "Turnaround was 61 against 62 hours, median stay 7.2 against 7.7 days, and median variable cost $6,875 against $7,566 — none significant. At day 25, 13% against 16% remained in hospital (log-rank 1.68, not significant).",
    null: true,
  },
];

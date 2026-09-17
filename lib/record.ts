import publicationData from "@/data/publications.json";

/**
 * Figures derived from the published record.
 *
 * These were typed out by hand — "47", "14", "forty-five dated entries" —
 * in four places, and every one of them went stale the moment the archive
 * gained an entry. They are counted here instead, at build time, so the
 * homepage band, the About chronology and the Evidence page cannot disagree
 * with the list they describe.
 */

type Entry = {
  year: number | null;
  type: string;
  topics: string[];
};

const entries = publicationData.publications as Entry[];

const dated = entries
  .map((entry) => entry.year)
  .filter((year): year is number => year !== null);

export const record = {
  total: entries.length,
  peerReviewed: entries.filter((entry) => entry.type === "publication").length,
  dated: dated.length,
  firstYear: Math.min(...dated),
  lastYear: Math.max(...dated),
  areas: new Set(entries.flatMap((entry) => entry.topics)).size,
};

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** Spelled out, for the start of a sentence. Covers 0–99, which is ample. */
export function inWords(n: number): string {
  if (n < 20) return WORDS[n];
  const tens = TENS[Math.floor(n / 10)];
  const unit = n % 10;
  return unit === 0 ? tens : `${tens}-${WORDS[unit]}`;
}

export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

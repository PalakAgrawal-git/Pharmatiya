"use client";

import { useId, useMemo, useState } from "react";
import publicationData from "@/data/publications.json";
import { DataLabel } from "@/components/ui/DataLabel";

type Publication = {
  id: string;
  citation: string;
  year: number | null;
  type: string;
  venue: string | null;
  link: string | null;
  topics: string[];
  methods: string[];
};

const publications = publicationData.publications as Publication[];
const PER_PAGE = 8;

const TYPE_LABEL: Record<string, string> = {
  publication: "Peer-reviewed",
  poster: "Poster",
  abstract: "Abstract",
  patent: "Patent",
  "book chapter": "Book chapter",
  presentation: "Invited talk",
};

const filters = [
  { id: "all", label: "All" },
  { id: "publication", label: "Peer-reviewed" },
  { id: "poster", label: "Posters" },
  { id: "abstract", label: "Abstracts" },
  { id: "patent", label: "Patents" },
  { id: "book chapter", label: "Book chapters" },
];

/**
 * The published record, from the bibliography Pharmatiya supplied.
 *
 * This is the strongest verifiable proof on the site: every entry is a real
 * citation, and the ones carrying a DOI, PMID or patent number link out so a
 * sceptical buyer can check them without asking us for anything.
 *
 * Only the published record appears here — no personal contact details, no
 * licence numbers, and no client engagement that is not already in the
 * literature.
 */
export default function PublicationList() {
  const [term, setTerm] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(0);
  const inputId = useId();

  const results = useMemo(() => {
    const needle = term.toLowerCase().trim();

    return publications.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (!needle) return true;

      const haystack = [
        item.citation,
        item.venue ?? "",
        item.topics.join(" "),
        item.methods.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return needle
        .split(/\s+/)
        .every((word) => haystack.includes(word));
    });
  }, [term, type]);

  const pageCount = Math.ceil(results.length / PER_PAGE);
  const shown = results.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const reset = (fn: () => void) => {
    fn();
    setPage(0);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="flex min-w-[15rem] flex-1 flex-col gap-1.5">
          <label htmlFor={inputId} className="font-mono text-caption text-muted">
            Filter by keyword
          </label>
          <input
            id={inputId}
            type="search"
            value={term}
            onChange={(event) => reset(() => setTerm(event.target.value))}
            placeholder="e.g. atrial fibrillation, claims, machine learning"
            className="min-h-12 w-full rounded-[2px] border border-rule bg-surface px-3.5 py-3 text-body text-ink placeholder:text-faint focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {filters.map((filter) => {
          const active = type === filter.id;
          const count =
            filter.id === "all"
              ? publications.length
              : publications.filter((item) => item.type === filter.id).length;

          if (count === 0) return null;

          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => reset(() => setType(filter.id))}
              className={`inline-flex min-h-11 items-center gap-2 rounded-[2px] border px-3.5 font-mono text-caption transition-colors ${
                active
                  ? "border-accent bg-accent text-paper"
                  : "border-rule bg-surface text-muted hover:border-rule-firm hover:text-ink"
              }`}
            >
              {filter.label}
              <span className={active ? "text-paper/70" : "text-faint"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 font-mono text-caption text-faint" aria-live="polite">
        {results.length} of {publications.length} entries
        {term && ` matching “${term}”`}
      </p>

      {results.length === 0 ? (
        <p className="measure mt-4 text-small text-muted">
          Nothing matches that. Try a broader term — the bibliography spans
          infectious disease, cardiology, diabetes, mental health and health
          economics.
        </p>
      ) : (
        <ol className="mt-4 border-t border-rule">
          {shown.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 border-b border-rule py-5 lg:grid-cols-[7rem_1fr] lg:gap-8"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[1.15rem] font-semibold tabular text-accent-deep">
                  {item.year ?? "—"}
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-faint">
                  {TYPE_LABEL[item.type] ?? item.type}
                </span>
              </div>

              <div>
                <p className="text-small text-ink">{item.citation}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {item.venue && (
                    <span className="font-mono text-caption text-muted">
                      {item.venue}
                    </span>
                  )}
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="font-mono text-[0.7rem] text-faint"
                    >
                      {topic}
                    </span>
                  ))}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-caption text-accent underline underline-offset-4"
                    >
                      Source
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Publication pages"
          className="mt-6 flex items-center gap-4"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex min-h-11 items-center rounded-[2px] border border-rule bg-surface px-4 font-mono text-caption text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-caption text-faint">
            Page {page + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex min-h-11 items-center rounded-[2px] border border-rule bg-surface px-4 font-mono text-caption text-ink disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}

      <p className="mt-6 border-t border-rule pt-4 text-caption text-faint">
        <DataLabel as="span">Note</DataLabel> — selected bibliography, 2003 to
        2022. Entries with a DOI, PMID or patent number link to the source.
      </p>
    </div>
  );
}

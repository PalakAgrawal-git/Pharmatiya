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
          <label htmlFor={inputId} className="label text-faint">
            Filter by keyword
          </label>
          <input
            id={inputId}
            type="search"
            value={term}
            onChange={(event) => reset(() => setTerm(event.target.value))}
            placeholder="e.g. atrial fibrillation, claims, machine learning"
            className="min-h-12 w-full rounded-none border-0 border-b border-rule-firm bg-transparent px-0 py-3 text-body text-ink transition-colors placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Typographic tabs rather than pills: an archive is browsed, and a row
          of filled capsules reads as a toolbar. The active tab is marked by a
          rule under it and by ink, the same convention the navigation uses. */}
      <div
        className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-b border-rule pb-3"
        role="group"
        aria-label="Filter by type"
      >
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
              className={`group relative inline-flex min-h-9 items-baseline gap-2 text-small transition-colors after:absolute after:inset-x-0 after:-bottom-[13px] after:h-px after:transition-colors ${
                active
                  ? "text-ink after:bg-accent"
                  : "text-muted after:bg-transparent hover:text-ink"
              }`}
            >
              {filter.label}
              <span className={`label text-[0.7rem] tabular ${active ? "text-accent" : "text-faint"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="label mt-6 tabular text-faint" aria-live="polite">
        {results.length} of {publications.length} entries
        {term && ` matching “${term}”`}
      </p>

      {results.length === 0 ? (
        <p className="measure mt-4 text-small text-muted">
          Nothing matches that. Try a broader term — our published work spans
          infectious disease, cardiology, diabetes, mental health and health
          economics.
        </p>
      ) : (
        <ol className="mt-10 border-t border-rule">
          {shown.map((item) => {
            const Row = item.link ? "a" : "div";
            return (
              <li key={item.id} className="border-b border-rule">
                {/* The whole row is the target where a source exists, so the
                    hit area matches the visual row rather than a small link at
                    the end of it. Hover is a hairline of background, the
                    citation moving three pixels, and the arrow arriving —
                    nothing that moves the layout. */}
                <Row
                  {...(item.link
                    ? {
                        href: item.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className={`group grid gap-x-10 gap-y-3 px-1 py-7 no-underline transition-colors duration-200 lg:grid-cols-[6rem_minmax(0,1fr)_9rem_1.5rem] ${
                    item.link ? "hover:bg-surface focus-visible:bg-surface" : ""
                  }`}
                >
                  <span className="label tabular text-ink">
                    {item.year ?? "—"}
                  </span>

                  <span className="min-w-0">
                    <span className="block break-words text-[1.0625rem] leading-[1.5] text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
                      {item.citation}
                    </span>
                    {item.topics.length > 0 && (
                      <span className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                        {item.topics.map((topic) => (
                          <span key={topic} className="label-sm text-faint">
                            {topic}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>

                  <span className="label-sm self-start text-faint lg:text-right">
                    {item.venue ?? TYPE_LABEL[item.type] ?? item.type}
                  </span>

                  {/* Only rendered where there is something to open. The
                      grid column still reserves the space, so rows with and
                      without a source stay aligned. */}
                  {item.link && (
                    <span
                      aria-hidden="true"
                      className="self-start text-small text-faint/60 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-accent group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] group-focus-visible:text-accent"
                    >
                      ↗
                    </span>
                  )}
                  {item.link && (
                    <span className="sr-only"> (source, opens in a new tab)</span>
                  )}
                </Row>
              </li>
            );
          })}
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
            className="label-sm inline-flex min-h-11 items-center border-b border-rule-firm pb-0.5 text-ink transition-colors hover:border-accent disabled:border-transparent disabled:opacity-40"
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
            className="label-sm inline-flex min-h-11 items-center border-b border-rule-firm pb-0.5 text-ink transition-colors hover:border-accent disabled:border-transparent disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}

      <p className="mt-6 border-t border-rule pt-4 text-caption text-faint">
        <DataLabel as="span">Note</DataLabel> — selected bibliography of work
        authored or co-authored by our team, 2003 to 2022. Entries with a DOI,
        PMID or patent number link to the source.
      </p>
    </div>
  );
}

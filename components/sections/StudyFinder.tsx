"use client";

import { useId, useMemo, useState } from "react";
import studyData from "@/data/studies.json";
import { DataLabel, Pending } from "@/components/ui/DataLabel";

type Study = {
  id: string;
  details: string;
  link: string;
  dataType: string;
  dataSource: string;
};

const studies = studyData.studies as Study[];
const PER_PAGE = 5;

/**
 * Study finder — a rebuild of the keyword search on the current homepage,
 * which fetches a Google Sheet and lists matching studies.
 *
 * Differences from the existing implementation, all deliberate:
 *
 * - It works. On the live site the Search button has no handler attached, so
 *   searchGoogleSheet() never runs and no results ever render.
 * - Terms of any length match. The original discards words under four
 *   characters, so "HIV", "CKD", "AF" and "COPD" return nothing — in this
 *   field that rules out a lot of real queries.
 * - The first sheet row is not force-prepended to every result set. The
 *   original unshifts sheetData[1] onto each search, so the same record
 *   appears at the top of every query regardless of relevance.
 * - Enter submits, results are announced to screen readers, and the empty
 *   and no-match states say something useful.
 *
 * Data is baked in at build time by scripts/fetch-studies.mjs, so no API key
 * is shipped to the browser and the search runs with no network round-trip.
 */
export default function StudyFinder() {
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const inputId = useId();

  const results = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return [];

    const words = needle.split(/\s+/).filter(Boolean);

    return studies
      .map((study) => {
        const haystack = [
          study.details,
          study.dataType,
          study.dataSource,
        ]
          .join(" ")
          .toLowerCase();

        // One point per matching word, plus a bonus for the whole phrase, so
        // a full-phrase hit outranks scattered word hits.
        let score = words.reduce(
          (total, word) => (haystack.includes(word) ? total + 1 : total),
          0,
        );
        if (words.length > 1 && haystack.includes(needle)) score += words.length;

        return { study, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.study);
  }, [query]);

  const pageCount = Math.ceil(results.length / PER_PAGE);
  const shown = results.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const submit = () => {
    setQuery(term);
    setPage(0);
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        role="search"
        className="flex flex-wrap items-end gap-3"
      >
        <div className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <label htmlFor={inputId} className="font-mono text-caption text-muted">
            Search the study list
          </label>
          <input
            id={inputId}
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="A condition, a data type, a method — e.g. infection"
            className="min-h-12 w-full rounded-[2px] border border-rule bg-surface px-3.5 py-3 text-body text-ink placeholder:text-faint focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-accent bg-accent px-6 font-medium text-paper transition-colors hover:border-accent-deep hover:bg-accent-deep"
        >
          Search
        </button>
      </form>

      <div aria-live="polite" className="mt-6">
        {studies.length === 0 ? (
          <div className="border border-dashed border-rule-firm bg-surface p-5">
            <p className="measure text-small text-muted">
              The study list has not been loaded into this build yet.{" "}
              <Pending>Run npm run studies</Pending>
            </p>
            <p className="measure mt-2 text-small text-faint">
              It reads the same spreadsheet the current site uses, at build
              time rather than in the browser.
            </p>
          </div>
        ) : !query ? (
          <p className="text-small text-faint">
            {studies.length} studies indexed. Search a condition, a data type
            or a method.
          </p>
        ) : results.length === 0 ? (
          <p className="measure text-small text-muted">
            Nothing in the indexed studies matches “{query}”. That does not
            mean we have not worked on it — the list is a sample, not the whole
            archive.{" "}
            <a href="/contact/" className="text-accent underline underline-offset-4">
              Ask us directly
            </a>
            .
          </p>
        ) : (
          <>
            <p className="mb-4 font-mono text-caption text-faint">
              {results.length} {results.length === 1 ? "study" : "studies"}{" "}
              matching “{query}”
            </p>

            <div className="scroll-x border border-rule">
              <table className="w-full min-w-[44rem] border-collapse text-small">
                <thead>
                  <tr className="bg-sunk">
                    {["Study details", "Type of data", "Data source", ""].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="border-b border-rule px-4 py-3 text-left font-mono text-caption font-medium uppercase tracking-[0.1em] text-faint"
                        >
                          {heading || <span className="sr-only">Link</span>}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((study) => (
                    <tr key={study.id} className="border-b border-rule last:border-0">
                      <td className="px-4 py-3 align-top text-ink">
                        {study.details}
                      </td>
                      <td className="px-4 py-3 align-top text-muted">
                        {study.dataType}
                      </td>
                      <td className="px-4 py-3 align-top text-muted">
                        {study.dataSource}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {study.link.startsWith("http") && (
                          <a
                            href={study.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-caption text-accent underline underline-offset-4"
                          >
                            Open
                            <span className="sr-only">
                              {" "}
                              study detail (opens in a new tab)
                            </span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <nav
                aria-label="Study results pages"
                className="mt-4 flex items-center gap-4"
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
          </>
        )}
      </div>

      <p className="mt-5 text-caption text-faint">
        <DataLabel as="span">Note</DataLabel> — the list is a published sample
        of prior work. Client identities are not included.
      </p>
    </div>
  );
}

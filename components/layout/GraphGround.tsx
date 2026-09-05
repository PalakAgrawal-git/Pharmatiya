/**
 * The plotting-paper ground, extracted from the homepage hero so every page
 * intro can carry it.
 *
 * Page intros were previously plain `paper`, which meant the first section of
 * every inner page sat on the same ground as the section beneath it — the
 * homepage's "never two grounds in a row" rule stopped at the homepage. This
 * gives each intro a surface without a gradient, and it reads as one site
 * rather than one designed page and five documents.
 *
 * The parent section must be `relative overflow-hidden`.
 */
export default function GraphGround() {
  return (
    <>
      <div
        aria-hidden="true"
        className="graph-ground pointer-events-none absolute inset-0"
      />
      {/* Fades the grid out toward the baseline so it never competes with
          whatever section follows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-paper"
        style={{
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </>
  );
}

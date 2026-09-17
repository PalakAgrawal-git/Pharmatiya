/**
 * Typographic wordmark.
 *
 * The ® is confirmed by the client: Pharmatiya is a registered mark. It is
 * hidden from assistive technology, where "registered" read after every
 * mention of the name is noise; the footer carries the notice in words.
 *
 * PENDING client input 8 — the real logo is only available as a raster JPEG
 * on the current site. Once an SVG or AI file arrives this component is
 * replaced with the vector mark; everything referencing it stays unchanged.
 */
export default function Wordmark() {
  return (
    <span className="display text-[1.35rem] leading-none text-ink">
      Pharmatiya
      <sup aria-hidden="true" className="ml-[0.05em] align-super text-[0.45em] font-normal">®</sup>
      <span className="ml-[0.35em] font-normal text-faint">Health</span>
    </span>
  );
}

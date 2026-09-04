/**
 * Typographic wordmark.
 *
 * PENDING client input 8 — the real logo is only available as a raster JPEG
 * on the current site. Once an SVG or AI file arrives this component is
 * replaced with the vector mark; everything referencing it stays unchanged.
 */
export default function Wordmark() {
  return (
    <span className="font-display text-[1.3rem] font-semibold leading-none tracking-[-0.02em] text-ink">
      Pharmatiya
      <span className="ml-[0.35em] font-normal text-faint">Health</span>
    </span>
  );
}

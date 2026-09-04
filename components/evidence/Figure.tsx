import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  number: string;
  caption: string;
  illustrative?: boolean;
  source?: string;
  className?: string;
};

/**
 * Figure wrapper: number, caption stating the finding, and — where the data
 * is not drawn from real client work — a persistent ILLUSTRATIVE DATA marker.
 * That marker is a condition of publishing, not a style choice.
 */
export default function Figure({
  children,
  number,
  caption,
  illustrative = true,
  source,
  className = "",
}: Props) {
  return (
    <figure className={className}>
      {children}

      <figcaption className="mt-3 border-l-2 border-rule pl-3.5 text-caption text-faint">
        <span className="font-mono text-ink">Fig. {number}</span>{" "}
        <span className="text-muted">{caption}</span>
        {illustrative && (
          <>
            {" "}
            <span className="font-mono uppercase tracking-[0.08em] text-flag">
              Illustrative data
            </span>
          </>
        )}
        {source && <span className="block mt-1">Source: {source}</span>}
      </figcaption>
    </figure>
  );
}

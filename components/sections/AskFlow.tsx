import Reveal from "@/components/motion/Reveal";

/**
 * How a synopsis is made, in three moves.
 *
 * This follows the live product, not the earlier concept deck. The deck
 * pictured a data-source picker and query results; the product that shipped
 * takes one problem statement and returns a structured synopsis, and the
 * builder on this page does the same. Describing a step the product does not
 * have, directly beside the product, would be the first thing a client
 * noticed.
 *
 * Set on the inverted ground of the section it sits in.
 */
const moves = [
  {
    n: "01",
    label: "Describe",
    title: "The problem, in plain language",
    body: "A business, clinical or evidence question — who it is for, which patients, what data you hold. A sentence or two is enough.",
    example: "“A payer-facing synopsis for migraine patients cycling through acute therapies, using claims and EHR data.”",
  },
  {
    n: "02",
    label: "Structure",
    title: "Laid into the framework",
    body: "Feasibility first: cohort logic and code families. Then the retrospective study: objectives, endpoints, cost and the statistical plan. Then pragmatic outreach: workflow, funnel and dashboards.",
  },
  {
    n: "03",
    label: "Review",
    title: "Checked by a researcher",
    body: "The draft is copied or downloaded, then reviewed — code lists, windows and sample sizes confirmed against the data — before anything reaches a client.",
  },
];

export default function AskFlow() {
  return (
    <ol className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
      {moves.map((move, index) => (
        <Reveal
          as="li"
          key={move.n}
          delay={index * 110}
          className="border-t border-white/20 pt-6"
        >
          <p className="label tabular text-white/45">
            {move.n} / {move.label}
          </p>
          <h3 className="mt-4 text-[1.3rem] font-normal leading-tight text-white">
            {move.title}
          </h3>
          <p className="mt-4 text-small leading-[1.65] text-white/70">{move.body}</p>
          {move.example && (
            <p className="mt-5 border-l border-white/20 pl-3 text-small leading-[1.55] text-white/60">
              {move.example}
            </p>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

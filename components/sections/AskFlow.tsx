import Reveal from "@/components/motion/Reveal";

/**
 * How a question moves through the product, from Pharmatiya's own deck:
 * "Set your objective — select data source — get insights. Just ask your
 * question."
 *
 * The example questions and the follow-up actions are the deck's. The answer
 * is shown as its sentence structure with the figures left as blanks: the
 * deck's worked answer is a concept mock-up, and its numbers are not results
 * to be published — some of them would not survive a clinical reader. The
 * shape of the answer is the part that is true of the product.
 *
 * Set on the inverted ground of the section it sits in.
 */
const questions = [
  "Can you describe members who take metformin?",
  "Where is metformin being used?",
  "Describe the members and their outcomes — visits, adherence — for metformin users.",
  "What type of providers are prescribing metformin?",
];

const sources = ["Claims", "Electronic medical record", "Lab"];

const next = [
  "Ask another question",
  "See it as a table",
  "Switch databases",
  "Understand the data source",
  "Download",
];

function Blank({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded-[2px] border border-dashed border-white/30 px-1.5 font-mono text-[0.8em] text-white/55">
      {children}
    </span>
  );
}

export default function AskFlow() {
  return (
    <ol className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
      <Reveal as="li" className="border-t border-white/20 pt-6">
        <p className="label tabular text-white/45">01 / Ask</p>
        <h3 className="mt-4 text-[1.3rem] font-normal leading-tight text-white">
          Your question, in plain language
        </h3>
        <ul className="mt-5 flex flex-col gap-2.5">
          {questions.map((q) => (
            <li
              key={q}
              className="border-l border-white/20 pl-3 text-small leading-[1.5] text-white/70"
            >
              &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="li" delay={110} className="border-t border-white/20 pt-6">
        <p className="label tabular text-white/45">02 / Choose the data</p>
        <h3 className="mt-4 text-[1.3rem] font-normal leading-tight text-white">
          The source it should answer from
        </h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {sources.map((source) => (
            <li
              key={source}
              className="rounded-[3px] border border-white/25 px-3 py-1.5 text-small text-white/80"
            >
              {source}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-small leading-[1.6] text-white/55">
          The same question can be switched to another source afterwards, so
          the answers can be compared.
        </p>
      </Reveal>

      <Reveal as="li" delay={220} className="border-t border-white/20 pt-6">
        <p className="label tabular text-white/45">03 / Read the answer</p>
        <h3 className="mt-4 text-[1.3rem] font-normal leading-tight text-white">
          A written finding, then the next step
        </h3>
        <p className="mt-5 text-small leading-[1.9] text-white/75">
          Between <Blank>start</Blank> and <Blank>end</Blank>, out of{" "}
          <Blank>N</Blank> members with continuous enrolment, we identified{" "}
          <Blank>n</Blank> who took at least one dose of metformin. Their
          average age was <Blank>age</Blank> &hellip;
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {next.map((action) => (
            <li key={action} className="label-sm text-white/50">
              {action}
            </li>
          ))}
        </ul>
      </Reveal>
    </ol>
  );
}

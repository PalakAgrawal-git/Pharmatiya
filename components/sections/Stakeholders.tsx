import Reveal from "@/components/motion/Reveal";

/**
 * Who uses real-world evidence, and for what.
 *
 * From the stakeholder map in Pharmatiya's RWE presentation (Oct 2025),
 * rewritten as a list. The deck draws it as a six-segment wheel; a wheel is
 * a poor way to read six lists, and the order it imposes means nothing.
 * Here each stakeholder gets the same ruled cell, so a reader finds their own
 * row and reads across.
 *
 * The groupings follow the deck's layout: each list sits beside the segment
 * it belongs to. Nothing has been added to them.
 */
const stakeholders = [
  {
    name: "Payers",
    uses: [
      "Formulary decisions",
      "Care and disease management",
      "Risk stratification",
      "Utilisation and outcomes",
    ],
  },
  {
    name: "Manufacturers",
    uses: [
      "Repositioning and new indications",
      "Safety and efficacy in large, longitudinal populations",
      "New and linked data sources",
      "New trial designs and precision therapy",
      "Access and reimbursement, from the payer and provider perspective",
    ],
  },
  {
    name: "Providers",
    uses: [
      "Care delivery",
      "Adherence",
      "Cost",
      "Putting interventions into practice",
    ],
  },
  {
    name: "Regulators",
    uses: ["Safety", "Efficacy"],
  },
  {
    name: "Patients",
    uses: [
      "Patient-reported outcomes",
      "Treatment choices",
      "Analysis and visuals they can use",
    ],
  },
  {
    name: "Global",
    uses: ["Diverse data sources", "Electronic medical records"],
  },
];

export default function Stakeholders() {
  return (
    <ul className="grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
      {stakeholders.map((group, index) => (
        <Reveal
          as="li"
          key={group.name}
          delay={index * 70}
          className="rule-row border-t border-rule py-6"
        >
          <h3 className="text-[1.15rem] font-normal leading-tight">
            {group.name}
          </h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {group.uses.map((use) => (
              <li key={use} className="text-small leading-[1.5] text-muted">
                {use}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  );
}

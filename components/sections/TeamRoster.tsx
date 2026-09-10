import Image from "next/image";
import Link from "next/link";
import { team } from "@/lib/team";
import { DataLabel } from "@/components/ui/DataLabel";
import Slot from "@/components/ui/Slot";

/**
 * Team roster, rendered from lib/team.ts.
 *
 * Every field except name and role is optional, so a partly-filled entry
 * still reads as finished. Where there is no photograph the position holds
 * with a typographic panel rather than a stock portrait — a hard rule from
 * the brief, with no fallback to purchased imagery.
 */
export default function TeamRoster() {
  if (team.length === 0) {
    return (
      <div>
        <p className="measure text-muted">
          Team profiles are being finalised. Ask us directly and we will tell
          you who would run your study.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <Slot id={26}>
            Names, roles and a three-line biography for each person to appear
            here. The roster is a drop-in: add entries to
            <code> lib/team.ts </code> and this section fills itself.
          </Slot>
          <Slot id={8}>
            The role title to publish for Dr Mehta. The résumé, the brief and
            the live site each use a different one.
          </Slot>
          <Slot id={24}>
            A photograph per person, if wanted. Without one the position holds
            with a typographic panel; stock portraits are not an option here.
          </Slot>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {team.map((member) => (
        <article
          key={member.id}
          id={member.id}
          className="grid gap-x-16 gap-y-8 border-t border-rule py-12 first:border-t-0 first:pt-0 lg:grid-cols-12"
        >
          <div className="lg:col-span-3">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role} at Pharmatiya Health`}
                width={224}
                height={280}
                className="w-full max-w-[14rem] object-cover"
              />
            ) : (
              /* No portrait supplied yet (client input 1). A dashed box
                 announcing that to visitors reads as unfinished, so the
                 position holds as a typographic panel instead: initials set
                 large on a rule, the way a journal sets a contributor mark.
                 Replaced by the real photograph the moment one exists. */
              <div className="flex min-h-[13rem] items-end border-t border-ink/70 bg-transparent px-1 pb-4">
                <span
                  aria-hidden="true"
                  className="display text-[clamp(3rem,2rem+3vw,4.25rem)] leading-none text-ink/85"
                >
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 3)}
                </span>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h3 className="text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-medium leading-tight">
              {member.name}
              {member.credentials && (
                <span className="text-muted">, {member.credentials}</span>
              )}
            </h3>

            <p className="label mt-3 text-accent">{member.role}</p>

            <p className="measure mt-7 text-muted">{member.bio}</p>

            <dl className="mt-9 grid gap-x-12 gap-y-7 border-t border-rule pt-7 sm:grid-cols-2">
              {member.education && member.education.length > 0 && (
                <Detail label="Education" items={member.education} />
              )}
              {member.licensure && member.licensure.length > 0 && (
                <Detail label="Licensure" items={member.licensure} />
              )}
              {member.affiliations && member.affiliations.length > 0 && (
                <Detail label="Affiliations" items={[member.affiliations.join(" · ")]} />
              )}
              {member.credits && member.credits.length > 0 && (
                <div>
                  <dt className="label text-faint">Credits</dt>
                  <dd className="mt-2.5 text-small leading-[1.6] text-muted">
                    {member.credits.map((credit) => (
                      <span key={credit.label} className="block">
                        {credit.href ? (
                          <a
                            href={credit.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline underline-offset-4"
                          >
                            {credit.label}
                          </a>
                        ) : (
                          credit.label
                        )}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </article>
      ))}

      {/* The roster is populated, so the empty-state slots above never
          render — but the outstanding inputs are the same either way. */}
      <div className="mt-10 flex flex-col gap-4">
        <Slot id={26}>
          The rest of the team: name, role and a three-line biography each.
          Add entries to <code>lib/team.ts</code> and they appear here.
        </Slot>
        <Slot id={8}>
          The role title to publish for Dr Mehta. The résumé, the brief and
          the current site each give a different one.
        </Slot>
        <Slot id={24}>
          A photograph per person, if wanted. Without one the position holds
          with a typographic panel — stock portraits are not an option here.
        </Slot>
      </div>

      <p className="mt-10 border-t border-rule pt-6 text-small text-muted">
        Our published work, in full, is on the{" "}
        <Link href="/evidence/" className="text-accent underline underline-offset-4">
          Evidence page
        </Link>
        .
      </p>
    </div>
  );
}

function Detail({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <dt className="label text-faint">{label}</dt>
      <dd className="mt-2.5 text-small leading-[1.6] text-muted">
        {items.map((item) => (
          <span key={item} className="block">
            {item}
          </span>
        ))}
      </dd>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { team } from "@/lib/team";
import { DataLabel, Pending } from "@/components/ui/DataLabel";

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
      <div className="border border-dashed border-rule-firm bg-surface p-6 sm:p-8">
        <p className="measure text-muted">
          Team profiles — names, credentials and specialisms.{" "}
          <Pending>Pending</Pending>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {team.map((member) => (
        <article
          key={member.id}
          id={member.id}
          className="rule-row grid gap-6 border-t border-rule py-8 first:border-t-0 first:pt-0 lg:grid-cols-[14rem_1fr] lg:gap-10"
        >
          <div>
            {member.photo ? (
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role} at Pharmatiya Health`}
                width={224}
                height={280}
                className="w-full max-w-[14rem] object-cover"
              />
            ) : (
              <div className="flex min-h-[11rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-5 text-center">
                <DataLabel>Photograph</DataLabel>
                <p className="text-caption text-faint">Pending</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[1.35rem]">
              {member.name}
              {member.credentials && (
                <span className="text-muted">, {member.credentials}</span>
              )}
            </h3>

            <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-caption uppercase tracking-[0.1em] text-faint">
              {member.role}
              {member.roleConfirmed === false && (
                <Pending>Title to confirm</Pending>
              )}
            </p>

            <p className="measure mt-4 text-muted">{member.bio}</p>

            <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
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
                  <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
                    Credits
                  </dt>
                  <dd className="mt-1 text-small text-muted">
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

      <p className="mt-8 border-t border-rule pt-5 text-small text-muted">
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
      <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
        {label}
      </dt>
      <dd className="mt-1 text-small text-muted">
        {items.map((item) => (
          <span key={item} className="block">
            {item}
          </span>
        ))}
      </dd>
    </div>
  );
}

/**
 * Sending a form from a site with no server.
 *
 * The fields are POSTed to NEXT_PUBLIC_FORM_ENDPOINT: a Google Apps Script
 * web app writing into a sheet, or any handler on whatever host the site
 * moves to.
 *
 * With no endpoint configured — a local build, or a copy of the site hosted
 * somewhere without the setting — the form reports that and offers the email
 * address as a link the visitor can choose to click. It never opens a mail
 * client by itself: a form that hijacks the browser into Outlook reads as
 * broken, whatever it then puts in the draft.
 *
 * The body is JSON but the content type is text/plain deliberately. An
 * application/json POST is not a "simple" cross-origin request, so the
 * browser sends a preflight OPTIONS first — and an Apps Script web app
 * cannot answer one, so the submission fails before it is ever sent. As
 * text/plain there is no preflight; the script parses the body itself.
 *
 */
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export type SendResult = "sent" | "unconfigured";

export async function sendMessage(
  subject: string,
  fields: Record<string, string>,
): Promise<SendResult> {
  const filled = Object.entries(fields).filter(([, value]) => value.trim());

  if (!endpoint) return "unconfigured";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ subject, ...Object.fromEntries(filled) }),
  });
  if (!response.ok) throw new Error(`Form service returned ${response.status}`);

  /* An Apps Script web app answers 200 even when its own code failed, so the
     HTTP status proves nothing: the status it reports is in the body. Without
     this a submission that never reached the sheet still told the visitor
     "your enquiry has been sent". */
  const text = await response.text();
  let reported: { status?: number; message?: string } | null = null;
  try {
    reported = JSON.parse(text) as { status?: number; message?: string };
  } catch {
    // An endpoint that simply answers "ok" is fine.
  }
  if (reported && typeof reported.status === "number" && reported.status >= 400) {
    throw new Error(reported.message || `Form service reported ${reported.status}`);
  }
  return "sent";
}

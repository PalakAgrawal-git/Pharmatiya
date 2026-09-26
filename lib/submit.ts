import { site } from "@/lib/site";

/**
 * Sending a form from a site with no server.
 *
 * If NEXT_PUBLIC_FORM_ENDPOINT is set at build time — a Google Apps Script
 * web app, a form service, or a handler on whatever host the domain moves to
 * — the fields are POSTed there. Otherwise the visitor's own mail client
 * opens with the message already written and addressed, which works on any
 * host, needs no account and keeps nothing on a third party's servers.
 *
 * The body is JSON but the content type is text/plain deliberately. An
 * application/json POST is not a "simple" cross-origin request, so the
 * browser sends a preflight OPTIONS first — and an Apps Script web app
 * cannot answer one, so the submission fails before it is ever sent. As
 * text/plain there is no preflight; the script parses the body itself.
 *
 * Either way the form does something real. The previous version disabled the
 * submit button, which on a finished site reads as broken.
 */
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export type SendResult = "sent" | "mail-client";

export async function sendMessage(
  subject: string,
  fields: Record<string, string>,
): Promise<SendResult> {
  const filled = Object.entries(fields).filter(([, value]) => value.trim());

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ subject, ...Object.fromEntries(filled) }),
    });
    if (!response.ok) throw new Error(`Form service returned ${response.status}`);
    return "sent";
  }

  const body = filled.map(([key, value]) => `${key}: ${value}`).join("\n\n");
  window.location.href =
    `mailto:${site.email}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
  return "mail-client";
}

"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The email address, without a mailto: link.
 *
 * A mailto: hands the visitor to whatever mail client their machine was set
 * up with — usually Outlook, sometimes nothing at all — which is a jarring
 * thing for a website to do and useless to anyone on webmail. Clicking this
 * copies the address instead, so the visitor pastes it wherever they
 * actually write mail.
 *
 * Without JavaScript, or where the clipboard is blocked, the address is
 * still there to read and select by hand. Nothing depends on the copy
 * working.
 */
export default function EmailAddress({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* Clipboard refused — it needs permission the browser may not give.
         Select the address instead, so Ctrl+C still works. */
      const node = button.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2.5">
      <button ref={button} type="button" onClick={copy} className={className}>
        {children ?? site.email}
      </button>
      <span role="status" aria-live="polite" className="text-caption text-accent">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}

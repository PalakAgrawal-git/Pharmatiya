/**
 * Upload Pharmatiya's sample synopses so the drafting service can read them.
 *
 * Run once, and again whenever documents are added. It uploads every .docx in
 * a folder, puts them in a vector store, waits for indexing, and prints the
 * vector store id to set as SYNOPSIS_VECTOR_STORE.
 *
 *   node scripts/upload-samples.mjs "C:\\path\\to\\the\\13 docs"
 *
 * The key is read from the environment or .env.local, never passed on the
 * command line: a command line ends up in shell history and in the terminal
 * scrollback, which is not where a key belongs.
 *
 * Re-running with an existing SYNOPSIS_VECTOR_STORE adds to that store rather
 * than making a second one, so new samples do not orphan the old set.
 *
 * Nothing here is training. The documents are searched when a synopsis is
 * drafted; the model is unchanged. That is why a document can be added or
 * removed in a minute, and why removing one takes its influence with it.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, join, extname } from "node:path";

const API = "https://api.openai.com/v1";

/* ── Key ──────────────────────────────────────────────────────────────── */

function readKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const line = readFileSync(file, "utf8")
      .split("\n")
      .find((l) => l.trim().startsWith("OPENAI_API_KEY="));
    const value = line?.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    if (value) return value;
  }
  return null;
}

const KEY = readKey();
if (!KEY) {
  console.error(
    "No OPENAI_API_KEY found.\n" +
      "Put it in .env.local in the project root, as a line reading:\n" +
      "  OPENAI_API_KEY=sk-proj-...\n" +
      "That file is gitignored, so the key cannot be committed.",
  );
  process.exit(1);
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${KEY}`,
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${path} -> ${response.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

/* ── The documents ────────────────────────────────────────────────────── */

const folder = process.argv[2];
if (!folder || !existsSync(folder)) {
  console.error(`Usage: node scripts/upload-samples.mjs "<folder of .docx files>"`);
  process.exit(1);
}

const KINDS = new Set([".docx", ".pdf", ".md", ".txt"]);
const paths = readdirSync(folder)
  .filter((name) => KINDS.has(extname(name).toLowerCase()))
  .map((name) => join(folder, name));

if (!paths.length) {
  console.error(`No .docx, .pdf, .md or .txt files in ${folder}`);
  process.exit(1);
}

console.log(`Found ${paths.length} document(s) in ${folder}\n`);

/* ── Upload ───────────────────────────────────────────────────────────── */

const fileIds = [];
for (const path of paths) {
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", new Blob([readFileSync(path)]), basename(path));
  const file = await api("/files", { method: "POST", body: form });
  console.log(`  uploaded  ${basename(path)}  ->  ${file.id}`);
  fileIds.push(file.id);
}

/* ── Store ────────────────────────────────────────────────────────────── */

let storeId = process.env.SYNOPSIS_VECTOR_STORE;
if (storeId) {
  console.log(`\nAdding to the existing store ${storeId}`);
} else {
  const store = await api("/vector_stores", {
    method: "POST",
    body: JSON.stringify({ name: "Pharmatiya sample synopses" }),
  });
  storeId = store.id;
  console.log(`\nCreated vector store ${storeId}`);
}

await api(`/vector_stores/${storeId}/file_batches`, {
  method: "POST",
  body: JSON.stringify({ file_ids: fileIds }),
});

/* ── Wait ─────────────────────────────────────────────────────────────── */

/* Indexing is not instant, and a store queried before it finishes simply
   finds nothing — which looks exactly like samples that did not help. */
process.stdout.write("\nIndexing");
for (let i = 0; i < 60; i++) {
  const list = await api(`/vector_stores/${storeId}/files?limit=100`);
  const counts = list.data.reduce((acc, f) => ({ ...acc, [f.status]: (acc[f.status] ?? 0) + 1 }), {});
  if (!counts.in_progress) {
    console.log(`\n\nIndexed: ${JSON.stringify(counts)}`);
    const failed = list.data.filter((f) => f.status === "failed");
    for (const f of failed) console.error(`  FAILED ${f.id}: ${f.last_error?.message ?? "unknown"}`);
    break;
  }
  process.stdout.write(".");
  await new Promise((r) => setTimeout(r, 2000));
}

console.log(`
=========================================================
Set this in Vercel (Settings -> Environment Variables),
for Production and Preview, then redeploy:

  SYNOPSIS_VECTOR_STORE = ${storeId}

Add it to .env.local too, to test locally.
=========================================================`);

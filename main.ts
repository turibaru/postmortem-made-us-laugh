import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// entry.txt is the single source of truth at runtime; edit that file to change the entry.
// This script only copies entry.txt verbatim into MAKEFUN_OUTPUT_DIR as entry.txt.
// The 1-400 character guard below rejects an empty entry and one that is too long.
// No text is generated or altered here, so the published entry always matches entry.txt.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  console.error("error: MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const here = typeof import.meta.dirname === "string"
  ? import.meta.dirname
  : dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");
const text = readFileSync(entryPath, "utf-8");

const length = [...text].length;
if (length < 1 || length > 400) {
  console.error(`error: entry is ${length} characters, must be 1-400`);
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("error: entry is only whitespace");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), text, "utf-8");

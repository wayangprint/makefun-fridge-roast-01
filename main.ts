import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// One line roasting a smart fridge, framed as its annual performance
// review: it nails the cold, flunks the milk, and thinks a firmware
// update counts as personal growth.
const ENTRY =
  "Annual review: cold? Flawless. Milk expiry? Two strikes. And it still wrote 'firmware update' under personal growth. No raise.";

// The competition's gate: /output/entry.txt must hold UTF-8 text of
// 1 to 200 characters. Fail loudly here rather than shipping an
// invalid entry if the line is ever edited past the cap.
if ([...ENTRY].length < 1 || [...ENTRY].length > 200) {
  throw new Error(
    `entry is ${[...ENTRY].length} characters, outside the 1-200 gate`,
  );
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : "/output";

mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, ENTRY, "utf8");

// Read the file back and refuse to print a line that is not exactly
// what was written, so a partial write can never pass as the entry.
const filedLine = readFileSync(entryPath, "utf8");
if (filedLine !== ENTRY) {
  throw new Error("entry.txt on disk does not match the roast line");
}

process.stdout.write(ENTRY + "\n");

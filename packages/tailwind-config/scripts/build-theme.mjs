/**
 * Generates theme.css (Tailwind v4 @theme) from Design Tokens JSON (Figma export).
 *
 * - :root --primitive-* … literals (override to change the design system)
 * - Spacing: only --primitive-spacing (Figma step 1) and @theme --spacing; utilities use multiples of --spacing
 * - @theme … other keys reference var(--primitive-*) where applicable
 *
 * Run: node scripts/build-theme.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const tokensPath = join(root, "tokens", "figma.tokens.json");
const outPath = join(root, "theme.css");

const raw = JSON.parse(readFileSync(tokensPath, "utf8"));

/** @type {Record<string, { $type: string, $value: unknown }>} */
const index = {};

/**
 * @param {unknown} obj
 * @param {string[]} parts
 */
function walk(obj, parts) {
  if (!obj || typeof obj !== "object") return;
  if ("$value" in obj && "$type" in obj) {
    index[parts.join(".")] = /** @type {{ $type: string, $value: unknown }} */ (obj);
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === "$extensions") continue;
    walk(v, [...parts, k]);
  }
}

walk(raw.primitive, ["primitive"]);
walk(raw.semantic, ["semantic"]);

/**
 * @param {string} pathStr
 * @param {Set<string>} [visited]
 */
function resolveNode(pathStr, visited = new Set()) {
  if (visited.has(pathStr)) {
    throw new Error(`Circular token reference: ${pathStr}`);
  }
  visited.add(pathStr);
  const node = index[pathStr];
  if (!node) {
    throw new Error(`Unknown token path: ${pathStr}`);
  }
  const v = node.$value;
  if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
    return resolveNode(v.slice(1, -1), visited);
  }
  return node;
}

/**
 * @param {unknown} c
 */
function colorToCss(c) {
  if (!c || typeof c !== "object" || !("components" in c)) return "#000000";
  const comp = /** @type {{ components: number[]; alpha?: number; hex?: string }} */ (c);
  const a = comp.alpha ?? 1;
  if (a >= 1 && comp.hex) return comp.hex;
  const [r, g, b] = comp.components;
  const R = Math.round(r * 255);
  const G = Math.round(g * 255);
  const B = Math.round(b * 255);
  return `rgb(${R} ${G} ${B} / ${a})`;
}

/**
 * @param {string[]} rest path after primitive.color
 */
function primitiveColorName(rest) {
  /** @type {string[]} */
  const segs = [];
  for (const p of rest) {
    if (p === "$root") continue;
    segs.push(p.replace(/%/g, ""));
  }
  return segs.join("-");
}

/**
 * Maps a primitive token path to the --primitive-* CSS name (no leading --).
 * @param {string} pathStr e.g. primitive.color.brand.500.$root
 */
function primitivePathToVar(pathStr) {
  if (pathStr.startsWith("primitive.color.")) {
    const rest = pathStr.slice("primitive.color.".length).split(".");
    if (rest[0] === "Color") return null;
    return `--primitive-color-${primitiveColorName(rest)}`;
  }
  if (pathStr.startsWith("primitive.radius.")) {
    const key = pathStr.replace("primitive.radius.", "");
    return `--primitive-radius-${key}`;
  }
  if (pathStr.startsWith("primitive.font.size.")) {
    const key = pathStr.replace("primitive.font.size.", "");
    return `--primitive-font-size-${key}`;
  }
  if (pathStr.startsWith("primitive.font.line-height.")) {
    const key = pathStr.replace("primitive.font.line-height.", "");
    return `--primitive-line-height-${key}`;
  }
  if (pathStr.startsWith("primitive.font.weight.")) {
    const key = pathStr.replace("primitive.font.weight.", "");
    return `--primitive-font-weight-${key}`;
  }
  return null;
}

/**
 * @param {string} pathStr semantic or primitive path
 */
function themeValueForColorPath(pathStr) {
  const node = index[pathStr];
  if (!node) throw new Error(`Unknown token path: ${pathStr}`);
  const v = node.$value;
  if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
    const ref = v.slice(1, -1);
    const pv = primitivePathToVar(ref);
    if (pv) return `var(${pv})`;
  }
  const resolved = resolveNode(pathStr);
  if (resolved.$type === "color") {
    return colorToCss(resolved.$value);
  }
  throw new Error(`Expected color at ${pathStr}`);
}

/**
 * Derives a stable Tailwind theme key from a semantic token path (no manual map).
 * - Skips `$root`; strips `%` from keys like `80%` → `80`
 * - Folds Figma `text → color → …` into `text-…` (e.g. on-primary → text-on-primary)
 * - Maps `text` + `primary` (default text color) → `foreground`
 * @param {{ isColor?: boolean }} opts
 */
function semanticPathToThemeKey(pathStr, opts = {}) {
  const isColor = opts.isColor ?? false;
  if (!pathStr.startsWith("semantic.")) {
    throw new Error(`Expected semantic.* path, got: ${pathStr}`);
  }
  const raw = pathStr.slice("semantic.".length).split(".");
  /** @type {string[]} */
  const segments = [];
  for (const p of raw) {
    if (p === "$root") continue;
    segments.push(p.replace(/%/g, ""));
  }
  /** @type {string[]} */
  const folded = [];
  let i = 0;
  while (i < segments.length) {
    if (segments[i] === "text" && segments[i + 1] === "color") {
      folded.push("text");
      i += 2;
      continue;
    }
    folded.push(segments[i]);
    i++;
  }
  if (isColor && folded.length === 2 && folded[0] === "text" && folded[1] === "primary") {
    return "foreground";
  }
  if (isColor && folded[0] === "color" && folded.length > 1) {
    return folded.slice(1).join("-");
  }
  return folded.join("-");
}

/** Figma font steps → Tailwind v4 --text-* keys */
const TEXT_SCALE_KEYS = ["xs", "sm", "base", "lg", "xl", "2xl"];

const rootLines = [];
const themeLines = [];

rootLines.push("  /* Primitive tokens: override these to change spacing, type, radius, and palette. */");

for (const pathStr of Object.keys(index)) {
  if (!pathStr.startsWith("primitive.color.")) continue;
  const rest = pathStr.slice("primitive.color.".length).split(".");
  if (rest[0] === "Color") continue;
  const pv = primitivePathToVar(pathStr);
  if (!pv) continue;
  const node = resolveNode(pathStr);
  if (node.$type === "color") {
    rootLines.push(`  ${pv}: ${colorToCss(node.$value)};`);
  }
}

const primitivePaths = Object.keys(index).filter((p) => p.startsWith("primitive."));

{
  const spacingNode = resolveNode("primitive.spacing.1");
  if (spacingNode.$type === "number") {
    rootLines.push(`  --primitive-spacing: ${spacingNode.$value}px;`);
  }
}

for (const pathStr of primitivePaths) {
  if (pathStr.startsWith("primitive.color.")) continue;

  if (pathStr.startsWith("primitive.radius.")) {
    const node = resolveNode(pathStr);
    const pv = primitivePathToVar(pathStr);
    if (node.$type === "number" && pv) {
      rootLines.push(`  ${pv}: ${node.$value}px;`);
    }
    continue;
  }

  if (pathStr.startsWith("primitive.spacing.")) {
    continue;
  }

  if (pathStr.startsWith("primitive.font.size.")) {
    const node = resolveNode(pathStr);
    const pv = primitivePathToVar(pathStr);
    if (node.$type === "number" && pv) {
      rootLines.push(`  ${pv}: ${node.$value}px;`);
    }
    continue;
  }

  if (pathStr.startsWith("primitive.font.line-height.")) {
    const node = resolveNode(pathStr);
    const pv = primitivePathToVar(pathStr);
    if (node.$type === "number" && pv) {
      rootLines.push(`  ${pv}: ${node.$value}px;`);
    }
    continue;
  }

  if (pathStr.startsWith("primitive.font.weight.")) {
    const node = resolveNode(pathStr);
    const pv = primitivePathToVar(pathStr);
    if (node.$type === "number" && pv) {
      rootLines.push(`  ${pv}: ${node.$value};`);
    }
  }
}

themeLines.push("  /* Spacing: one base unit (Figma spacing/1); p-3 = 3×, gap-4 = 4×, etc. */");
themeLines.push("  --spacing: var(--primitive-spacing);");

for (const pathStr of Object.keys(index)) {
  if (!pathStr.startsWith("primitive.radius.")) continue;
  const key = pathStr.replace("primitive.radius.", "");
  const pv = primitivePathToVar(pathStr);
  if (pv) {
    themeLines.push(`  --radius-${key}: var(${pv});`);
  }
}
themeLines.push("  --radius: var(--primitive-radius-sm);");

themeLines.push("  /* Font sizes: Tailwind v4 uses --text-* and --text-*--line-height */");
for (const k of TEXT_SCALE_KEYS) {
  const sizePath = `primitive.font.size.${k}`;
  const lhPath = `primitive.font.line-height.${k}`;
  if (index[sizePath] && index[lhPath]) {
    const ps = primitivePathToVar(sizePath);
    const plh = primitivePathToVar(lhPath);
    if (ps && plh) {
      themeLines.push(`  --text-${k}: var(${ps});`);
      themeLines.push(`  --text-${k}--line-height: var(${plh});`);
    }
  }
}

themeLines.push("  --font-weight-medium: var(--primitive-font-weight-medium);");
themeLines.push("  --font-weight-regular: var(--primitive-font-weight-regular);");
themeLines.push("  --font-weight-normal: var(--primitive-font-weight-regular);");

themeLines.push("  /* Primitive palette → theme colors */");
for (const pathStr of Object.keys(index)) {
  if (!pathStr.startsWith("primitive.color.")) continue;
  const rest = pathStr.slice("primitive.color.".length).split(".");
  if (rest[0] === "Color") continue;
  const name = primitiveColorName(rest);
  const pv = primitivePathToVar(pathStr);
  if (pv) {
    themeLines.push(`  --color-${name}: var(${pv});`);
  }
}

themeLines.push("  --color-brand: var(--primitive-color-brand-500);");

themeLines.push("");
themeLines.push("  /* Semantic colors (paths → keys via semanticPathToThemeKey) */");

const semanticColorPaths = Object.keys(index).filter(
  (p) => p.startsWith("semantic.") && index[p].$type === "color",
);

/** @type {Map<string, string>} */
const colorKeySources = new Map();
for (const pathStr of semanticColorPaths) {
  const key = semanticPathToThemeKey(pathStr, { isColor: true });
  if (colorKeySources.has(key)) {
    throw new Error(
      `Duplicate semantic color theme key "${key}" from:\n  ${colorKeySources.get(key)}\n  ${pathStr}`,
    );
  }
  colorKeySources.set(key, pathStr);
}

for (const pathStr of semanticColorPaths.sort()) {
  const key = semanticPathToThemeKey(pathStr, { isColor: true });
  const val = themeValueForColorPath(pathStr);
  themeLines.push(`  --color-${key}: ${val};`);
}

themeLines.push("");
themeLines.push("  /* Semantic numbers (e.g. font weights; paths → keys via semanticPathToThemeKey) */");

const semanticNumberPaths = Object.keys(index).filter(
  (p) => p.startsWith("semantic.") && index[p].$type === "number",
);

/** @type {Map<string, string>} */
const numberKeySources = new Map();
for (const pathStr of semanticNumberPaths) {
  const key = semanticPathToThemeKey(pathStr, { isColor: false });
  if (numberKeySources.has(key)) {
    throw new Error(
      `Duplicate semantic number theme key "${key}" from:\n  ${numberKeySources.get(key)}\n  ${pathStr}`,
    );
  }
  numberKeySources.set(key, pathStr);
}

for (const pathStr of semanticNumberPaths.sort()) {
  const key = semanticPathToThemeKey(pathStr, { isColor: false });
  const node = index[pathStr];
  if (!node) continue;
  const v = node.$value;
  if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
    const ref = v.slice(1, -1);
    const pv = primitivePathToVar(ref);
    themeLines.push(
      pv ? `  --font-weight-${key}: var(${pv});` : `  --font-weight-${key}: ${resolveNode(pathStr).$value};`,
    );
  } else {
    themeLines.push(`  --font-weight-${key}: ${node.$value};`);
  }
}

const out = [];
out.push("/* Generated by scripts/build-theme.mjs from tokens/figma.tokens.json — do not edit by hand */");
out.push("");
out.push(":root {");
out.push(rootLines.join("\n"));
out.push("}");
out.push("");
out.push("@theme {");
out.push(themeLines.join("\n"));
out.push("}");
out.push("");

writeFileSync(outPath, out.join("\n") + "\n", "utf8");
console.log(`Wrote ${outPath}`);

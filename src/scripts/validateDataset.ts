/**
 * Dataset validator for open-source contributors.
 *
 * Run before opening a PR that adds or modifies food items in
 * src/data/foodDataset.ts:
 *   npm run validate:dataset
 *
 * Runs two layers of checks:
 *   1. Zod schema  — field types, formats, and allowed age-range keys
 *   2. Cross-checks — duplicates, whitespace, injection, and coverage
 */
import { FOOD_DATASET } from '../data/foodDataset.js';
import { FoodDatasetSchema } from '../schemas/foodDatasetSchema.js';

// ─── Layer 1: Zod schema ────────────────────────────────────────────────────

const result = FoodDatasetSchema.safeParse(FOOD_DATASET);

if (!result.success) {
  const { issues } = result.error;
  console.error(`\n  Schema validation failed — ${issues.length} error(s) found:\n`);

  for (const issue of issues) {
    const [index, ...fieldParts] = issue.path;
    const foodLabel =
      typeof index === 'number'
        ? `[${(FOOD_DATASET[index] as any)?.id ?? `item[${index}]`}]`
        : `[${String(index)}]`;
    const field = fieldParts.length > 0 ? fieldParts.join('.') : '(root)';
    console.error(`  ${foodLabel} ${field}: ${issue.message}`);
  }

  console.error('\n  Fix the errors above in src/data/foodDataset.ts before opening your PR.\n');
  process.exit(1);
}

// ─── Layer 2: Cross-checks ──────────────────────────────────────────────────
// Zod validates each item in isolation. These checks catch problems that span
// multiple items or multiple fields within one item.

const foods = result.data;
const crossErrors: string[] = [];

// Patterns that must never appear in user-supplied strings.
// Protects the HTML checklist output from content injection via a malicious PR.
const INJECTION_PATTERNS = [/</, />/, /javascript:/i, /data:/i, /on\w+=/i];

// Returns all string fields of a food item as [fieldPath, value] pairs
// so injection and whitespace checks can iterate over them uniformly.
function stringFields(food: (typeof foods)[number]): [string, string][] {
  return [
    ['name', food.name],
    ...Object.entries(food.preparationByAge).map(
      ([range, instruction]) => [`preparationByAge.${range}`, instruction] as [string, string]
    ),
    ...(food.chokingHazardWarning
      ? [['chokingHazardWarning', food.chokingHazardWarning] as [string, string]]
      : [])
  ];
}

// ── 1. No duplicate ids ──────────────────────────────────────────────────────
const seenIds = new Set<string>();
for (const food of foods) {
  if (seenIds.has(food.id)) {
    crossErrors.push(`[${food.id}] id: duplicate — each food must have a unique id`);
  }
  seenIds.add(food.id);
}

// ── 2. No duplicate names ────────────────────────────────────────────────────
const seenNames = new Map<string, string>(); // normalized → original
for (const food of foods) {
  const normalized = food.name.toLowerCase().trim();
  if (seenNames.has(normalized)) {
    crossErrors.push(
      `[${food.id}] name: "${food.name}" duplicates existing entry "${seenNames.get(normalized)}"`
    );
  } else {
    seenNames.set(normalized, food.name);
  }
}

// ── 3. No leading or trailing whitespace in any string field ─────────────────
// Zod's .trim().length > 0 only rejects all-whitespace strings.
// A leading space like " finely chopped" passes Zod but is a data error.
for (const food of foods) {
  for (const [field, value] of stringFields(food)) {
    if (value !== value.trim()) {
      crossErrors.push(`[${food.id}] ${field}: has leading or trailing whitespace`);
    }
  }
}

// ── 4. No HTML or script injection in any string field ───────────────────────
for (const food of foods) {
  for (const [field, value] of stringFields(food)) {
    if (INJECTION_PATTERNS.some((pattern) => pattern.test(value))) {
      crossErrors.push(`[${food.id}] ${field}: contains disallowed characters or patterns`);
    }
  }
}

// ── 5. minAgeMonths is covered by at least one preparationByAge range ────────
// Ensures a baby at exactly minAgeMonths always receives preparation instructions.
// Example: minAgeMonths: 6 requires a range whose lower bound is ≤ 6.
for (const food of foods) {
  const covered = Object.keys(food.preparationByAge).some((range) => {
    const [min, max] = range.split('-').map(Number);
    return food.minAgeMonths >= min && food.minAgeMonths < max;
  });
  if (!covered) {
    const ranges = Object.keys(food.preparationByAge).join(', ');
    crossErrors.push(
      `[${food.id}] minAgeMonths (${food.minAgeMonths}) is not covered by any of its ranges: ${ranges}`
    );
  }
}

// ── 6. No duplicate preparation instructions within the same food ────────────
// Catches copy-paste errors where the same instruction is reused across ranges.
for (const food of foods) {
  const instructions = Object.values(food.preparationByAge);
  const unique = new Set(instructions);
  if (unique.size !== instructions.length) {
    crossErrors.push(
      `[${food.id}] preparationByAge: identical instructions found across different age ranges`
    );
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────

if (crossErrors.length > 0) {
  console.error(`\n  Cross-check validation failed — ${crossErrors.length} error(s) found:\n`);
  crossErrors.forEach((msg) => console.error(`  ${msg}`));
  console.error('\n  Fix the errors above in src/data/foodDataset.ts before opening your PR.\n');
  process.exit(1);
}

console.log(`\n  ✔️  All ${foods.length} food item(s) passed validation.\n`);

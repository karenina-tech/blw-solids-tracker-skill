/**
 * Dataset validator for open-source contributors.
 *
 * Run this before opening a PR that adds or modifies food items in
 * src/data/foodDataset.ts to catch shape errors that TypeScript alone
 * cannot enforce (malformed age-range keys, empty instructions, invalid ids).
 *
 * Usage:
 *   npm run validate:dataset
 */
import { FOOD_DATASET } from '../data/foodDataset.js';
import { FoodDatasetSchema } from '../schemas/foodDatasetSchema.js';

const result = FoodDatasetSchema.safeParse(FOOD_DATASET);

if (!result.success) {
  const { issues } = result.error;
  console.error(`\n  Dataset validation failed — ${issues.length} error(s) found:\n`);

  for (const issue of issues) {
    const [index, ...fieldParts] = issue.path;

    // Map the array index back to a food id so the error points to a named item
    // rather than an opaque numeric index.
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

console.log(`\n  ✔️  All ${result.data.length} food item(s) passed validation.\n`);

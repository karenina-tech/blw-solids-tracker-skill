import { z } from 'zod';

/**
 * Zod schema for a single food item in the BLW dataset.
 *
 * This is the contract every contributor must satisfy when adding or editing
 * a food in src/data/foodDataset.ts. TypeScript alone cannot enforce things
 * like duplicate ids or cross-field consistency — run `npm run validate:dataset`
 * before opening a PR to catch all of those.
 */

// Strict allowlist of supported age ranges.
export const VALID_AGE_RANGES = ['6-9', '9-12'] as const;
export type AgeRange = (typeof VALID_AGE_RANGES)[number];

export const FoodItemSchema = z.object({
	// Used as the unique identifier and for allergy matching (case-insensitive).
	// Must be a lowercase hyphen-slug — no spaces, no capitals.
	id: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, 'Must be a lowercase slug (e.g. "sweet-potato", not "Sweet Potato")'),

	name: z.string().min(1, 'Name cannot be empty'),

	// "Allergen" items receive special spacing in the 30-day introduction schedule.
	category: z.enum(['Standard', 'Allergen']),

	// Capped at 12 months — this skill covers first-introduction only.
	// Raise the ceiling here (and update the dataset) when older age groups are added.
	minAgeMonths: z
		.number({ message: 'Must be a number' })
		.int('Must be a whole number of months')
		.min(0)
		.max(12, 'Currently only foods for 0-12 months are supported'),

	// Keys must be one of the declared VALID_AGE_RANGES — no arbitrary ranges allowed.
	// Instructions cannot be empty or whitespace-only.
	preparationByAge: z
		.record(z.string(), z.string())
		.refine((obj) => Object.keys(obj).length > 0, {
			message: 'At least one preparation range is required'
		})
		.refine(
			(obj) => Object.keys(obj).every((k) => (VALID_AGE_RANGES as readonly string[]).includes(k)),
			{ message: `Keys must be one of the supported age ranges: ${VALID_AGE_RANGES.join(', ')}` }
		)
		.refine((obj) => Object.values(obj).every((v) => v.trim().length > 0), {
			message: 'Preparation instructions cannot be empty'
		}),

	// Only include when there is a specific, named cutting or texture risk for this food.
	// Omit entirely rather than leaving an empty string.
	chokingHazardWarning: z.string().min(1, 'Must be a non-empty warning or omitted entirely').optional()
});

// The full dataset must have at least one entry.
export const FoodDatasetSchema = z.array(FoodItemSchema).min(1, 'Dataset cannot be empty');

// Single type definition — replaces the manual interface in foodDataset.ts
// so the type and the validation schema can never drift apart.
export type FoodItem = z.infer<typeof FoodItemSchema>;

import type { FoodItem } from '../schemas/foodDatasetSchema.js';
import type { ChecklistItem } from '../@types/feeding.js';

// Represents one day in the plan before dates are assigned.
type ScheduledDay = {
	food: FoodItem;
	allergenTrialDay?: 1 | 2 | 3;
};

// Returns the preparation instruction for a baby's age.
// If no range matches, it falls back to the last available range.
function getPreparationForAge(preparationByAge: Record<string, string>, ageMonths: number): string {
	const entries = Object.entries(preparationByAge);

	for (const [range, instruction] of entries) {
		const [minAge, maxAge] = range.split('-').map(Number);
		if (ageMonths >= minAge && ageMonths < maxAge) {
			return instruction;
		}
	}
	const allInstructions = Object.values(preparationByAge);
	return allInstructions[allInstructions.length - 1] ?? '';
}

// Moves a YYYY-MM-DD date forward by a number of days.
// Uses noon UTC to avoid timezone-related day shifts.
function shiftDateByDays(date: string, daysToAdd: number): string {
	const d = new Date(`${date}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + daysToAdd);
	return d.toISOString().slice(0, 10);
}

// Returns the checklist category label for a given allergen trial day.
function getAllergenDayLabel(trialDay: 1 | 2 | 3): ChecklistItem['category'] {
	if (trialDay === 1) return 'Allergen (1/3)';
	if (trialDay === 2) return 'Allergen (2/3)';
	return 'Allergen (3/3)';
}

/**
 * Builds a strict 30-day BLW introduction plan from a safe, allergen-filtered food list.
 *
 * Step 1 — 2 warm-up days: mild standard foods first (no choking risk).
 * Step 2 — For each allergen: 3 trial days, then 3 standard-food buffer days.
 * Step 3 — Fill the rest of the 30 days by cycling through standard foods.
 */
// Fisher-Yates shuffle — returns a new shuffled array, does not mutate the original.
function shuffle<T>(arr: T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

const MEAT_START_DAY = 14;

function isMeat(food: FoodItem) {
	return food.category === 'Standard' && food.dietaryType === 'standard';
}

function buildLaterPool(nonMeats: FoodItem[], meats: FoodItem[]): FoodItem[] {
	if (meats.length === 0) return nonMeats;
	const pool: FoodItem[] = [];
	let ni = 0;
	let mi = 0;
	while (ni < nonMeats.length || mi < meats.length) {
		for (let r = 0; r < 2 && ni < nonMeats.length; r++) pool.push(nonMeats[ni++]);
		if (mi < meats.length) pool.push(meats[mi++]);
	}
	return pool;
}

export function generate30DayPlan(foods: FoodItem[], startDate: string, ageMonths: number): ChecklistItem[] {
	const allergens = shuffle(foods.filter((food) => food.category === 'Allergen'));

	const nonMeatMild = shuffle(
		foods.filter((f) => f.category === 'Standard' && !isMeat(f) && !f.chokingHazardWarning)
	);
	const nonMeatOther = shuffle(
		foods.filter((f) => f.category === 'Standard' && !isMeat(f) && !!f.chokingHazardWarning)
	);
	const nonMeatPool = [...nonMeatMild, ...nonMeatOther];
	const meatPool = shuffle(foods.filter(isMeat));

	const prePool = nonMeatPool.length > 0 ? nonMeatPool : foods;
	const laterPool = buildLaterPool(nonMeatPool, meatPool);
	const safeLaterPool = laterPool.length > 0 ? laterPool : prePool;

	let preIdx = 0;
	let laterIdx = 0;

	const schedule: ScheduledDay[] = [];

	function nextStandardFood(): FoodItem {
		if (schedule.length < MEAT_START_DAY || meatPool.length === 0) {
			const food = prePool[preIdx % prePool.length];
			preIdx++;
			return food;
		}
		const food = safeLaterPool[laterIdx % safeLaterPool.length];
		laterIdx++;
		return food;
	}

	for (let i = 0; i < 2 && schedule.length < 30; i++) {
		schedule.push({ food: nextStandardFood() });
	}

	for (const allergen of allergens) {
		if (schedule.length >= 30) break;
		schedule.push({ food: allergen, allergenTrialDay: 1 });
		if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 2 });
		if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 3 });
		for (let i = 0; i < 3 && schedule.length < 30; i++) {
			schedule.push({ food: nextStandardFood() });
		}
	}

	while (schedule.length < 30) {
		schedule.push({ food: nextStandardFood() });
	}

	return schedule.map((day, index): ChecklistItem => {
		const preparation = getPreparationForAge(day.food.preparationByAge, ageMonths);
		let category: ChecklistItem['category'];
		if (day.allergenTrialDay) {
			category = getAllergenDayLabel(day.allergenTrialDay);
		} else {
			category = 'Standard';
		}
		const prefix = day.allergenTrialDay ? '⏰ ' : '';
		return {
			date: shiftDateByDays(startDate, index),
			foodItem: `${prefix}${day.food.name} — ${preparation}`,
			category,
			isAllergenFirstDay: day.allergenTrialDay === 1,
			isOffered: false,
			hasAllergyReaction: false,
			notes: ''
		};
	});
}

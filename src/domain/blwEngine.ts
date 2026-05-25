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
	if (trialDay === 1) return 'Allergen (Day 1/3)';
	if (trialDay === 2) return 'Allergen (Day 2/3)';
	return 'Allergen (Day 3/3)';
}

/**
 * Builds a strict 30-day BLW introduction plan from a safe, allergen-filtered food list.
 *
 * Step 1 — 2 warm-up days: mild standard foods first (no choking risk).
 * Step 2 — For each allergen: 3 trial days, then 3 standard-food buffer days.
 * Step 3 — Fill the rest of the 30 days by cycling through standard foods.
 */
export function generate30DayPlan(foods: FoodItem[], startDate: string, ageMonths: number): ChecklistItem[] {
	const allergens = foods.filter((food) => food.category === 'Allergen');

	// Mild foods (no choking hazard) go first so the warm-up days start gentle.
	const mildStandards = foods.filter((food) => food.category === 'Standard' && !food.chokingHazardWarning);
	const otherStandards = foods.filter((food) => food.category === 'Standard' && !!food.chokingHazardWarning);
	const orderedStandards = [...mildStandards, ...otherStandards];

	// If there are no standard foods at all, cycle through everything so the plan
	// always reaches exactly 30 days.
	const cyclingPool = orderedStandards.length > 0 ? orderedStandards : foods;
	let cycleIndex = 0;

	function nextStandardFood(): FoodItem {
		const food = cyclingPool[cycleIndex % cyclingPool.length];
		cycleIndex++;
		return food;
	}

	const schedule: ScheduledDay[] = [];

	// Step 1 — warm-up: 2 days of mild standard food before any allergen is introduced.
	for (let i = 0; i < 2 && schedule.length < 30; i++) {
		schedule.push({ food: nextStandardFood() });
	}

	// Step 2 — allergen trials: 3 consecutive days per allergen + 3 buffer days after.
	for (const allergen of allergens) {
		if (schedule.length >= 30) break;

		schedule.push({ food: allergen, allergenTrialDay: 1 });
		if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 2 });
		if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 3 });

		// Buffer days let parents watch for delayed reactions before the next allergen during the next three days.
		for (let i = 0; i < 3 && schedule.length < 30; i++) {
			schedule.push({ food: nextStandardFood() });
		}
	}

	// Step 3 — fill: cycle standard foods until the plan is exactly 30 days.
	while (schedule.length < 30) {
		schedule.push({ food: nextStandardFood() });
	}

	// Convert the raw schedule into ChecklistItem[] with dates and preparation details.
	return schedule.map((day, index): ChecklistItem => {
		const preparation = getPreparationForAge(day.food.preparationByAge, ageMonths);

		let category: ChecklistItem['category'];
		if (day.allergenTrialDay) {
			category = getAllergenDayLabel(day.allergenTrialDay);
		} else {
			category = 'Standard';
		}

		// ⏰ marks allergen days as morning/midday-only with a 2-hour monitoring window.
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

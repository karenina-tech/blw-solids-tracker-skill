import { describe, test, expect } from 'vitest';
import { validateAgeTool } from '../src/tools/validateAge.js';
import { getSafeFoodsTool } from '../src/tools/getSafeFoods.js';
import { getChokingHazardsTool } from '../src/tools/getChokingHazards.js';

// ── Milestone fixtures ────────────────────────────────────────────────────────
// Only the three physical markers are evaluated by the safety gate.
// showsInterestInFood is collected but never blocks approval.

const ALL_PHYSICAL_MILESTONES_MET = {
	headControl: true,
	canSitWithMinimalSupport: true,
	reachAndGrab: true,
	showsInterestInFood: true,
};

const MILESTONES_WITHOUT_HEAD_CONTROL = {
	...ALL_PHYSICAL_MILESTONES_MET,
	headControl: false,
};

const MILESTONES_WITHOUT_FOOD_INTEREST = {
	...ALL_PHYSICAL_MILESTONES_MET,
	showsInterestInFood: false,
};

// ── Profile fixtures ──────────────────────────────────────────────────────────
// A safe default: 6-month-old, standard diet, no allergies, all milestones met.
// Individual tests spread and override only the field they are testing.

const READY_SIX_MONTH_PROFILE = {
	name: 'Luna',
	ageMonths: 6,
	startDate: '2026-06-01',
	dietType: 'standard' as const,
	knownAllergies: false,
	allergicFoods: [],
	developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET,
};

// ── validateAge — age gate ────────────────────────────────────────────────────

describe('validateAge — age gate', () => {
	test('a 4-month-old is too young and is blocked', () => {
		const fourMonthOld = { ageMonths: 4, developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET };

		const response = validateAgeTool(fourMonthOld) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
		expect(response.ageOk).toBe(false);
	});

	test('a 5-month-old without a declared feeding type triggers a follow-up question', () => {
		const fiveMonthOldNoFeedingType = { ageMonths: 5, developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET };

		const response = validateAgeTool(fiveMonthOldNoFeedingType) as any;

		expect(response.safetyStatus).toBe('REQUIRES_FEEDING_TYPE');
	});

	test('a 5-month-old on exclusive breastfeeding is blocked — WHO and AAP recommend waiting until 6 months', () => {
		const fiveMonthBreastfed = {
			ageMonths: 5,
			feedingType: 'exclusive_breastfeeding' as const,
			developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET,
		};

		const response = validateAgeTool(fiveMonthBreastfed) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
		expect(response.ageOk).toBe(false);
	});

	test('a 5-month-old on formula is approved — formula-fed babies may start earlier per pediatrician guidance', () => {
		const fiveMonthFormula = {
			ageMonths: 5,
			feedingType: 'formula' as const,
			developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET,
		};

		const response = validateAgeTool(fiveMonthFormula) as any;

		expect(response.safetyStatus).toBe('APPROVED');
		expect(response.ageOk).toBe(true);
	});

	test('a 6-month-old is approved', () => {
		const sixMonthOld = { ageMonths: 6, developmentalMilestones: ALL_PHYSICAL_MILESTONES_MET };

		const response = validateAgeTool(sixMonthOld) as any;

		expect(response.safetyStatus).toBe('APPROVED');
	});
});

// ── getSafeFoods — age gate ───────────────────────────────────────────────────

describe('getSafeFoods — age gate', () => {
	test('a 4-month-old profile is blocked before any foods are returned', () => {
		const fourMonthProfile = { ...READY_SIX_MONTH_PROFILE, ageMonths: 4 };

		const response = getSafeFoodsTool({ profile: fourMonthProfile }) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	test('a 5-month-old on exclusive breastfeeding profile is blocked', () => {
		const fiveMonthBreastfedProfile = {
			...READY_SIX_MONTH_PROFILE,
			ageMonths: 5,
			feedingType: 'exclusive_breastfeeding' as const,
		};

		const response = getSafeFoodsTool({ profile: fiveMonthBreastfedProfile }) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	test('a 5-month-old on formula is approved and receives a non-empty food list', () => {
		const fiveMonthFormulaProfile = {
			...READY_SIX_MONTH_PROFILE,
			ageMonths: 5,
			feedingType: 'formula' as const,
		};

		const response = getSafeFoodsTool({ profile: fiveMonthFormulaProfile }) as any;

		expect(response.safetyStatus).toBe('APPROVED');
		expect(response.foods.length).toBeGreaterThan(0);
	});
});

// ── getSafeFoods — milestone gate ────────────────────────────────────────────

describe('getSafeFoods — milestone gate', () => {
	test('a baby missing head control is blocked even at the right age', () => {
		const profileMissingHeadControl = {
			...READY_SIX_MONTH_PROFILE,
			developmentalMilestones: MILESTONES_WITHOUT_HEAD_CONTROL,
		};

		const response = getSafeFoodsTool({ profile: profileMissingHeadControl }) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	test('a baby with no food interest is still approved — food interest is informational only', () => {
		const profileNoFoodInterest = {
			...READY_SIX_MONTH_PROFILE,
			developmentalMilestones: MILESTONES_WITHOUT_FOOD_INTEREST,
		};

		const response = getSafeFoodsTool({ profile: profileNoFoodInterest }) as any;

		expect(response.safetyStatus).toBe('APPROVED');
	});
});

// ── getSafeFoods — allergen filter ───────────────────────────────────────────

describe('getSafeFoods — allergen filter', () => {
	test('peanut is absent from the food list when declared as a known allergy', () => {
		const peanutAllergyProfile = {
			...READY_SIX_MONTH_PROFILE,
			knownAllergies: true,
			allergicFoods: ['peanut'],
		};

		const response = getSafeFoodsTool({ profile: peanutAllergyProfile }) as any;
		const returnedFoodIds = response.foods.map((food: any) => food.id);

		expect(response.safetyStatus).toBe('APPROVED');
		expect(returnedFoodIds).not.toContain('peanut');
	});

	test('peanut is present in the food list when no allergies are declared', () => {
		const noAllergyProfile = READY_SIX_MONTH_PROFILE;

		const response = getSafeFoodsTool({ profile: noAllergyProfile }) as any;
		const returnedFoodIds = response.foods.map((food: any) => food.id);

		expect(response.safetyStatus).toBe('APPROVED');
		expect(returnedFoodIds).toContain('peanut');
	});
});

// ── getSafeFoods — diet filter ───────────────────────────────────────────────

describe('getSafeFoods — diet filter', () => {
	test('standard diet includes both meat (beef) and animal products (egg)', () => {
		const standardDietProfile = { ...READY_SIX_MONTH_PROFILE, dietType: 'standard' as const };

		const response = getSafeFoodsTool({ profile: standardDietProfile }) as any;
		const returnedFoodIds = response.foods.map((food: any) => food.id);

		expect(response.safetyStatus).toBe('APPROVED');
		expect(returnedFoodIds).toContain('beef');
		expect(returnedFoodIds).toContain('egg');
	});

	test('vegetarian diet excludes meat (beef) but keeps animal products (egg)', () => {
		const vegetarianProfile = { ...READY_SIX_MONTH_PROFILE, dietType: 'vegetarian' as const };

		const response = getSafeFoodsTool({ profile: vegetarianProfile }) as any;
		const returnedFoodIds = response.foods.map((food: any) => food.id);

		expect(response.safetyStatus).toBe('APPROVED');
		expect(returnedFoodIds).not.toContain('beef');
		expect(returnedFoodIds).toContain('egg');
	});

	test('vegan diet excludes both meat (beef) and animal products (egg)', () => {
		const veganProfile = { ...READY_SIX_MONTH_PROFILE, dietType: 'vegan' as const };

		const response = getSafeFoodsTool({ profile: veganProfile }) as any;
		const returnedFoodIds = response.foods.map((food: any) => food.id);

		expect(response.safetyStatus).toBe('APPROVED');
		expect(returnedFoodIds).not.toContain('beef');
		expect(returnedFoodIds).not.toContain('egg');
	});
});

// ── getChokingHazards — age gate ─────────────────────────────────────────────

describe('getChokingHazards — age gate', () => {
	test('a 4-month-old is blocked — preparation rules are only shared after BLW readiness is confirmed', () => {
		const response = getChokingHazardsTool({ ageMonths: 4 }) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	test('a 5-month-old without a declared feeding type triggers a follow-up question', () => {
		const response = getChokingHazardsTool({ ageMonths: 5 }) as any;

		expect(response.safetyStatus).toBe('REQUIRES_FEEDING_TYPE');
	});

	test('a 5-month-old on exclusive breastfeeding is blocked', () => {
		const response = getChokingHazardsTool({
			ageMonths: 5,
			feedingType: 'exclusive_breastfeeding',
		}) as any;

		expect(response.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	test('a 5-month-old on formula receives preparation rules for all foods', () => {
		const response = getChokingHazardsTool({ ageMonths: 5, feedingType: 'formula' }) as any;

		expect(response.success).toBe(true);
		expect(response.preparationRules.length).toBeGreaterThan(0);
	});

	test('a 6-month-old receives preparation rules for all foods', () => {
		const response = getChokingHazardsTool({ ageMonths: 6 }) as any;

		expect(response.success).toBe(true);
		expect(response.preparationRules.length).toBeGreaterThan(0);
	});
});

import { z } from 'zod';
import { FOOD_DATASET } from '../data/foodDataset.js';

const GetChokingHazardsInputSchema = z.object({
  ageMonths: z.number().min(0).max(12),
  feedingType: z.enum(['formula', 'exclusive_breastfeeding']).optional(),
});

type GetChokingHazardsInput = z.infer<typeof GetChokingHazardsInputSchema>;

function getPreparationForAge(preparationByAge: Record<string, string>, ageMonths: number): string | null {
  for (const [range, instruction] of Object.entries(preparationByAge)) {
    const [minStr, maxStr] = range.split('-');
    const min = parseInt(minStr, 10);
    const max = maxStr ? parseInt(maxStr, 10) : Infinity;
    if (ageMonths >= min && ageMonths < max) return instruction;
  }
  // Baby is older than dataset covers — return last available range
  const entries = Object.entries(preparationByAge);
  return entries.length > 0 ? entries[entries.length - 1][1] : null;
}

export function getChokingHazardsTool(input: GetChokingHazardsInput) {
  const validation = GetChokingHazardsInputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: 'Invalid input', details: validation.error };
  }

  const { ageMonths, feedingType } = validation.data;

  // Re-derive age eligibility — mirrors the same rule in checkBLWReadiness.
  // Enforces that this tool is only reachable after an approved get-safe-foods call.
  if (ageMonths === 5 && feedingType === undefined) {
    return {
      success: false,
      safetyStatus: 'REQUIRES_FEEDING_TYPE',
      message: 'Baby is 5 months old — feedingType required to determine eligibility.'
    };
  }

  const ageOk = ageMonths >= 6 || (ageMonths === 5 && feedingType === 'formula');
  if (!ageOk) {
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      message: 'Baby does not meet the minimum age requirement for BLW preparation guidance.'
    };
  }

  // 5-month formula babies are approved — use 6 for preparation rule lookup,
  // consistent with the effectiveAge pattern in getSafeFoods.
  const effectiveAge = ageMonths === 5 && feedingType === 'formula' ? 6 : ageMonths;

  const preparationRules = FOOD_DATASET.map(food => ({
    id: food.id,
    name: food.name,
    preparation: getPreparationForAge(food.preparationByAge, effectiveAge),
    chokingHazardWarning: food.chokingHazardWarning ?? null,
  }));

  return {
    success: true,
    ageMonths,
    preparationRules,
  };
}

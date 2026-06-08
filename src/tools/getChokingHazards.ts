import { z } from 'zod';
import { FOOD_DATASET } from '../data/foodDataset.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';

const GetChokingHazardsInputSchema = z.object({
  ageMonths: z.number().min(0).max(12),
  feedingType: z.enum(['formula', 'exclusive_breastfeeding']).optional(),
});

type GetChokingHazardsInput = z.infer<typeof GetChokingHazardsInputSchema>;

export type PreparationRule = {
  id: string;
  name: string;
  chokingHazardWarning: string;
  safePreparation: string;
};

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

export function getChokingHazardsTool(input: GetChokingHazardsInput) {
  const validation = GetChokingHazardsInputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: 'Invalid input', details: validation.error };
  }

  const { ageMonths, feedingType } = validation.data;

  if (ageMonths === 5 && feedingType === undefined) {
    return {
      success: false,
      safetyStatus: 'REQUIRES_FEEDING_TYPE',
      message: 'Baby is 5 months old — feedingType required to determine eligibility.'
    };
  }

  const ageOk = ageMonths >= 6 || (ageMonths === 5 && feedingType === 'formula');

  if (!ageOk) {
    const isBreastfeedingBlock = ageMonths === 5 && feedingType === 'exclusive_breastfeeding';
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      note: isBreastfeedingBlock
        ? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
        : TOOL_MESSAGES.AGE_TOO_YOUNG_NOTE
    };
  }

  // 5-month formula babies are approved — use 6 for preparation rule lookup,
  // consistent with the effectiveAge pattern in getSafeFoods.
  const effectiveAge = ageMonths === 5 && feedingType === 'formula' ? 6 : ageMonths;

  const preparationRules: PreparationRule[] = FOOD_DATASET.filter((food) => !!food.chokingHazardWarning).map(
    (food) => ({
      id: food.id,
      name: food.name,
      chokingHazardWarning: food.chokingHazardWarning!,
      safePreparation: getPreparationForAge(food.preparationByAge, effectiveAge)
    })
  );

  return {
    success: true,
    safetyStatus: 'APPROVED',
    preparationRules
  };
}

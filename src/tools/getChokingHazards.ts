import { z } from 'zod';
import { FOOD_DATASET } from '../data/foodDataset.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';
import { getGuidelines } from '../config/guidelines.js';

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
  const g = getGuidelines();
  const isEarlyWindow = g.ageRules.earlyWindowMonths.includes(ageMonths);

  if (isEarlyWindow && feedingType === undefined) {
    return {
      success: false,
      safetyStatus: 'REQUIRES_FEEDING_TYPE',
      message: 'Baby is 5 months old — feedingType required to determine eligibility.'
    };
  }

  const ageOk =
    ageMonths >= g.ageRules.standardMinimumMonths ||
    (isEarlyWindow && g.ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType!));

  if (!ageOk) {
    const isBreastfeedingBlock = isEarlyWindow && feedingType === 'exclusive_breastfeeding';
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      note: isBreastfeedingBlock
        ? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
        : TOOL_MESSAGES.AGE_TOO_YOUNG_NOTE
    };
  }

  // A 5-month formula-fed baby who passed the readiness check uses age 6
  // for food preparation rules — same logic as in getSafeFoods.
  const isEarlyWindowApproved =
    isEarlyWindow && g.ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType!);
  const effectiveAge = isEarlyWindowApproved
    ? g.ageRules.earlyWindowEffectiveAgeMonths
    : ageMonths;

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

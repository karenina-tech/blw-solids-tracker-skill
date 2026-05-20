import { z } from 'zod';
import { FOOD_DATASET } from '../data/foodDataset.js';

const GetChokingHazardsInputSchema = z.object({
  ageMonths: z.number().min(6).max(12),
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
    return { success: false, error: "Invalid input", details: validation.error };
  }

  const { ageMonths } = validation.data;

  const preparationRules = FOOD_DATASET.map(food => ({
    id: food.id,
    name: food.name,
    preparation: getPreparationForAge(food.preparationByAge, ageMonths),
    chokingHazardWarning: food.chokingHazardWarning ?? null,
  }));

  return {
    success: true,
    ageMonths,
    preparationRules,
  };
}

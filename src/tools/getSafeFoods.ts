import { FOOD_DATASET } from '../data/foodDataset.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';
import { BabyProfileSchema, type BabyProfile } from '../schemas/profileSchema.js';
import { checkBLWReadiness } from './validateAge.js';

interface ToolInput {
  profile: BabyProfile;
}

export function getSafeFoodsTool(input: ToolInput) {
  // 1. Validate incoming data structure from Claude deterministically via Zod
  const validation = BabyProfileSchema.safeParse(input.profile);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid profile data format passed to backend core.",
      details: validation.error
    };
  }

  const profile = validation.data;

  // 2. Enforce strict safety milestone gate
  const readiness = checkBLWReadiness(profile.ageMonths, profile.developmentalMilestones, profile.feedingType);
  if (!readiness.isReady) {
    return {
      success: false,
      safetyStatus: "BLOCKED_NOT_READY",
      warningMessage: "CRITICAL ALERT: Infant does not meet physical readiness or age markers for Baby-Led Weaning. Hold solid introduction."
    };
  }

  // 3. Query dataset and filter by age, user allergies, and dietary pattern
  const DIET_LEVEL: Record<string, number> = { standard: 0, vegetarian: 1, vegan: 2 };
  const safeFoods = FOOD_DATASET.filter(food => {
    const satisfiesAge = profile.ageMonths >= food.minAgeMonths;
    const isUserAllergic = profile.allergicFoods.some(allergy =>
      food.id.toLowerCase() === allergy.toLowerCase() || food.name.toLowerCase() === allergy.toLowerCase()
    );
    const satisfiesDiet = DIET_LEVEL[food.dietaryType ?? 'vegan'] >= DIET_LEVEL[profile.dietType];
    return satisfiesAge && !isUserAllergic && satisfiesDiet;
  });

  const foodInterestNote = !profile.developmentalMilestones.showsInterestInFood
    ? TOOL_MESSAGES.FOOD_INTEREST_NOTE
    : undefined;

  return {
    success: true,
    safetyStatus: "APPROVED",
    babyName: profile.name,
    totalAvailableSafeFoods: safeFoods.length,
    foodInterestNote,
    foods: safeFoods
  };
}
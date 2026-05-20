import { FOOD_DATASET } from '../data/foodDataset.js';
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
  const readiness = checkBLWReadiness(profile.ageMonths, profile.developmentalMilestones);
  if (!readiness.isReady) {
    return {
      success: false,
      safetyStatus: "BLOCKED_NOT_READY",
      warningMessage: "CRITICAL ALERT: Infant does not meet physical readiness or age markers for Baby-Led Weaning. Hold solid introduction."
    };
  }

  // 3. Query dataset and filter out allergens the user specified
  const safeFoods = FOOD_DATASET.filter(food => {
    const satisfiesAge = profile.ageMonths >= food.minAgeMonths;
    const isUserAllergic = profile.allergicFoods.some(allergy =>
      food.id.toLowerCase() === allergy.toLowerCase() || food.name.toLowerCase() === allergy.toLowerCase()
    );
    return satisfiesAge && !isUserAllergic;
  });

  return {
    success: true,
    safetyStatus: "APPROVED",
    babyName: profile.name,
    totalAvailableSafeFoods: safeFoods.length,
    foods: safeFoods
  };
}
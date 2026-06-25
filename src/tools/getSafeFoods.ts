import { FOOD_DATASET } from '../data/foodDataset.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';
import { BabyProfileSchema, type BabyProfile } from '../schemas/profileSchema.js';
import { checkBLWReadiness } from './validateAge.js';
import { getGuidelines, type MilestoneKey } from '../config/guidelines.js';

interface ToolInput {
  profile: BabyProfile;
}

const MILESTONE_MESSAGES: Record<MilestoneKey, string> = {
	headControl: "hasn't developed full head control yet",
	canSitWithMinimalSupport: "isn't sitting upright with minimal support yet",
	reachAndGrab: "hasn't started reaching and grabbing yet",
	showsInterestInFood: "hasn't shown obvious interest in food yet",
};

export function getSafeFoodsTool(input: ToolInput) {
  // 1. Check that the data sent by the agent has the correct format.
  const validation = BabyProfileSchema.safeParse(input.profile);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid profile data format passed to backend core.",
      details: validation.error
    };
  }

  const profile = validation.data;
  const g = getGuidelines();
  const isEarlyWindow = g.ageRules.earlyWindowMonths.includes(profile.ageMonths);

  // 2. Enforce strict safety milestone gate
  const readiness = checkBLWReadiness(profile.ageMonths, profile.developmentalMilestones, profile.feedingType);
  if (!readiness.isReady) {
    if (isEarlyWindow && profile.feedingType === 'exclusive_breastfeeding') {
      return {
        success: false,
        safetyStatus: 'BLOCKED_NOT_READY',
        note: TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
      };
    }

    const missing = g.developmentalMilestones.required
      .filter((key) => !profile.developmentalMilestones[key])
      .map((key) => `• ${profile.name} ${MILESTONE_MESSAGES[key]}`);

    const markerList = missing.length > 0
      ? missing.join('\n')
      : `• ${profile.name} does not meet one or more physical readiness markers`;

    const note =
      `Thank you for taking the time to go through this with me.\n\n` +
      `Based on what you shared, it looks like ${profile.name} might need just a little more time before starting solid foods. ` +
      `This is completely normal — every baby develops at their own pace, and there is no rush!\n\n` +
      `Here is what we noticed:\n${markerList}\n\n` +
      `The good news is that most babies reach these milestones within the next few weeks. ` +
      `Starting solids at the right moment makes the whole experience safer and more enjoyable for both of you.\n\n` +
      `Come back whenever ${profile.name} is ready — we will be here!`;

    return {
      success: false,
      safetyStatus: "BLOCKED_NOT_READY",
      note
    };
  }

  // 3. Filter the food list by age, known allergies, and diet type.
  // A 5-month formula-fed baby who passed the readiness check is treated as 6 months
  // for food selection — all foods in the dataset require a minimum age of 6 months.
  const isEarlyWindowApproved =
    isEarlyWindow && g.ageRules.earlyWindowApprovedFeedingTypes.includes(profile.feedingType ?? '');
  const effectiveAge = isEarlyWindowApproved
    ? g.ageRules.earlyWindowEffectiveAgeMonths
    : profile.ageMonths;

  const DIET_LEVEL: Record<string, number> = { standard: 0, vegetarian: 1, vegan: 2 };
  const safeFoods = FOOD_DATASET.filter(food => {
    const satisfiesAge = effectiveAge >= food.minAgeMonths;
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
    foods: safeFoods,
    legend: {
      allergenDayNote: TOOL_MESSAGES.MONITORING_INSTRUCTIONS,
      allergyWarning: TOOL_MESSAGES.ALLERGY_WARNING,
      disclaimer: TOOL_MESSAGES.DISCLAIMER
    }
  };
}

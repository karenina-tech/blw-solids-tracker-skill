import { z } from 'zod';
import { MilestoneSchema } from '../schemas/profileSchema.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';
import { getGuidelines } from '../config/guidelines.js';

const ValidateAgeInputSchema = z.object({
	ageMonths: z.number().min(0).max(12),
	developmentalMilestones: MilestoneSchema,
	feedingType: z.enum(['formula', 'exclusive_breastfeeding']).optional()
});

type ValidateAgeInput = z.infer<typeof ValidateAgeInputSchema>;

export function checkBLWReadiness(
	ageMonths: number,
	milestones: z.infer<typeof MilestoneSchema>,
	feedingType?: 'formula' | 'exclusive_breastfeeding'
) {
	const g = getGuidelines();
	const isEarlyWindow = g.ageRules.earlyWindowMonths.includes(ageMonths);

	if (isEarlyWindow && feedingType === undefined) {
		return { isReady: false, ageOk: false, milestonesOk: false, requiresFeedingType: true };
	}

	const ageOk =
		ageMonths >= g.ageRules.standardMinimumMonths ||
		(isEarlyWindow && g.ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType!));

	const milestonesOk = g.developmentalMilestones.required.every(
		(key) => milestones[key] === true
	);

	return { isReady: ageOk && milestonesOk, ageOk, milestonesOk, requiresFeedingType: false };
}

// validateAgeTool checks age and feeding type only.
// Checking milestones is done separately in getSafeFoods.
export function validateAgeTool(input: ValidateAgeInput) {
	const validation = ValidateAgeInputSchema.safeParse(input);
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
			message: 'Baby is 5 months old — feeding type required to determine eligibility.'
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
			ageOk: false,
			note: isBreastfeedingBlock
				? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
				: TOOL_MESSAGES.AGE_TOO_YOUNG_NOTE
		};
	}

	const isEarlyWindowApproved = isEarlyWindow && g.ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType!);
	return {
		success: true,
		safetyStatus: 'APPROVED',
		ageOk: true,
		note: isEarlyWindowApproved ? TOOL_MESSAGES.FORMULA_5M_DISCLAIMER : undefined
	};
}

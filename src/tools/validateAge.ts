import { z } from 'zod';
import { MilestoneSchema } from '../schemas/profileSchema.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';

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
	// 5-month-olds: feeding type must be known before a verdict can be reached.
	if (ageMonths === 5 && feedingType === undefined) {
		return { isReady: false, ageOk: false, milestonesOk: false, requiresFeedingType: true };
	}

	// 5 months + formula is treated as age-eligible; exclusive breastfeeding is not.
	const ageOk = ageMonths >= 6 || (ageMonths === 5 && feedingType === 'formula');

	// showsInterestInFood is informational only — not a hard safety gate.
	const milestonesOk =
		milestones.headControl &&
		milestones.canSitWithMinimalSupport &&
		milestones.reachAndGrab;

	return { isReady: ageOk && milestonesOk, ageOk, milestonesOk, requiresFeedingType: false };
}

export function validateAgeTool(input: ValidateAgeInput) {
	const validation = ValidateAgeInputSchema.safeParse(input);
	if (!validation.success) {
		return { success: false, error: 'Invalid input', details: validation.error };
	}

	const { ageMonths, developmentalMilestones, feedingType } = validation.data;
	const readiness = checkBLWReadiness(ageMonths, developmentalMilestones, feedingType);

	if (readiness.requiresFeedingType) {
		return {
			success: false,
			safetyStatus: 'REQUIRES_FEEDING_TYPE',
			message: 'Baby is 5 months old — feeding type required to determine eligibility.'
		};
	}

	if (!readiness.isReady) {
		const isBreastfeedingBlock = ageMonths === 5 && feedingType === 'exclusive_breastfeeding';
		return {
			success: false,
			safetyStatus: 'BLOCKED_NOT_READY',
			ageOk: readiness.ageOk,
			milestonesOk: readiness.milestonesOk,
			note: isBreastfeedingBlock ? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE : undefined,
			warningMessage:
				'CRITICAL ALERT: Infant does not meet physical readiness or age markers for Baby-Led Weaning. Hold solid introduction.'
		};
	}

	return {
		success: true,
		safetyStatus: 'APPROVED',
		ageMonths,
		milestonesOk: true,
		message: 'Baby meets all physical readiness criteria for BLW.'
	};
}

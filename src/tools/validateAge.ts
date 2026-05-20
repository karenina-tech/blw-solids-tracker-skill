import { z } from 'zod';
import { MilestoneSchema } from '../schemas/profileSchema.js';

const ValidateAgeInputSchema = z.object({
	ageMonths: z.number().min(0).max(12),
	developmentalMilestones: MilestoneSchema
});

type ValidateAgeInput = z.infer<typeof ValidateAgeInputSchema>;

export function checkBLWReadiness(ageMonths: number, milestones: z.infer<typeof MilestoneSchema>) {
	const milestonesOk =
		milestones.headControl &&
		milestones.canSitWithMinimalSupport &&
		milestones.reachAndGrab &&
		milestones.showsInterestInFood;

	return {
		isReady: ageMonths >= 6 && milestonesOk,
		ageOk: ageMonths >= 6,
		milestonesOk
	};
}

export function validateAgeTool(input: ValidateAgeInput) {
	const validation = ValidateAgeInputSchema.safeParse(input);
	if (!validation.success) {
		return { success: false, error: 'Invalid input', details: validation.error };
	}

	const { ageMonths, developmentalMilestones } = validation.data;
	const readiness = checkBLWReadiness(ageMonths, developmentalMilestones);

	if (!readiness.isReady) {
		return {
			success: false,
			safetyStatus: 'BLOCKED_NOT_READY',
			ageOk: readiness.ageOk,
			milestonesOk: readiness.milestonesOk,
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

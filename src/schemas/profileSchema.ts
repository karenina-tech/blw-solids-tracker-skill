import { z } from 'zod';

export const MilestoneSchema = z.object({
  headControl: z.boolean(),
  canSitWithMinimalSupport: z.boolean(),
  reachAndGrab: z.boolean(),
  showsInterestInFood: z.boolean(),
});

export const BabyProfileSchema = z.object({
  name: z.string().min(1),
  ageMonths: z.number().min(0).max(24),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  dietType: z.enum(['standard', 'vegetarian', 'vegan']),
  location: z.string().default('Spain'),
  knownAllergies: z.boolean(),
  allergicFoods: z.array(z.string()).default([]),
  developmentalMilestones: MilestoneSchema,
});

export type BabyProfile = z.infer<typeof BabyProfileSchema>;

//TODO: add a validation for allergicFoods to have min 1 if knonwAllergies is true
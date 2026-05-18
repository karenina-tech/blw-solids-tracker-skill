export interface DevelopmentalMilestones {
  canSitWithMinimalSupport: boolean;
  goodHeadControl: boolean;
  reachAndGrab: boolean;
  showsInterestInFood: boolean;
}

export interface Exclusions {
  dietaryRestrictions: string[];
  knownAllergies: string[];
}

export interface BabyProfile {
  name: string;
  ageMonths: number;
  startDate: string;
  dietType: 'standard' | 'vegetarian' | 'vegan';
  feedingMethod: 'breastfed' | 'formula' | 'mixed';
  location: string;
  exclusions: Exclusions;
  developmentalMilestones: DevelopmentalMilestones;
}

export interface ChecklistItem {
  date: string;
  foodItem: string;
  category: 'Standard' | 'Allergen (Day 1 of 3)' | 'Allergen (Day 2 of 3)' | 'Allergen (Day 3 of 3)';
  isAllergenFirstDay: boolean;
  isOffered: boolean;
  hasAllergyReaction: boolean;
  notes: string;
}
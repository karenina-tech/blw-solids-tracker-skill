export interface ChecklistItem {
  date: string;
  foodItem: string;
  category: 'Standard' | 'Allergen (Day 1 of 3)' | 'Allergen (Day 2 of 3)' | 'Allergen (Day 3 of 3)';
  isAllergenFirstDay: boolean;
  isOffered: boolean;
  hasAllergyReaction: boolean;
  notes: string;
}
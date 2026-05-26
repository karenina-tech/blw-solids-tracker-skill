export interface ChecklistItem {
  date: string;
  foodItem: string;
  category: 'Standard' | 'Allergen (1/3)' | 'Allergen (2/3)' | 'Allergen (3/3)';
  isAllergenFirstDay: boolean;
  isOffered: boolean;
  hasAllergyReaction: boolean;
  notes: string;
}
import type { ChecklistItem } from '../@types/feeding';

export const mockChecklistData: ChecklistItem[] = [
  {
    date: "Jun 01",
    foodItem: "Avocado (Spears or mashed)",
    category: "Standard",
    isAllergenFirstDay: false,
    isOffered: true,
    hasAllergyReaction: false,
    notes: "Santi loved it! Ate almost half a spear."
  },
  {
    date: "Jun 02",
    foodItem: "Banana (Long strips)",
    category: "Standard",
    isAllergenFirstDay: false,
    isOffered: false,
    hasAllergyReaction: false,
    notes: ""
  },
  {
    date: "Jun 03",
    foodItem: "Homemade Bread (Toasted strips)",
    category: "Allergen (Day 1 of 3)",
    isAllergenFirstDay: true,
    isOffered: false,
    hasAllergyReaction: false,
    notes: ""
  },
  {
    date: "Jun 04",
    foodItem: "Homemade Bread (Toasted strips)",
    category: "Allergen (Day 2 of 3)",
    isAllergenFirstDay: false,
    isOffered: false,
    hasAllergyReaction: false,
    notes: ""
  },
  {
    date: "Jun 05",
    foodItem: "Homemade Bread (Toasted strips)",
    category: "Allergen (Day 3 of 3)",
    isAllergenFirstDay: false,
    isOffered: false,
    hasAllergyReaction: false,
    notes: ""
  }
];
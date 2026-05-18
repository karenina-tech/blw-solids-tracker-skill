// The deterministic source of truth for foods and hazards
// Claude should never guess which food is safe or how to prepare it. Your backend stores this dataset as strict code constants.
// This dataset is intentionally small and curated for demonstration purposes. In a production system, this could be expanded or sourced from a database.
export interface FoodItem {
  id: string;
  name: string;
  category: 'Standard' | 'Allergen';
  minAgeMonths: number;
  preparationByAge: {
    [ageRange: string]: string; // e.g., "6-9": "Long thick spears", "9-12": "Small bite-sized pieces"
  };
  chokingHazardWarning?: string;
}

export const FOOD_DATASET: FoodItem[] = [
  {
    id: 'avocado',
    name: 'Avocado',
    category: 'Standard',
    minAgeMonths: 6,
    preparationByAge: { "6-9": "Ripe strips the size of an adult pinky finger", "9-12": "Small diced cubes" }
  },
  {
    id: 'egg',
    name: 'Egg',
    category: 'Allergen',
    minAgeMonths: 6,
    preparationByAge: { "6-9": "Hard-boiled egg cut into quarters lengthwise or omelet strips", "9-12": "Scrambled pieces" },
    chokingHazardWarning: "Ensure the white is fully cooked; dry hard-boiled yolk can be a gag trigger if not mashed slightly."
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'Standard',
    minAgeMonths: 6,
    preparationByAge: { "6-9": "Strictly steamed or baked until completely fork-tender. Never raw.", "9-12": "Grated raw or stewed" },
    chokingHazardWarning: "Raw apple slices are a severe, high-risk choking hazard."
  }
];
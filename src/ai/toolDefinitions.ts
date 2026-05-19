export const getSafeFoodsSchema = {
  name: "getSafeFoods",
  endpoint: "/api/tools/get-safe-foods",
  description: "Validates baby physical readiness and returns a curated 30-day safe food dataset based on age, diet, and allergies. Do not invent foods outside the returned dataset.",
  parameters: {
    type: "object",
    properties: {
      profile: {
        type: "object",
        description: "The complete baby profile collected during onboarding.",
        properties: {
          name: {
            type: "string",
            description: "The baby's first name."
          },
          ageMonths: {
            type: "number",
            description: "Baby's age in whole months. Must be 6 or older."
          },
          startDate: {
            type: "string",
            description: "Planned BLW start date in YYYY-MM-DD format."
          },
          dietType: {
            type: "string",
            enum: ["standard", "vegetarian", "vegan"],
            description: "Household dietary preference."
          },
          location: {
            type: "string",
            description: "Country or region for seasonal food availability (e.g. 'Spain', 'Mexico'). Defaults to Spain if omitted.",
            default: "Spain"
          },
          knownAllergies: {
            type: "boolean",
            description: "Set to true if the baby has any known or suspected food allergies."
          },
          allergicFoods: {
            type: "array",
            items: { type: "string" },
            description: "Required when knownAllergies is true. List of allergens to exclude (e.g. ['egg', 'peanut', 'milk'])."
          },
          developmentalMilestones: {
            type: "object",
            description: "Physical readiness gates. All four must be true to proceed.",
            properties: {
              headControl: { type: "boolean", description: "Baby can hold head steady independently." },
              canSitWithMinimalSupport: { type: "boolean", description: "Baby can sit upright with minimal support." },
              reachAndGrab: { type: "boolean", description: "Baby can grab objects and bring them to mouth." },
              showsInterestInFood: { type: "boolean", description: "Baby watches adults eating and shows clear interest." }
            },
            required: ["headControl", "canSitWithMinimalSupport", "reachAndGrab", "showsInterestInFood"]
          }
        },
        required: ["name", "ageMonths", "startDate", "dietType", "knownAllergies", "developmentalMilestones"],
        if: {
          properties: { knownAllergies: { const: true } }
        },
        then: {
          required: ["allergicFoods"]
        }
      }
    },
    required: ["profile"]
  }
};

export const GLOBAL_TOOL_DEFINITIONS = [getSafeFoodsSchema];

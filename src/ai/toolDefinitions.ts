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
            description: "Baby's age in whole months. Must be between 6 and 12 months (first-introduction range)."
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

export const validateAgeSchema = {
  name: "validateAge",
  endpoint: "/api/tools/validate-age",
  description: "Checks whether a baby meets the minimum age (6 months) and all four physical readiness milestones required for Baby-Led Weaning. Call this before getSafeFoods to confirm the baby is ready.",
  parameters: {
    type: "object",
    properties: {
      ageMonths: {
        type: "number",
        description: "Baby's age in whole months. Must be between 6 and 12 months (first-introduction range)."
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
    required: ["ageMonths", "developmentalMilestones"]
  }
};

export const getChokingHazardsSchema = {
  name: "getChokingHazards",
  endpoint: "/api/tools/get-choking-hazards",
  description: "Returns age-appropriate food preparation instructions and choking hazard warnings for all foods in the dataset. Call this after getSafeFoods to give parents safe preparation guidance.",
  parameters: {
    type: "object",
    properties: {
      ageMonths: {
        type: "number",
        description: "Baby's age in whole months, used to select the correct preparation method. Must be between 6 and 12 months (first-introduction range)."
      }
    },
    required: ["ageMonths"]
  }
};

export const GLOBAL_TOOL_DEFINITIONS = [getSafeFoodsSchema, validateAgeSchema, getChokingHazardsSchema];

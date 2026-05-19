/**
 * 1.JSON shcema definition for the getSafeFoods tool. This schema defines the expected input structure and validation rules for the tool, ensuring that the agent provides all necessary information in the correct format when invoking it.
 */
export const getSafeFoodsSchema = {
  name: "getSafeFoods",
  description: "Validates baby physical readiness and returns a curated 30-day safe food dataset based on age and allergies. Do not invent foods.",
  parameters: {
    type: "object",
    properties: {
      profile: {
        type: "object",
        description: "The complete baby profile collected during onboarding",
        required: [
          "name",
          "ageMonths",
          "startDate",
          "dietType",
          "knownAllergies",
          "developmentalMilestones"
        ],
        properties: {
          name: { 
            type: "string", 
            description: "The name of the baby" 
          },
          ageMonths: { 
            type: "number", 
            description: "Baby's age in months. Must be a valid integer." 
          },
          startDate: { 
            type: "string", 
            description: "Calendar date to start BLW (YYYY-MM-DD)" 
          },
          dietType: { 
            type: "string", 
            enum: ["standard", "vegetarian", "vegan"],
            description: "Household dietary choice"
          },
          knownAllergies: { 
            type: "boolean", 
            description: "True if the baby has known or suspected allergies" 
          },
          allergicFoods: {
            type: "array",
            items: { type: "string" },
            description: "List of specific allergens if knownAllergies is true (e.g., ['egg', 'peanuts'])"
          },
          developmentalMilestones: {
            type: "object",
            description: "Mandatory physical readiness gates. All must be true for approval.",
            required: ["headControl", "canSitWithMinimalSupport", "reachAndGrab", "showsInterestInFood"],
            properties: {
              headControl: { type: "boolean", description: "Can hold head steady independently" },
              canSitWithMinimalSupport: { type: "boolean", description: "Can sit upright with minimal support" },
              reachAndGrab: { type: "boolean", description: "Can grab objects and bring them to mouth" },
              showsInterestInFood: { type: "boolean", description: "Watches adults intently when eating" }
            }
          }
        }
      }
    },
    required: ["profile"]
  }
};

/**
 * Maps the tool name to its JSON schema definition. This is the single source of truth for all tools available to the agent.
 */
export const GLOBAL_TOOL_DEFINITIONS = [getSafeFoodsSchema];

// JSON Schemas exposed to Claude so it knows your tools exist
import type { Anthropic } from '@anthropic-ai/sdk';

export const BLW_TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'getSafeFoods',
    description: 'Processes a baby profile, validates developmental milestones, and returns an array of safe whole foods filtered by age metrics and family allergen profiles.',
    input_schema: {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          description: 'The aggregated demographic and developmental metrics of the infant gathered during onboarding.',
          required: [
            'name', 
            'ageMonths', 
            'startDate', 
            'dietType', 
            'knownAllergies', 
            'developmentalMilestones'
          ],
          properties: {
            name: { type: 'string', description: "The infant's first name." },
            ageMonths: { type: 'number', description: "The infant's current chronological age in months." },
            startDate: { type: 'string', description: "Target start date for the schedule in YYYY-MM-DD format." },
            dietType: { 
              type: 'string', 
              enum: ['standard', 'vegetarian', 'vegan'],
              description: 'The explicit lifestyle dietary filtering constraint.'
            },
            location: { type: 'string', default: 'Spain', description: 'Country of reference for localized staple suggestions.' },
            knownAllergies: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'List of foods the infant has already reacted to, to be dropped from generation.'
            },
            developmentalMilestones: {
              type: 'object',
              required: ['canSitWithMinimalSupport', 'goodHeadControl', 'reachAndGrab', 'showsInterestInFood'],
              properties: {
                canSitWithMinimalSupport: { type: 'boolean', description: "Indicates whether the infant sits with little/no help." },
                goodHeadControl: { type: 'boolean', description: "Indicates complete control of neck and head movement." },
                reachAndGrab: { type: 'boolean', description: "Indicates purposeful manual targeting and manipulation of objects." },
                showsInterestInFood: { type: 'boolean', description: "Indicates oral fixation or forward tracking indicators during household meals." }
              }
            }
          }
        }
      }
    }
  }
];
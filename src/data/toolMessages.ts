/**
 * All user-facing informational notes returned by backend tools.
 * Edit the text here without touching any tool logic.
 */
export const TOOL_MESSAGES = {
	FORMULA_5M_DISCLAIMER:
		'A note before we continue: both the WHO and the AAP recommend 6 months as the standard age to begin solid foods. ' +
		'The WHO (2023 Guideline for Complementary Feeding) states that introducing complementary foods before 6 months in healthy term infants presents no nutritional advantage. ' +
		'The AAP advises that introducing solids before 6 months should only happen after a consultation with your pediatrician or pediatric nutritionist, ' +
		'typically discussed at the 4-month well-child visit. A healthcare professional can assess your baby\'s individual readiness and provide personalized guidance. ' +
		'If you have not already done so, we strongly encourage you to schedule that conversation before introducing solids.',
	AGE_TOO_YOUNG_NOTE:
		'Thank you for sharing that with me! Based on current guidelines from the WHO and the AAP, the minimum recommended age to start solid foods is 6 months. ' +
		'At this stage, milk — breast or formula — provides everything your baby needs for healthy development. ' +
		'There is no nutritional benefit to starting earlier, and waiting gives your baby\'s digestive system the time it needs to mature safely. ' +
		'Come back when your baby is closer to 6 months — we will be here to guide you through every step!',
	EXCLUSIVE_BREASTFEEDING_NOTE:
		'Exclusive breastfeeding provides complete nutrition for babies under 6 months and is strongly recommended by both the WHO and the AAP as the sole source of nutrition during this period. ' +
		'Current evidence shows no nutritional benefit to introducing solids before 6 months for exclusively breastfed babies — in fact, early introduction can interfere with milk supply and the natural development of the digestive system. ' +
		'The good news is that breastmilk is doing an excellent job right now, and most babies are ready to explore solid foods right around the 6-month mark. ' +
		'Come back then — we will be here to guide you through every step!',
	FOOD_INTEREST_NOTE:
		'Not all babies show obvious food interest before solids are introduced — this is completely normal. ' +
		'Food curiosity often develops naturally once they start exploring flavors and textures. ' +
		'The three physical markers (head control, sitting, and reach) are the most important safety signals, ' +
		'and your baby has passed all of them.',
	ALLERGY_WARNING:
		'Stop feeding immediately and contact emergency services if the infant exhibits any of the following within 2 hours of exposure: Hives, Swelling of lips or tongue, Vomiting, Wheezing, or Limpness.',
	DISCLAIMER:
		'This checklist is an educational planning utility for family tracking only. It does not replace individualized clinical evaluation or feeding advice from an accredited pediatrician.',
	MONITORING_INSTRUCTIONS: ' Morning or midday only — monitor for 2 hours after exposure.'
} as const;

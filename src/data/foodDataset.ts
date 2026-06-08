// The deterministic source of truth for foods and hazards.
// Agent should never guess which food is safe or how to prepare it.
// To add or modify items, run `npm run validate:dataset` before opening a PR.
import { type FoodItem } from '../schemas/foodDatasetSchema.js';

export type { FoodItem };

export interface PreparationByAge {
	'6-9': string;
	'9-12': string;
}

export const FOOD_DATASET: FoodItem[] = [
	{
		id: 'almond',
		name: 'Almond',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Mix smooth almond butter with breastmilk, formula, or warm water to thin it out.',
			'9-12': 'Spread smooth almond butter very thinly on toasted bread strips.'
		},
		chokingHazardWarning:
			'Whole almonds, nut pieces, or thick globs of almond butter are severe choking risks.'
	},
	{
		id: 'amaranth',
		name: 'Amaranth',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked into a thick porridge that sticks easily to a spoon.',
			'9-12': 'Cooked porridge or mixed into soft veggie patties.'
		}
	},
	{
		id: 'apple',
		name: 'Apple',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Strictly steamed or baked until completely fork-tender. Never raw.',
			'9-12': 'Grated raw or stewed until completely soft.'
		},
		chokingHazardWarning: 'Raw apple pieces or hard chunks are a severe, high-risk choking hazard.'
	},
	{
		id: 'apricot',
		name: 'Apricot',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Very ripe and soft, cut into thick wedges.',
			'9-12': 'Cut into small cubes. Do not offer dried apricots yet.'
		},
		chokingHazardWarning: 'Dried apricots are too tough and chewy, making them a serious choking hazard.'
	},
	{
		id: 'asparagus',
		name: 'Asparagus',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or roasted until very soft, serving the thick top part for the baby to hold.',
			'9-12': 'Cooked until completely soft and cut into small bite-sized pieces.'
		}
	},
	{
		id: 'avocado',
		name: 'Avocado',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Ripe strips the size of an adult pinky finger. Can roll in crushed cereal for grip.',
			'9-12': 'Small diced cubes to practice pincer grasp.'
		}
	},
	{
		id: 'banana',
		name: 'Banana',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Peel halfway so the baby can hold the bottom. Or cut into long vertical spears.',
			'9-12': 'Cut into small, bite-sized pieces or round slices.'
		},
		chokingHazardWarning: 'Very large, thick chunks can stick to the roof of the mouth.'
	},
	{
		id: 'barley',
		name: 'Barley',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked thoroughly until very soft, mashed slightly, or served as a thick porridge.',
			'9-12': 'Cooked until very soft, served as loose grains for pincer grasp practice.'
		}
	},
	{
		id: 'beef',
		name: 'Beef',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'Serve a large, thick strip of well-cooked steak (size of two adult fingers) for sucking. Or mix ground beef into a soft meatball.',
			'9-12': 'Finely shredded beef or small bits of soft ground beef.'
		},
		chokingHazardWarning: 'Avoid small, dry, or rubbery chunks of meat.'
	},
	{
		id: 'beef-liver',
		name: 'Beef Liver',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked thoroughly and pureed, or cut into a smooth paste to spread on toast strips.',
			'9-12': 'Cooked until soft and finely minced into tiny pieces.'
		}
	},
	{
		id: 'bell-pepper',
		name: 'Bell Pepper',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Roasted or steamed until very soft, cut into wide strips.',
			'9-12': 'Cooked until very soft and finely diced.'
		},
		chokingHazardWarning: 'Raw bell pepper is too hard and is a choking hazard.'
	},
	{
		id: 'black-beans',
		name: 'Black Beans',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked until very soft and mashed completely into a paste. Can spread on toast.',
			'9-12': 'Cooked until very soft. Flatten each individual bean between your fingers before serving.'
		},
		chokingHazardWarning: 'Whole, round beans are high-risk choking hazards. Always mash or flatten them.'
	},
	{
		id: 'blackberry',
		name: 'Blackberry',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Pressed flat with a fork or your fingers or add them to porridge.',
			'9-12': 'Pressed flat with a fork or your fingers.'
		},
		chokingHazardWarning: 'Whole berries are small, round, and firm enough to block the airway.'
	},
	{
		id: 'blueberry',
		name: 'Blueberry',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Pressed flat with a fork or your fingers or add them to porridge.',
			'9-12': 'Pressed flat with a fork or your fingers.'
		},
		chokingHazardWarning: 'Whole blueberries are a top choking risk because of their size and round shape.'
	},
	{
		id: 'bread',
		name: 'Bread',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Slightly toasted to prevent it from gumming up, cut into strips about 2 fingers wide.',
			'9-12': 'Slightly toasted, cut into small bite-sized pieces.'
		},
		chokingHazardWarning:
			'Fresh un-toasted bread can form a sticky ball in the mouth and cause a choking hazard.'
	},
	{
		id: 'broccoli',
		name: 'Broccoli',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or roasted florets with a long stem for the baby to hold like a handle.',
			'9-12': 'Cut into smaller, bite-sized pieces of soft cooked florets.'
		}
	},
	{
		id: 'brussels-sprouts',
		name: 'Brussels Sprouts',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed until completely soft, cut finely chopped to add to any recipe.',
			'9-12': 'Steamed until soft, shredded or cut into quarters.'
		},
		chokingHazardWarning: 'Whole brussels sprouts are a severe choking hazard.'
	},
	{
		id: 'butternut-squash',
		name: 'Butternut Squash',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Roasted or steamed until soft, cut into finger-length strips.',
			'9-12': 'Roasted or steamed until soft, cut into small diced cubes.'
		}
	},
	{
		id: 'cantaloupe',
		name: 'Cantaloupe',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Very ripe and soft, cut into long, thick rectangular strips.',
			'9-12': 'Very ripe and soft, cut into small bite-sized cubes.'
		}
	},
	{
		id: 'carrot',
		name: 'Carrot',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or roasted until completely fork-tender, cut into thick sticks.',
			'9-12': 'Steamed or roasted until very soft, cut into small diced cubes.'
		},
		chokingHazardWarning: 'Raw carrots or hard cooked carrot coins are a top choking hazard.'
	},
	{
		id: 'cashew',
		name: 'Cashew',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Smooth cashew butter thinned out completely with water or breastmilk.',
			'9-12': 'Spread smooth cashew butter very thinly on toast or mix into purees.'
		},
		chokingHazardWarning: 'Whole cashews or chunks are highly dangerous choking risks.'
	},
	{
		id: 'cauliflower',
		name: 'Cauliflower',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed until soft, keeping a large floret piece with a stem handle.',
			'9-12': 'Cooked until soft, chopped into small bite-sized florets.'
		}
	},
	{
		id: 'chayote',
		name: 'Chayote',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Peeled, core removed, steamed until perfectly tender, cut into thick finger strips.',
			'9-12': 'Peeled, core removed, steamed until tender, cut into small cubes.'
		}
	},
	{
		id: 'chia-seeds',
		name: 'Chia Seeds',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never serve dry. Soak completely in water or breastmilk to make a soft chia pudding.',
			'9-12': 'Soaked into pudding or mixed well into pancake batter before cooking.'
		}
	},
	{
		id: 'chicken',
		name: 'Chicken',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'Offer a whole cooked chicken drumstick with skin, cartilage, and loose bones removed. Or a thick strip of breast meat.',
			'9-12': 'Finely shredded chicken meat or small pieces of soft ground chicken.'
		}
	},
	{
		id: 'chickpeas',
		name: 'Chickpeas',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked until very soft and serve as meatballs or patties.',
			'9-12': 'Cooked until completely soft, with every single chickpea flattened flat between your fingers.'
		},
		chokingHazardWarning: 'Whole, round chickpeas are high choking risks. Always flatten or mash them.'
	},
	{
		id: 'coconut',
		name: 'Coconut',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Finely shredded unsweetened coconut mixed well into purees or soft foods.',
			'9-12': 'Finely shredded unsweetened coconut mixed well into soft foods.'
		},
		chokingHazardWarning: 'Chunks of hard coconut meat or large flakes are dangerous choking hazards.'
	},
	{
		id: 'corn',
		name: 'Corn',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Serve a large piece of cooked corn on the cob for the baby to scrape with their gums.',
			'9-12': 'Do not serve loose whole kernels yet. Serve loose corn only if mashed or pureed.'
		},
		chokingHazardWarning: 'Loose whole corn kernels are a high choking risk for babies under 12 months.'
	},
	{
		id: 'cranberry',
		name: 'Cranberry',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked into a smooth puree and mixed into other foods. Do not offer dried cranberries.',
			'9-12': 'Cooked and mashed completely flat.'
		},
		chokingHazardWarning: 'Dried cranberries are highly chewy and are dangerous choking risks.'
	},
	{
		id: 'cucumber',
		name: 'Cucumber',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'Peel the skin, cut into a thick rectangular log (adult finger size) for gnawing on.',
			'9-12': 'Grated raw cucumber, or very thinly sliced into half-moons.'
		},
		chokingHazardWarning: 'Hard chunks or round cucumber slices are dangerous choking hazards.'
	},
	{
		id: 'dates',
		name: 'Dates',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Pit removed, soaked in hot water until soft, and blended into a smooth paste to mix with other foods.',
			'9-12': 'Blended into pastes or used to sweeten soft baked goods.'
		},
		chokingHazardWarning: 'Whole dates are extremely sticky and tough, creating a serious choking risk.'
	},
	{
		id: 'egg',
		name: 'Egg',
		category: 'Allergen',
		dietaryType: 'vegetarian',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Hard-boiled egg cut into quarters lengthwise or omelet strips.',
			'9-12': 'Scrambled pieces or finely chopped hard-boiled egg.'
		},
		chokingHazardWarning:
			'Ensure the white is fully cooked; dry hard-boiled yolk can be a gag trigger if not mashed slightly.'
	},
	{
		id: 'eggplant',
		name: 'Eggplant',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Roasted or steamed until completely soft, cut into thick strips.',
			'9-12': 'Cooked until very soft and cut into small pieces.'
		}
	},
	{
		id: 'figs',
		name: 'Figs',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Fresh, very soft fig cut into halves or quarters lengthwise.',
			'9-12': 'Fresh fig cut into small bite-sized pieces.'
		},
		chokingHazardWarning: 'Never give dried figs; they are too tough to chew.'
	},
	{
		id: 'fish',
		name: 'Fish',
		category: 'Allergen',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Fully cooked and completely deboned, cut into strips about 2 fingers wide.',
			'9-12': 'Fully cooked and completely deboned, cut into small pieces or flaked/crumbled.'
		},
		chokingHazardWarning: 'Always double-check for tiny bones. Fish bones are a serious choking hazard.'
	},
	{
		id: 'grapes',
		name: 'Grapes',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Slice vertically into thin quarters lengthwise (like long strips). Remove seeds.',
			'9-12': 'Slice vertically into quarters or small, thin lengthwise pieces.'
		},
		chokingHazardWarning: 'Whole grapes match the airway perfectly and are a leading cause of choking.'
	},
	{
		id: 'green-beans',
		name: 'Green Beans',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or boiled until completely soft and tender. Leave whole for grasping.',
			'9-12': 'Cooked until soft and cut into small bite-sized pieces.'
		}
	},
	{
		id: 'green-peas',
		name: 'Green Peas',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Mash completely into a thick, smooth paste that can be mixed with other foods.',
			'9-12': 'Flatten every single pea flat between your fingers before serving.'
		},
		chokingHazardWarning: 'Whole peas are round and small, making them high-risk choking objects.'
	},
	{
		id: 'turkey',
		name: 'Turkey',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Mix into a soft meatball or patty shape cooked until tender.',
			'9-12': 'Cooked and crumbled into tiny, easy-to-chew bits.'
		}
	},
	{
		id: 'guava',
		name: 'Guava',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Very soft guava, cut into quarters. Scoop out all hard internal seeds.',
			'9-12': 'Soft guava, seeds removed, cut into small diced pieces.'
		},
		chokingHazardWarning: 'The hard seeds inside a guava are dangerous choking hazards.'
	},
	{
		id: 'hazelnut',
		name: 'Hazelnut',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Smooth nut butter thinned with water, breastmilk, or mixed into purees.',
			'9-12': 'Smooth nut butter spread thinly on toast strips or mixed into food.'
		},
		chokingHazardWarning: 'Whole nuts or thick globs of nut butter are severe choking hazards.'
	},
	{
		id: 'kiwi',
		name: 'Kiwi',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Peel skin, cut into thick vertical wedges. Roll in cereal if slippery.',
			'9-12': 'Peel skin, cut into small diced cubes.'
		}
	},
	{
		id: 'lamb',
		name: 'Lamb',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Serve a large piece on a bone (meat cartilage removed) or a thick strip of soft meat.',
			'9-12': 'Finely shredded soft lamb meat.'
		}
	},
	{
		id: 'leek',
		name: 'Leek',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked in soups or stews until completely soft and melted in texture.',
			'9-12': 'Finely chopped and cooked well inside a recipe.'
		}
	},
	{
		id: 'lentils',
		name: 'Lentils',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked well and mashed into a thick paste, or rolled into soft lentil balls.',
			'9-12': 'Cooked thoroughly until very soft, served as soft clumped spoonfuls.'
		}
	},
	{
		id: 'macadamia',
		name: 'Macadamia Nut',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Ground into a fine powder and mixed well into soft purees.',
			'9-12': 'Macadamia nut butter spread very thinly on food.'
		},
		chokingHazardWarning: 'Whole macadamia nuts are extremely hard and pose a massive choking risk.'
	},
	{
		id: 'mango',
		name: 'Mango',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cut a large, thick slice from the pit. Leave some skin on for grip, or roll in infant cereal.',
			'9-12': 'Cut into small diced cubes or thin slices.'
		},
		chokingHazardWarning: 'Slippery foods like mango can slide back into the throat quickly.'
	},
	{
		id: 'mushrooms',
		name: 'Mushrooms',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Sautéed or grilled until very soft, cut into large, wide cap pieces.',
			'9-12': 'Cooked thoroughly and chopped into tiny pieces.'
		},
		chokingHazardWarning: 'Raw or rubbery, undercooked mushrooms are hard to swallow.'
	},
	{
		id: 'nopales',
		name: 'Nopal',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Thoroughly cleaned of spines, boiled or grilled until completely tender, cut into wide strips.',
			'9-12': 'Boiled until very soft and finely diced into small bits.'
		},
		chokingHazardWarning:
			'Ensure all spikes are 100% removed. Stringy, firm nopal can be a gag risk if undercooked.'
	},
	{
		id: 'oatmeal',
		name: 'Oats',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked thick so it sticks to a spoon. Let baby practice holding a pre-loaded spoon.',
			'9-12': 'Cooked and rolled into small, soft oatmeal balls that the baby can pick up.'
		}
	},
	{
		id: 'onion',
		name: 'Onion',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked completely until transparent and very soft in stews, or roasted in large wedges.',
			'9-12': 'Finely chopped and thoroughly cooked into recipes.'
		},
		chokingHazardWarning: 'Raw onion rings or hard chunks are high choking hazards.'
	},
	{
		id: 'papaya',
		name: 'Papaya',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Ripe and soft, seeds removed, cut into long finger spears.',
			'9-12': 'Ripe and soft, cut into small diced cubes.'
		}
	},
	{
		id: 'pasta',
		name: 'Pasta',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'Serve large shapes that are easy to hold, like Fusilli (spirals) or Penne, cooked until very soft.',
			'9-12': 'Smaller shapes like Ditalini, or cut-up soft spaghetti strands.'
		}
	},
	{
		id: 'peach',
		name: 'Peach',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Very ripe and soft, cut into thick wedges.',
			'9-12': 'Very ripe and soft, cut into small cubes.'
		},
		chokingHazardWarning: 'Unripe, hard peaches are a choking hazard.'
	},
	{
		id: 'pear',
		name: 'Pear',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'If hard, steam until soft and cut into wedges. If extremely ripe and soft, serve raw wedges without skin.',
			'9-12': 'Soft pear cut into small cubes.'
		},
		chokingHazardWarning: 'Firm or hard raw pear chunks are dangerous choking risks.'
	},
	{
		id: 'peanut',
		name: 'Peanut',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Mix smooth peanut butter with a little warm water or formula to thin it out.',
			'9-12': 'Spread smooth peanut butter very thinly on a piece of toasted bread.'
		},
		chokingHazardWarning: 'Whole peanuts and thick spoonfuls of peanut butter are high-risk choking hazards.'
	},
	{
		id: 'pecan',
		name: 'Pecan',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Grind finely into flour or mix thin pecan butter into warm cereals.',
			'9-12': 'Spread pecan butter very thinly on toast strips.'
		},
		chokingHazardWarning: 'Whole pecans or large nut chunks are dangerous choking risks.'
	},
	{
		id: 'pineapple',
		name: 'Pineapple',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cut a large, thick core piece for the baby to suck and gnaw on. Discard fibrous strings.',
			'9-12': 'Finely crushed or chopped into tiny, soft bits.'
		},
		chokingHazardWarning: 'Chunky or fibrous pineapple sections are a high choking risk.'
	},
	{
		id: 'pistachio',
		name: 'Pistachio',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Ground into a fine powder and mixed into warm oatmeal or purees.',
			'9-12': 'Ground into a fine powder or served as a thin layer of smooth pistachio butter.'
		},
		chokingHazardWarning: 'Whole pistachios are a common choking hazard for young children.'
	},
	{
		id: 'plum',
		name: 'Plum',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Very ripe and soft, pit removed, cut into thick slices.',
			'9-12': 'Cut into quarters.'
		}
	},
	{
		id: 'pork',
		name: 'Pork',
		category: 'Standard',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Serve a large, thick chop bone or strip with no loose parts, or ground pork meatball.',
			'9-12': 'Finely shredded tender pork meat.'
		}
	},
	{
		id: 'potato',
		name: 'Potato',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Baked or boiled potato cut into thick wedges. Ensure it is soft.',
			'9-12': 'Cut into small, soft cubes or mashed slightly.'
		}
	},
	{
		id: 'pumpkin',
		name: 'Pumpkin',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked or roasted until completely soft, served in thick vertical slices.',
			'9-12': 'Cooked until soft, cut into small cubes.'
		}
	},
	{
		id: 'quinoa',
		name: 'Quinoa',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked until soft and served clumped together, or mixed into a thick puree.',
			'9-12': 'Cooked soft, mixed into veggie or bean patties for easy grabbing.'
		}
	},
	{
		id: 'radish',
		name: 'Radish',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Boiled or steamed until completely soft and mushy, cut into wedges.',
			'9-12': 'Grated raw into very fine, thin threads.'
		},
		chokingHazardWarning: 'Raw whole or sliced radishes are extremely hard and represent high choking risks.'
	},
	{
		id: 'raspberry',
		name: 'Raspberry',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Mashed completely flat with a fork or mixed into yogurt/cereal.',
			'9-12': 'Pressed flat between your fingers before offering.'
		},
		chokingHazardWarning: 'Whole berries can easily get stuck in the throat.'
	},
	{
		id: 'rice',
		name: 'Rice',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9':
				'Cook short-grain rice so it is sticky, and roll it into large logs or balls that are easy to hold.',
			'9-12': 'Serve sticky rice clumps. Avoid loose, dry, separate grains of rice.'
		},
		chokingHazardWarning: 'Loose, dry rice can cause a baby to cough or inhale the grain into their airway.'
	},
	{
		id: 'sesame',
		name: 'Sesame',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Mix tahini (sesame paste) into purees or warm water to thin it out completely.',
			'9-12': 'Serve tahini mixed into soft foods or spread very thinly on food.'
		},
		chokingHazardWarning: 'Thick, sticky pastes can be difficult for a baby to swallow and cause gagging.'
	},
	{
		id: 'shrimp',
		name: 'Shrimp',
		category: 'Allergen',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Remove head, vein, shell. Chop finely and mix into a soft, easy-to-chew meatball or patty.',
			'9-12': 'Cut into very small, bite-sized pieces after thorough cooking.'
		},
		chokingHazardWarning:
			'Whole shrimp or large chunks have a firm, rubbery texture that poses a high choking hazard.'
	},
	{
		id: 'soy',
		name: 'Soy',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Soft or firm tofu cut into thick strips about the size of two adult fingers.',
			'9-12': 'Tofu cut into small cubes for the baby to pick up.'
		}
	},
	{
		id: 'squid',
		name: 'Squid',
		category: 'Allergen',
		dietaryType: 'standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cook until completely tender, chop extremely fine, and mix into a soft recipe or puree.',
			'9-12': 'Minced or finely chopped into tiny pieces. Do not offer as large finger food.'
		},
		chokingHazardWarning: 'Squid has a very tough and rubbery texture that makes it a severe choking hazard.'
	},
	{
		id: 'strawberries',
		name: 'Strawberries',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Serve a single, very large strawberry whole for the baby to hold and gnaw on.',
			'9-12': 'Cut into small diced pieces. Do not serve medium or small strawberries whole.'
		},
		chokingHazardWarning:
			'Medium or small whole strawberries fit perfectly in the airway and are high risk.'
	},
	{
		id: 'sweet-potato',
		name: 'Sweet Potato',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or baked until very soft, cut into thick strips the size of an adult finger.',
			'9-12': 'Steamed or baked until very soft, cut into small cubes.'
		}
	},
	{
		id: 'tapioca',
		name: 'Tapioca',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked completely and prepare a tortilla or flatbread with the tapioca flour, cut into strips for gnawing.',
			'9-12': 'Cooked soft and mixed into purees or porridge mixtures.'
		},
		chokingHazardWarning: 'Large uncooked or solid tapioca pearls are direct choking risks.'
	},
	{
		id: 'tofu',
		name: 'Tofu',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cut into finger-length sticks that do not crumble easily.',
			'9-12': 'Cut into small pieces or cubes.'
		}
	},
	{
		id: 'tomato',
		name: 'Tomato',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cut a large tomato into wide wedges or thick slices.',
			'9-12': 'Finely diced tomato pieces.'
		},
		chokingHazardWarning:
			'Whole cherry tomatoes are high-risk choking hazards. Never give whole cherry tomatoes.'
	},
	{
		id: 'turnip',
		name: 'Turnip',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or roasted until completely soft, cut into thick finger-sized logs.',
			'9-12': 'Steamed until fork-tender, cut into small diced cubes.'
		}
	},
	{
		id: 'walnut',
		name: 'Walnut',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Never whole. Grind into a very fine flour and mix into warm cereal or purees.',
			'9-12': 'Serve walnut butter mixed cleanly into other soft foods or spread very thinly.'
		},
		chokingHazardWarning: 'Whole walnuts or large nut pieces are severe choking hazards.'
	},
	{
		id: 'watermelon',
		name: 'Watermelon',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cut into a large, wide rectangular wedge with all black and white seeds completely removed.',
			'9-12': 'Seeds removed, cut into small diced squares.'
		},
		chokingHazardWarning: 'Always remove every single seed. Hard seeds are immediate choking objects.'
	},
	{
		id: 'wheat',
		name: 'Wheat Flour',
		category: 'Allergen',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked into soft wheat cereals or used to make simple, soft homemade pancakes cut into strips.',
			'9-12': 'Soft baked goods or homemade crackers cut into small bite-sized squares.'
		}
	},
	{
		id: 'white-beans',
		name: 'White Beans',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Cooked until completely soft and mashed into a paste spread over food.',
			'9-12': 'Cooked until soft, with every single bean squished flat between your fingers.'
		},
		chokingHazardWarning: 'Whole round beans are highly dangerous for airways.'
	},
	{
		id: 'zucchini',
		name: 'Zucchini',
		category: 'Standard',
		minAgeMonths: 6,
		preparationByAge: {
			'6-9': 'Steamed or roasted until soft, cut into thick vertical strips.',
			'9-12': 'Steamed or roasted until soft, cut into small cubes.'
		}
	}
];

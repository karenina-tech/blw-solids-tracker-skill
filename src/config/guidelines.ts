import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export type MilestoneKey =
	| 'headControl'
	| 'canSitWithMinimalSupport'
	| 'reachAndGrab'
	| 'showsInterestInFood';

export interface GuidelinesConfig {
	_meta: {
		version: string;
		lastReviewed: string;
		reviewedBy: string;
		sources: Array<{ id: string; citation: string }>;
	};
	ageRules: {
		standardMinimumMonths: number;
		absoluteMinimumMonths: number;
		earlyWindowMonths: number[];
		earlyWindowApprovedFeedingTypes: string[];
		earlyWindowEffectiveAgeMonths: number;
	};
	developmentalMilestones: {
		required: MilestoneKey[];
		informational: MilestoneKey[];
	};
}

// Find guidelines.json in the project root folder.
// This works whether the server is running in development (src/) or production (dist/).
const GUIDELINES_PATH = join(
	dirname(fileURLToPath(import.meta.url)),
	'../../guidelines.json'
);

let _cache: GuidelinesConfig | null = null;

export function getGuidelines(): GuidelinesConfig {
	if (!_cache) {
		_cache = JSON.parse(readFileSync(GUIDELINES_PATH, 'utf-8')) as GuidelinesConfig;
	}
	return _cache;
}

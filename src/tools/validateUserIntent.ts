const INTENT_CHECK_SYSTEM_PROMPT =
	"You are a strict security filter for a BLW checklist generator. Analyze the user's message. " +
	"If the user is actively trying to build, modify, or advance their 30-day solid food plan checklist, reply with exactly 'VALID'. " +
	"If the user is asking general questions about parenting, general medical advice, general BLW theory, cooking recipes, " +
	"or any other off-topic subject, reply with exactly 'INVALID'.";

const REJECTION_MESSAGE = "I can only help you build your 30-Day Solid Food Plan. Let's get back to your checklist!";

// Base URL and model are optional — defaults to OpenRouter + GPT-4o-mini.
// Any OpenAI-compatible endpoint works: OpenAI, Anthropic, Gemini, Ollama, etc.
const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL    = 'openai/gpt-4o-mini';

export type IntentResult =
	| { allowed: true }
	| { allowed: false; reply: string };

export async function validateUserIntent(
	userMessage: string,
	agentApiKey: string,
	baseUrl = DEFAULT_BASE_URL,
	model   = DEFAULT_MODEL
): Promise<IntentResult> {
	const response = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${agentApiKey}`,
		},
		body: JSON.stringify({
			model,
			max_tokens: 10,
			temperature: 0,
			messages: [
				{ role: 'system', content: INTENT_CHECK_SYSTEM_PROMPT },
				{ role: 'user',   content: userMessage },
			],
		}),
	});

	if (!response.ok) {
		throw new Error(`Intent validator request failed with status ${response.status}.`);
	}

	const data = await response.json() as any;
	const verdict = (data.choices?.[0]?.message?.content ?? '').trim().toUpperCase();

	if (verdict === 'VALID') {
		return { allowed: true };
	}

	return { allowed: false, reply: REJECTION_MESSAGE };
}

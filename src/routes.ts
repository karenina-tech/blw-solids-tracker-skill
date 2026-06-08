import type { FastifyInstance } from 'fastify';
import { getSafeFoodsTool } from './tools/getSafeFoods.js';
import { validateAgeTool } from './tools/validateAge.js';
import { getChokingHazardsTool } from './tools/getChokingHazards.js';
import { generate30DayPlan } from './domain/blwEngine.js';
import { compileHtmlTemplate } from './domain/pdfGenerator.js';
import * as fs from 'fs';
import * as path from 'path';
import { GLOBAL_TOOL_DEFINITIONS } from './ai/toolDefinitions.js';

export async function appRoutes(fastify: FastifyInstance) {
	/**
	 * Tool Discovery Endpoint: Provides metadata about the skill and its available tools.
	 *
	 */
	fastify.get('/api/tools', async (_request, reply) => {
		return reply.code(200).send({
			version: '1.0.0',
			name: 'blw-solids-tracker-skill',
			description: 'Baby-Led Weaning solid food introduction safety checker and checklist generator.',
			commands: [
				{
					name: 'blw-tracker',
					endpoint: '/api/commands/blw-tracker',
					method: 'POST',
					description:
						'Initializes the BLW onboarding flow. Returns a first prompt to start collecting the baby profile via conversation.'
				}
			],
			tools: GLOBAL_TOOL_DEFINITIONS
		});
	});

	/**
	 * Command Endpoint (optional): Receives the initial command from the Agent to start the BLW Tracker protocol.
	 */
	fastify.post('/api/commands/blw-tracker', async (_request, reply) => {
		return reply.code(200).send({
			command: 'blw-tracker',
			status: 'initialized',
			message: "🥑 BLW Solids Tracker Initialized. Let's set up your profile.",
			next_step: 'onboarding',
			prompt: "What is your baby's name?"
		});
	});

	/**
	 * Tool Execution Endpoint: Processes the tool request from the Agent.
	 */
	fastify.post('/api/tools/get-safe-foods', async (request, reply) => {
		const { profile } = request.body as { profile: any };

		if (!profile) {
			return reply.code(400).send({
				success: false,
				error: 'BAD_REQUEST',
				message: 'Missing required field: profile within request body.'
			});
		}

		try {
			const result = getSafeFoodsTool({ profile });

			if (result.safetyStatus === 'APPROVED') {
				const plan = generate30DayPlan(result.foods as any, profile.startDate, profile.ageMonths);
				const htmlData = compileHtmlTemplate(profile.name, profile.startDate, plan);
				const outputPath = path.join(process.cwd(), 'BLW_Fridge_Checklist.html');
				fs.writeFileSync(outputPath, htmlData, 'utf-8');
				const nameSlug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
				fs.writeFileSync(
					path.join(process.cwd(), 'BLW_Checklist_Meta.json'),
					JSON.stringify({ nameSlug }),
					'utf-8'
				);
				fastify.log.info(`📊 Entregable guardado en: ${outputPath}`);
				const checklistUrl = `http://${request.headers.host}/api/checklist`;
				return reply.code(200).send({ ...result, plan, checklistUrl });
			}

			return reply.code(200).send(result);
		} catch (error: any) {
			fastify.log.error(error);
			return reply.code(400).send({ success: false, error: 'VALIDATION_FAILED', message: error.message });
		}
	});

	/**
	 * Early stop endpoint validation: only needs ageMonths + milestones. If BLOCKED, agent stops here. */
	fastify.post('/api/tools/validate-age', async (request, reply) => {
		const { ageMonths, developmentalMilestones, feedingType } = request.body as {
			ageMonths: any;
			developmentalMilestones: any;
			feedingType?: 'formula' | 'exclusive_breastfeeding';
		};

		if (ageMonths === undefined || !developmentalMilestones) {
			return reply.code(400).send({
				success: false,
				error: 'BAD_REQUEST',
				message: 'Missing required fields: ageMonths, developmentalMilestones.'
			});
		}

		try {
			const result = validateAgeTool({ ageMonths, developmentalMilestones, feedingType });
			return reply.code(200).send(result);
		} catch (error: any) {
			fastify.log.error(error);
			return reply.code(400).send({ success: false, error: 'VALIDATION_FAILED', message: error.message });
		}
	});

	/**
	 * Choking Hazards Tool Endpoint: Returns a list of common choking hazards based on the baby's age and developmental milestones.
	 */
	fastify.post('/api/tools/get-choking-hazards', async (request, reply) => {
		const { ageMonths, feedingType } = request.body as { ageMonths: any; feedingType?: 'formula' | 'exclusive_breastfeeding' };

		if (ageMonths === undefined) {
			return reply.code(400).send({
				success: false,
				error: 'BAD_REQUEST',
				message: 'Missing required field: ageMonths.'
			});
		}

		try {
			const result = getChokingHazardsTool({ ageMonths, feedingType });
			return reply.code(200).send(result);
		} catch (error: any) {
			fastify.log.error(error);
			return reply.code(400).send({ success: false, error: 'VALIDATION_FAILED', message: error.message });
		}
	});

	// Serves the last generated checklist. Content-Disposition uses the baby's name slug.
	fastify.get('/api/checklist', async (_request, reply) => {
		const filePath = path.join(process.cwd(), 'BLW_Fridge_Checklist.html');
		if (!fs.existsSync(filePath)) {
			return reply.code(404).send({ success: false, error: 'NOT_FOUND', message: 'No checklist found. Run get-safe-foods first.' });
		}
		const metaPath = path.join(process.cwd(), 'BLW_Checklist_Meta.json');
		const nameSlug = fs.existsSync(metaPath)
			? (JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as { nameSlug: string }).nameSlug
			: 'baby';
		reply.header('Content-Type', 'text/html');
		reply.header('Content-Disposition', `inline; filename="${nameSlug}-blw-checklist.html"`);
		return reply.code(200).send(fs.readFileSync(filePath, 'utf-8'));
	});

	// Serves the agent system prompt with today's date injected.
	fastify.get('/api/prompt', async (_request, reply) => {
		const promptPath = path.join(process.cwd(), 'prompts', 'blw-orchestrator.md');
		if (!fs.existsSync(promptPath)) {
			return reply.code(404).send({ success: false, error: 'NOT_FOUND', message: 'Prompt file not found.' });
		}
		const today = new Date().toISOString().split('T')[0];
		const prompt = fs.readFileSync(promptPath, 'utf-8').replace('{{TODAY}}', today);
		return reply.code(200).send({ prompt });
	});

	/**
	 * PDF Generation Endpoint: Generates a PDF report based on the provided data.
	 */
	fastify.post('/api/generate-pdf', async (request, reply) => {
		const { name, startDate, items } = request.body as any;
		const htmlPayload = compileHtmlTemplate(name, startDate, items);
		reply.header('Content-Type', 'text/html');
		return reply.code(200).send(htmlPayload);
	});
}

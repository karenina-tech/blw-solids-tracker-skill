import type { FastifyInstance } from 'fastify';
import { getSafeFoodsTool } from './tools/getSafeFoods.js';
import { compileHtmlTemplate } from './domain/pdfGenerator.js';
import * as fs from 'fs';
import * as path from 'path';
import { GLOBAL_TOOL_DEFINITIONS } from './ai/toolDefinitions.js';

export async function appRoutes(fastify: FastifyInstance) {
  /**
  * Tool Discovery Endpoint: Provides metadata about the skill and its available tools for external agents.
  * 
  */
  fastify.get('/api/tools', async (request, reply) => {
    return reply.code(200).send({
      version: "1.0.0",
      name: "blw-solids-tracker-skill",
      description: "Pediatric Baby-Led Weaning solid food introduction safety checker and checklist generator.",
      commands: [
        {
          name: "blw-tracker",
          endpoint: "/api/commands/blw-tracker",
          method: "POST",
          description: "Initializes the BLW onboarding flow. Returns a first prompt to start collecting the baby profile via conversation."
        }
      ],
      tools: GLOBAL_TOOL_DEFINITIONS
    });
  });

  /**
   * Main Command Endpoint: Receives the initial command from the Agent to start the BLW Tracker protocol.
   */
  fastify.post('/api/commands/blw-tracker', async (request, reply) => {
    return reply.code(200).send({
      command: "blw-tracker",
      status: "initialized",
      message: "🥑 BLW Solids Tracker Initialized. Let's set up your profile.",
      next_step: "onboarding",
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
        error: 'Bad Request', 
        message: 'Missing required field: profile within request body.' 
      });
    }

    try {
      // Execute internal TS logic & domain validation
      const result = getSafeFoodsTool({ profile });
      // if the baby approves, automatically compile the printable HTML on the server side    
      if (result.safetyStatus === 'APPROVED') {
        // Map the safe foods from the returned dataset for the template
          const htmlData = compileHtmlTemplate(
          profile.name, 
          profile.startDate, 
          result.foods as any
        );
        const outputPath = path.join(process.cwd(), 'BLW_Fridge_Checklist.html');
        fs.writeFileSync(outputPath, htmlData, 'utf-8');
        fastify.log.info(`📊 Entregable guardado en: ${outputPath}`);
      }

      // Return clean JSON for the Agent to parse and speak back to the parent
      return reply.code(200).send(result);
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(400).send({ error: 'Validation Failed', message: error.message });
    }
  });

  /**
   * PDF Generation Endpoint
   */
  fastify.post('/api/generate-pdf', async (request, reply) => {
    const { name , startDate, items } = request.body as any;
    const htmlPayload = compileHtmlTemplate(name, startDate, items);
    reply.header('Content-Type', 'text/html');
    return reply.code(200).send(htmlPayload);
  });
}
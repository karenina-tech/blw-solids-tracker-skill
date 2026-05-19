import type { FastifyInstance } from 'fastify';
import { getSafeFoodsTool } from './tools/getSafeFoods.js';
import { compileHtmlTemplate } from './domain/pdfGenerator.js';
import * as fs from 'fs';
import * as path from 'path';

export async function appRoutes(fastify: FastifyInstance) {
  
  fastify.post('/api/commands/blw-tracker', async (request, reply) => {
    return reply.code(200).send({
      command: "blw-tracker",
      status: "initialized",
      message: "Pediatric BLW Method Protocol Initialized. Let's set up your profile.",
      next_step: "onboarding",
      prompt: "What is your baby's name?"
    });
  });

  /**
   * Agnostic Endpoint: Recive profile data from any Agent, executes strict TypeScript logic, and returns clean JSON data.
   */
  fastify.post('/api/tools/get-safe-foods', async (request, reply) => {
    const { profile } = request.body as { profile: any };

    if (!profile) {
      return reply.code(400).send({ 
        error: 'Bad Request', 
        message: 'Missing required field: profile' 
      });
    }

    try {
      const result = getSafeFoodsTool({ profile });
      // if the baby approves, automatically compile the printable HTML on the server side    
      if (result.safetyStatus === 'APPROVED') {
        // Map the safe foods from the returned dataset for the template
          const htmlData = compileHtmlTemplate(
          profile.babyName, 
          profile.startDate, 
          result.foods as any
        );
        const outputPath = path.join(process.cwd(), 'BLW_Fridge_Checklist.html');
        fs.writeFileSync(outputPath, htmlData, 'utf-8');
        fastify.log.info(`📊 Entregable guardado en: ${outputPath}`);
      }

      // Returns JSON to the Agent
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
    const { babyName, startDate, items } = request.body as any;
    const htmlPayload = compileHtmlTemplate(babyName, startDate, items);
    reply.header('Content-Type', 'text/html');
    return reply.code(200).send(htmlPayload);
  });
}
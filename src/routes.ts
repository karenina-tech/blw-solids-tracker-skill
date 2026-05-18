import type { FastifyInstance } from 'fastify';
import { handleUserMessage } from './services/anthropicService.js';
import { compileHtmlTemplate } from './domain/pdfGenerator.js';
import * as fs from 'fs';
import * as path from 'path';

export async function appRoutes(fastify: FastifyInstance) {
  
  // Endpoint de chat que interactúa con Claude
  fastify.post('/api/chat', async (request, reply) => {
    const { messages } = request.body as { messages: any[] };
    try {
      const responseContent = await handleUserMessage(messages);

      // --- TRUCO PARA EL MVP: Generación automática de archivo ---
      // Si en la conversación ya confirmamos que todo está aprobado, generamos el archivo estático
      const textoFinal = JSON.stringify(responseContent);
      if (textoFinal.includes("APPROVED") || textoFinal.includes("Calendar")) {
        
        // Simulamos los datos del dataset para la plantilla imprimible
        const mockItems = [
          { date: "May 18", foodItem: "Avocado (Ripe strips)", category: "Standard" },
          { date: "May 19", foodItem: "⏰ Egg (Hard-boiled quarters)", category: "Allergen (Day 1/3)" },
          { date: "May 20", foodItem: "Apple (Steamed tender pieces)", category: "Standard" }
        ];

        const htmlData = compileHtmlTemplate("Santi", "2026-05-18", mockItems as any);
        
        // Guardamos un archivo HTML real en la raíz de tu proyecto
        const outputPath = path.join(process.cwd(), 'BLW_Fridge_Checklist.html');
        fs.writeFileSync(outputPath, htmlData, 'utf-8');
        
        fastify.log.info(`🎯 [MVP SUCCESS] ¡Archivo imprimible generado con éxito en: ${outputPath}!`);
      }

      return reply.code(200).send({ content: responseContent });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to process agentic routing turn.', message: error.message });
    }
  });

  // Servir el PDF/HTML directo si se solicita
  fastify.post('/api/generate-pdf', async (request, reply) => {
    const { babyName, startDate, items } = request.body as any;
    const htmlPayload = compileHtmlTemplate(babyName, startDate, items);
    reply.header('Content-Type', 'text/html');
    return reply.code(200).send(htmlPayload);
  });
}
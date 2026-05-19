// Fastify Server entry point
//assemble the main server launch script with environment safety layers
import fastify from 'fastify';
import { appRoutes } from './routes.js';

const server = fastify({ logger: true });

// Register API routes
server.register(appRoutes);

const start = async () => {
  try {
    // Port 3000 is clean and industry standard for server backends
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🥑 BLW Agentic truth core running live at http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
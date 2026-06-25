import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes.js';

const server = fastify({ logger: true });

await server.register(cors, {
  origin: true // Allows any origin to fetch your tools dynamically
});

// Register API routes
server.register(appRoutes);

const start = async () => {
  try {
    // Port 3000 is clean and industry standard for server backends
    const port = parseInt(process.env.PORT ?? '3000', 10);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🥦 BLW Solids Tracker running at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';

dotenv.config();

const server = Fastify({ logger: true });

// ✅ FIXED CORS - Allow Netlify
server.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://postipilot.netlify.app',
    /https:\/\/.*--postipilot\.netlify\.app$/, // All Netlify preview URLs
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this'
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
server.register(authRoutes, { prefix: '/api/auth' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

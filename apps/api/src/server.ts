import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { postsRoutes } from './routes/posts.routes';
import { socialRoutes } from './routes/social.routes';

// @ts-ignore
const process = global.process;

dotenv.config();


const server = Fastify({ logger: true });

// Security
server.register(helmet, {
  crossOriginResourcePolicy: false,
});

// CORS
server.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://postipilot.netlify.app',
    /https:\/\/.*--postipilot\.netlify\.app$/,
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

// JWT
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  sign: { expiresIn: '24h' }
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(postsRoutes, { prefix: '/api/posts' });
server.register(socialRoutes, { prefix: '/api/social' });

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

export default server;


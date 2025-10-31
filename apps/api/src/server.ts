import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import * as dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { postsRoutes } from './routes/posts.routes.js';
import { socialRoutes } from './routes/social.routes.js';

// @ts-ignore
const process = global.process;
// @ts-ignore
const console = global.console;

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
    'https://social-media-agency-web-three.vercel.app',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

// JWT
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  sign: { expiresIn: '24h' },
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
  } catch (err: any) {
    // @ts-ignore
    console.error(err.message || err);
    process.exit(1);
  }
};

start();

export default server;

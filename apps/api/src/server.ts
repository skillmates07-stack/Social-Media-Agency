import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this'
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Import routes (we'll create these next)
// server.register(authRoutes, { prefix: '/api/auth' });
// server.register(postsRoutes, { prefix: '/api/posts' });

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

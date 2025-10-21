import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Register new agency
  fastify.post('/register', authController.register);
  
  // Login
  fastify.post('/login', authController.login);
  
  // Get current user (protected) - use authenticate directly
  fastify.get('/me', {
    preHandler: [authenticate]
  }, authController.getCurrentUser);
  
  // Refresh token
  fastify.post('/refresh', authController.refreshToken);
  
  // Logout (protected)
  fastify.post('/logout', {
    preHandler: [authenticate]
  }, authController.logout);
}

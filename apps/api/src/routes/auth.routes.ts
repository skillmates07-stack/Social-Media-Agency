import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  // Register new agency
  fastify.post('/register', authController.register);
  
  // Login
  fastify.post('/login', authController.login);
  
  // Get current user (protected)
  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, authController.getCurrentUser);
  
  // Refresh token
  fastify.post('/refresh', authController.refreshToken);
  
  // Logout
  fastify.post('/logout', {
    preHandler: [fastify.authenticate]
  }, authController.logout);
}

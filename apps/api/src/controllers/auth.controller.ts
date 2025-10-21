import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name, subdomain } = request.body as any;
    
    // Check if agency exists
    const existing = await prisma.agency.findUnique({ where: { email } });
    if (existing) {
      return reply.code(400).send({ error: 'Agency already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create agency
    const agency = await prisma.agency.create({
      data: {
        email,
        password: hashedPassword,
        name,
        subdomain
      }
    });
    
    // Generate JWT
    const token = request.server.jwt.sign({
      id: agency.id,
      email: agency.email
    });
    
    return reply.send({
      token,
      agency: {
        id: agency.id,
        email: agency.email,
        name: agency.name,
        subdomain: agency.subdomain
      }
    });
  },
  
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    
    // Find agency
    const agency = await prisma.agency.findUnique({ where: { email } });
    if (!agency) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const valid = await bcrypt.compare(password, agency.password);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = request.server.jwt.sign({
      id: agency.id,
      email: agency.email
    });
    
    return reply.send({
      token,
      agency: {
        id: agency.id,
        email: agency.email,
        name: agency.name,
        subdomain: agency.subdomain
      }
    });
  },
  
  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    
    const agency = await prisma.agency.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, subdomain: true, logo: true }
    });
    
    return reply.send({ agency });
  },
  
  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    // Implementation for refresh token logic
    return reply.send({ message: 'Refresh token endpoint' });
  },
  
  async logout(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Logged out successfully' });
  }
};

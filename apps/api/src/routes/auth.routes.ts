import { FastifyRequest, FastifyReply } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authRoutes(fastify: any) {
  // Register
  fastify.post('/register', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, name } = req.body as any;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return reply.send({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Login
  fastify.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = req.body as any;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({ id: user.id, email: user.email });
      return reply.send({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get Profile
  fastify.get('/profile', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      return reply.send(user);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}

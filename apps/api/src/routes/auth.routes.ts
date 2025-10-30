import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  subdomain: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post(
    '/register',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as unknown;
        const { email, password, name, subdomain } = RegisterSchema.parse(body);

        const existing = await prisma.agency.findUnique({ where: { email } });
        if (existing) {
          return reply.status(400).send({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const agency = await prisma.agency.create({
          data: {
            email,
            password: hashedPassword,
            name,
            subdomain: subdomain?.toLowerCase(),
          },
        });

        const token = fastify.jwt.sign({ agencyId: agency.id, email: agency.email });

        return reply.status(201).send({
          accessToken: token,
          agency: {
            id: agency.id,
            name: agency.name,
            email: agency.email,
            subdomain: agency.subdomain,
          },
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid input' });
        }
        return reply.status(500).send({ error: 'Registration failed' });
      }
    }
  );

  // Login
  fastify.post(
    '/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as unknown;
        const { email, password } = LoginSchema.parse(body);

        const agency = await prisma.agency.findUnique({ where: { email } });
        if (!agency) {
          return reply.status(401).send({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, agency.password);
        if (!isPasswordValid) {
          return reply.status(401).send({ error: 'Invalid credentials' });
        }

        const token = fastify.jwt.sign({ agencyId: agency.id, email: agency.email });

        return reply.send({
          accessToken: token,
          agency: {
            id: agency.id,
            name: agency.name,
            email: agency.email,
            subdomain: agency.subdomain,
          },
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid input' });
        }
        return reply.status(500).send({ error: 'Login failed' });
      }
    }
  );

  // Get current user
  fastify.get(
    '/me',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const agencyId = user.agencyId;

        const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
        if (!agency) {
          return reply.status(404).send({ error: 'Agency not found' });
        }

        return reply.send({
          agency: {
            id: agency.id,
            name: agency.name,
            email: agency.email,
            subdomain: agency.subdomain,
          },
        });
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );
}

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
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
  fastify.post<{ Body: z.infer<typeof RegisterSchema> }>(
    '/register',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email, password, name, subdomain } = RegisterSchema.parse(request.body);

        // Check if agency exists
        const existing = await prisma.agency.findUnique({ where: { email } });
        if (existing) {
          return reply.status(400).send({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create agency
        const agency = await prisma.agency.create({
          data: {
            email,
            password: hashedPassword,
            name,
            subdomain: subdomain?.toLowerCase(),
          },
        });

        // Generate JWT
        const token = fastify.jwt.sign({ agencyId: agency.id, email: agency.email });

        return reply.status(201).send({
          accessToken: token,
          refreshToken: null,
          agency: {
            id: agency.id,
            name: agency.name,
            email: agency.email,
            subdomain: agency.subdomain,
          },
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid input', details: error.errors });
        }
        return reply.status(500).send({ error: 'Registration failed' });
      }
    }
  );

  // Login
  fastify.post<{ Body: z.infer<typeof LoginSchema> }>(
    '/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email, password } = LoginSchema.parse(request.body);

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
          refreshToken: null,
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
  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const { agencyId } = request.user as any;

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
  });

  // Logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}

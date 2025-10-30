import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function socialRoutes(fastify: FastifyInstance) {
  // Get social accounts
  fastify.get(
    '/accounts',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;

        const accounts = await prisma.socialAccount.findMany({
          where: { agencyId },
        });

        return reply.send(accounts);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  // Connect social account (mock)
  fastify.post<{ Body: { provider: string; code: string } }>(
    '/connect',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const { provider, code } = request.body;

        // Mock implementation - in production, exchange code for token
        const account = await prisma.socialAccount.create({
          data: {
            platform: provider,
            username: `${provider}_user_${Date.now()}`,
            accessToken: `mock_token_${Date.now()}`,
            agencyId,
          },
        });

        return reply.status(201).send(account);
      } catch (error: any) {
        return reply.status(500).send({ error: 'Failed to connect account' });
      }
    }
  );

  // Disconnect social account
  fastify.delete<{ Params: { id: string } }>(
    '/accounts/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const { id } = request.params;

        const account = await prisma.socialAccount.findUnique({ where: { id } });
        if (!account || account.agencyId !== agencyId) {
          return reply.status(404).send({ error: 'Account not found' });
        }

        await prisma.socialAccount.delete({ where: { id } });
        return reply.send({ message: 'Account disconnected' });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to disconnect account' });
      }
    }
  );
}

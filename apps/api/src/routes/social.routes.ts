import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function socialRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/accounts',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;

        const accounts = await prisma.socialAccount.findMany({
          where: { agencyId: user.agencyId },
        });

        return reply.send(accounts);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  fastify.post(
    '/connect',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const body = request.body as any;

        const account = await prisma.socialAccount.create({
          data: {
            platform: body.provider || 'twitter',
            username: `${body.provider}_user_${Date.now()}`,
            accessToken: `mock_token_${Date.now()}`,
            agencyId: user.agencyId,
          },
        });

        return reply.status(201).send(account);
      } catch (error: any) {
        return reply.status(500).send({ error: 'Failed to connect account' });
      }
    }
  );

  fastify.delete(
    '/accounts/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const params = request.params as any;

        const account = await prisma.socialAccount.findUnique({
          where: { id: params.id },
        });
        if (!account || account.agencyId !== user.agencyId) {
          return reply.status(404).send({ error: 'Account not found' });
        }

        await prisma.socialAccount.delete({ where: { id: params.id } });
        return reply.send({ message: 'Account disconnected' });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to disconnect account' });
      }
    }
  );
}

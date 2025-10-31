import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function socialRoutes(fastify: any) {
  // Get Connected Accounts
  fastify.get('/accounts', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const accounts = await prisma.socialAccount.findMany({
        where: { userId: req.user.id },
      });

      return reply.send(accounts);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to fetch accounts' });
    }
  });

  // Add Social Account
  fastify.post('/accounts', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { platform, accountId, accountName, accessToken, refreshToken } = req.body as any;

      const account = await prisma.socialAccount.create({
        data: {
          platform,
          accountId,
          accountName,
          accessToken,
          refreshToken,
          userId: req.user.id,
        },
      });

      return reply.send(account);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to add account' });
    }
  });

  // Delete Social Account
  fastify.delete('/accounts/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as any;

      await prisma.socialAccount.deleteMany({
        where: { id, userId: req.user.id },
      });

      return reply.send({ success: true });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to delete account' });
    }
  });
}

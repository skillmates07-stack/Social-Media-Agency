import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  media: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
  platforms: z.array(z.enum(['facebook', 'instagram', 'twitter'])).default(['twitter']),
});

export async function postsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const body = request.body as unknown;
        const data = CreatePostSchema.parse(body);

        const post = await prisma.post.create({
          data: {
            title: data.title,
            content: data.content,
            media: JSON.stringify(data.media || []),
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            platforms: data.platforms,
            agencyId: user.agencyId,
            status: data.scheduledAt ? 'scheduled' : 'draft',
          },
        });

        return reply.status(201).send(post);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid input' });
        }
        return reply.status(500).send({ error: 'Failed to create post' });
      }
    }
  );

  fastify.get(
    '/',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;

        const posts = await prisma.post.findMany({
          where: { agencyId: user.agencyId },
          orderBy: { createdAt: 'desc' },
        });

        return reply.send(posts);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  fastify.get(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const params = request.params as any;

        const post = await prisma.post.findUnique({
          where: { id: params.id },
        });

        if (!post || post.agencyId !== user.agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        return reply.send(post);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  fastify.put(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const params = request.params as any;
        const body = request.body as any;

        const post = await prisma.post.findUnique({ where: { id: params.id } });
        if (!post || post.agencyId !== user.agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        const updated = await prisma.post.update({
          where: { id: params.id },
          data: body,
        });

        return reply.send(updated);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to update post' });
      }
    }
  );

  fastify.delete(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as any;
        const params = request.params as any;

        const post = await prisma.post.findUnique({ where: { id: params.id } });
        if (!post || post.agencyId !== user.agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        await prisma.post.delete({ where: { id: params.id } });
        return reply.send({ message: 'Post deleted' });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to delete post' });
      }
    }
  );
}

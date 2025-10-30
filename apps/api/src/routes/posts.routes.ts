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
  // Create post
  fastify.post<{ Body: z.infer<typeof CreatePostSchema> }>(
    '/',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const data = CreatePostSchema.parse(request.body);

        const post = await prisma.post.create({
          data: {
            title: data.title,
            content: data.content,
            media: JSON.stringify(data.media || []),
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            platforms: data.platforms,
            agencyId,
            status: data.scheduledAt ? 'scheduled' : 'draft',
          },
        });

        return reply.status(201).send(post);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid input', details: error.errors });
        }
        return reply.status(500).send({ error: 'Failed to create post' });
      }
    }
  );

  // Get posts
  fastify.get(
    '/',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;

        const posts = await prisma.post.findMany({
          where: { agencyId },
          orderBy: { createdAt: 'desc' },
        });

        return reply.send(posts);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  // Get single post
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const { id } = request.params;

        const post = await prisma.post.findUnique({
          where: { id },
        });

        if (!post || post.agencyId !== agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        return reply.send(post);
      } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
    }
  );

  // Update post
  fastify.put<{ Params: { id: string }; Body: Partial<z.infer<typeof CreatePostSchema>> }>(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const { id } = request.params;

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post || post.agencyId !== agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        const updated = await prisma.post.update({
          where: { id },
          data: request.body,
        });

        return reply.send(updated);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to update post' });
      }
    }
  );

  // Delete post
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const { agencyId } = request.user as any;
        const { id } = request.params;

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post || post.agencyId !== agencyId) {
          return reply.status(404).send({ error: 'Post not found' });
        }

        await prisma.post.delete({ where: { id } });
        return reply.send({ message: 'Post deleted' });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to delete post' });
      }
    }
  );
}

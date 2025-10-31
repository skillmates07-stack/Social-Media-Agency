import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function postsRoutes(fastify: any) {
  // Create Post
  fastify.post('/posts', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { title, content, platforms, status, imageUrl } = req.body as any;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          platforms,
          status: status || 'draft',
          imageUrl,
          userId: req.user.id,
        },
      });

      return reply.send(post);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to create post' });
    }
  });

  // Get All Posts
  fastify.get('/posts', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const posts = await prisma.post.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send(posts);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to fetch posts' });
    }
  });

  // Get Single Post
  fastify.get('/posts/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as any;

      const post = await prisma.post.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!post) {
        return reply.status(404).send({ error: 'Post not found' });
      }

      return reply.send(post);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to fetch post' });
    }
  });

  // Update Post
  fastify.put('/posts/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as any;
      const { title, content, platforms, status, imageUrl } = req.body as any;

      const post = await prisma.post.updateMany({
        where: { id, userId: req.user.id },
        data: {
          title,
          content,
          platforms,
          status,
          imageUrl,
        },
      });

      return reply.send(post);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to update post' });
    }
  });

  // Delete Post
  fastify.delete('/posts/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as any;

      await prisma.post.deleteMany({
        where: { id, userId: req.user.id },
      });

      return reply.send({ success: true });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to delete post' });
    }
  });
}

import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.code(401).send({ error: 'No token provided' });
    }
    
    const decoded = request.server.jwt.verify(token);
    (request as any).user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}

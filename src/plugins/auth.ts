import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function (fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui'
  });

  // Adiciona o método `authenticate` ao Fastify
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      console.error(error)
      reply.status(401).send({ message: 'Token inválido ou não fornecido' });
    }
  });
});

// Declara o tipo do método `authenticate` para o TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}
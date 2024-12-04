import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function (fastify) {
  const JWT_SECRET = process.env.JWT_SECRET
  if(!JWT_SECRET){
    console.log('A variável ambiente JWT_SECRET obrigatoriamente precisa ser definida');
    return
  }

  fastify.register(jwt, {
    secret: JWT_SECRET
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
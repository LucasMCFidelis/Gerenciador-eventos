import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function (fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui'
  });

  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });
});
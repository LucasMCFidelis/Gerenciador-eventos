import { FastifyInstance } from 'fastify';
import { UserTokenInterfaceProps } from '../../interfaces/UserTokenInterfaceProps.js'

export function generateToken(fastify: FastifyInstance, user: UserTokenInterfaceProps) {
  return fastify.jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role?.roleName
    },
    { expiresIn: '1h' }
  );
}
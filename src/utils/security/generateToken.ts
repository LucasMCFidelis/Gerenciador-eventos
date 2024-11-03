import { FastifyInstance } from 'fastify';
import { Role } from '../../interfaces/roleInterface.js';


interface UserTokenProps {
    userId: string
    email: string
    role: Role
}

export function generateToken(fastify: FastifyInstance, user: UserTokenProps) {
  return fastify.jwt.sign(
    { 
      userId: user.userId,
      email: user.email,
      role: user.role?.roleName
    },
    { expiresIn: '1h' }
  );
}
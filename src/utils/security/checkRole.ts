import { FastifyReply, FastifyRequest } from 'fastify'
import { UserTokenInterfaceProps } from '../../interfaces/UserTokenInterfaceProps.js'

declare module 'fastify' {
    interface FastifyRequest {
        user: UserTokenInterfaceProps
    }
}

export async function checkRole(requiredRole: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {       
        const userRole = request.user.roleName
        
        if (userRole !== requiredRole) {
            reply.status(403).send({ message: `Permissão insuficiente. Requerido: ${requiredRole}, atual: ${userRole}` })
        }
    }
}
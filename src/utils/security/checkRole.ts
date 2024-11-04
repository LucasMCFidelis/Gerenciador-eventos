import { FastifyReply, FastifyRequest } from 'fastify'
import { UserTokenInterfaceProps } from '../../interfaces/UserTokenInterfaceProps.js'

declare module 'fastify' {
    interface FastifyRequest {
        user: UserTokenInterfaceProps
    }
}

export function checkRole(requiredRole: string) {
    return (request: FastifyRequest, reply: FastifyReply) => {       
        const userRole = request.user.roleName

        if (userRole !== requiredRole) {
            reply.status(403).send({ message: `Permissão insuficiente. Requerido: ${requiredRole}, atual: ${userRole}` })
        }
    }
}
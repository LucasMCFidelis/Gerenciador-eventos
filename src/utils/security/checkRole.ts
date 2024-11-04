import { FastifyReply, FastifyRequest } from 'fastify'
import { UserTokenInterfaceProps } from '../../interfaces/UserTokenInterfaceProps.js'

declare module 'fastify' {
    interface FastifyRequest {
        authenticatedUser: UserTokenInterfaceProps
    }
}

export function checkRole(requiredRole: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.authenticatedUser.role.roleName
        if (userRole !== requiredRole) {
            reply.status(403).send({ message: 'Acesso não autorizado' })
        }
    }
}
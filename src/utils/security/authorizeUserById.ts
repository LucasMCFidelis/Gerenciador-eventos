import { FastifyReply, FastifyRequest } from 'fastify'

export function authorizeUserById(targetUserId: string) {
    return (request: FastifyRequest, reply: FastifyReply) => {       
        const { user } = request
        
        // Verifica se o usuário logado é o mesmo que o alvo da operação
        if (!user || targetUserId !== user.userId) {
            return reply.status(403).send({ 
                message: 'Acesso negado. O ID do usuário logado não corresponde ao ID solicitado para a operação.' 
            })
        }
    }
}
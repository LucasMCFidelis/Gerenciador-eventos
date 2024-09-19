import { FastifyReply } from "fastify";

export function handleError(error: unknown, reply: FastifyReply) {
    // Verifica se o erro é uma instância de Error
    if (error instanceof Error) {
        console.error(error.message)
        return reply.status(400).send({
            error: 'Erro de validação',
            message: error.message.toLowerCase()
        })
    } else {
        // Para erros não previstos ou que não sejam do tipo Error
        console.error('Erro desconhecido', error)
        return reply.status(500).send({ message: 'Erro interno ao realizar operação' })
    }
}
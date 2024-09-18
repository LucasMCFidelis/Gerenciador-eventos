import { FastifyReply } from "fastify"

export function handleError(error: Error, reply: FastifyReply) {
    console.error(error.message)

    if (error.message) {
        return reply.status(400).send({
            error: 'Erro de validação',
            message: error.message.toLowerCase()
        })
    } else {
        return reply.status(500).send({ message: 'Erro interno ao realizar operação' })
    }
}
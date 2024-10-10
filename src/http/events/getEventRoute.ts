import { FastifyInstance } from "fastify"
import { getEventById } from "../../utils/db/getEventById.js"
import { handleError } from "../../utils/handlers/handleError.js"

export async function getEventRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/eventos/:id', async (request, reply) => {
        try {
            // Extrai o Id do evento dos parâmetros da rota
            const eventId = request.params.id

            // Buscar o evento no banco de dados utilizando a função utilitária
            const eventResponse = await getEventById(eventId)
            if (!eventResponse.data || eventResponse.error) {
                return reply.status(eventResponse.status).send({ message: eventResponse.message })
            }

            // Responder com os dados do usuário encontrado
            return reply.status(200).send(eventResponse.data)
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
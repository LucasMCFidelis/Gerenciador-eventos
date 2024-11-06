import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkExistingEvent } from "../../utils/validators/checkExistingEvent.js"
import { checkRole } from "../../utils/security/checkRole.js"

export async function deleteEventRoute(fastify: FastifyInstance) {
    fastify.delete<{ 
        Params: { id: string },
        Body: { userId: string} 
    }>('/eventos/:id', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai o Id do evento dos parâmetros da rota e o Id do usuário do corpo da requisição
            const eventId = request.params.id

            // Checa se o evento existe antes de tentar deletar do banco de dados
            const { status: eventStatus, eventExisting, message: eventMessage } = await checkExistingEvent(eventId)
            if (!eventExisting) {
                return reply.status(eventStatus).send({ eventMessage })
            }

            // Deleta o Evento
            await prisma.event.delete({
                where: {
                    eventId
                }
            })

            // Retorna sucesso ao deletar evento
            return reply.status(204).send()
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
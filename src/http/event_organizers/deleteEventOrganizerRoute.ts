import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkRole } from "../../utils/security/checkRole.js"
import { checkExistingEventOrganizer } from "../../utils/validators/checkExistingEventOrganizer.js"

export async function deleteEventOrganizerRoute(fastify: FastifyInstance) {
    fastify.delete<{ 
        Params: { id: string },
    }>('/eventos-organizadores/:id', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai o Id do organizador dos parâmetros da rota
            const organizerId = request.params.id

            // Checa se o organizador de evento existe antes de tentar deletar do banco de dados
            const checkResponse = await checkExistingEventOrganizer(organizerId)
            if (!checkResponse.existingEventOrganizer) {
                return reply.status(checkResponse.status).send({
                    error: checkResponse.error,
                    message: checkResponse.message
                })
            }

            // Deleta o organizador de evento
            await prisma.eventOrganizer.delete({
                where: {
                    organizerId
                }
            })

            // Retorna sucesso ao deletar organizador de evento
            return reply.status(204).send()
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkExistingEvent } from "../../utils/validators/checkExistingEvent.js"
import { EventRequestBody } from "../../interfaces/eventRequestBodyInterface.js"
import { schemaEventUpdate } from "../../schemas/schemaEventUpdate.js"
import { checkRole } from "../../utils/security/checkRole.js"

export async function UpdateEventRoute(fastify: FastifyInstance) {
    fastify.put<{
        Params: { id: string },
        Body: Partial<EventRequestBody>
    }>('/eventos/:id',  {
        onRequest: [fastify.authenticate, checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai o Id do evento dos parâmetros da rota e os dados do corpo da requisição de acordo com EventRequestBody
            const { title, description, linkEvent, address, startDateTime, endDateTime, accessibilityLevel } = request.body
            const eventId = request.params.id    

            const user = request.user

            // Verifica se userId está presente
            if (user.userId) {
                return reply.status(400).send({ message: "userId é obrigatório" })
            }

            // Validar os dados fornecidos no corpo da requisição
            await schemaEventUpdate.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime,
                accessibilityLevel
            })

            // Checa se o evento com id fornecido existe
            const { status: eventStatus, eventExisting, message: eventMessage } = await checkExistingEvent(eventId)
            if (!eventExisting) {
                return reply.status(eventStatus).send({ eventMessage })
            }

            // Atualiza evento no banco de dados
            const updatedEvent = await prisma.event.update({
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(linkEvent && { linkEvent }),
                    ...(address?.street && { street: address.street }),
                    ...(address?.number && { number: address.number }),
                    ...(address?.neighborhood && { neighborhood: address.neighborhood }),
                    ...(address?.complement && { complement: address.complement }),
                    ...(startDateTime && { startDateTime }),
                    ...(endDateTime && { endDateTime }),
                    ...(accessibilityLevel && { accessibilityLevel })
                },
                where: {
                    eventId
                }
            })

            // Retorna sucesso ao atualizar evento
            return reply.status(200).send(updatedEvent)
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
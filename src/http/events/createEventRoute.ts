import { FastifyInstance } from "fastify"
import { schemaEvent } from "../../schemas/schemaEventCadastre.js"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { EventRequestBody } from "../../interfaces/eventRequestBodyInterface.js"
import { checkRole } from "../../utils/security/checkRole.js"
import { schemaId } from "../../schemas/schemaId.js"

export async function createEventRoute(fastify: FastifyInstance) {
    fastify.post<{
        Body: EventRequestBody
    }>('/eventos', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai os dados do corpo da requisição com base na interface EventRequestBody
            const {
                title,
                description,
                linkEvent,
                price,
                address,
                startDateTime,
                endDateTime,
                accessibilityLevel,
                eventOrganizerId,
                eventCategoryId
            } = request.body

            await Promise.all([
                schemaEvent.validateAsync({
                    title,
                    description,
                    linkEvent,
                    price,
                    address,
                    startDateTime,
                    endDateTime,
                    accessibilityLevel
                }),
                schemaId.validateAsync({ id: eventOrganizerId }),
                schemaId.validateAsync({ id: eventCategoryId })
            ]);

            // Criar o evento no banco de dados
            const newEvent = await prisma.event.create({
                data: {
                    title,
                    description,
                    linkEvent,
                    price,
                    addressStreet: address.street,
                    addressNumber: address.number,
                    addressNeighborhood: address.neighborhood,
                    addressComplement: address.complement,
                    startDateTime,
                    endDateTime,
                    accessibilityLevel,
                    eventCategoryId,
                    eventOrganizerId
                }
            })
            // Retornar os dados do evento criado
            return reply.status(200).send(newEvent)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
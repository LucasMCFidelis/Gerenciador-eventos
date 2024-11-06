import { FastifyInstance } from "fastify"
import { schemaEvent } from "../../schemas/schemaEventCadastre.js"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { EventRequestBody } from "../../interfaces/eventRequestBodyInterface.js"
import { checkRole } from "../../utils/security/checkRole.js"

export async function createEventRoute(fastify: FastifyInstance) {
    fastify.post<{
        Body: EventRequestBody
    }>('/eventos', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai os dados do corpo da requisição com base na interface EventRequestBody
            const {
                userId,
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime,
                accessibilityLevel
            } = request.body

            // Validar os dados fornecidos no corpo da requisição
            await schemaEvent.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime,
                accessibilityLevel
            })

            // Criar o evento no banco de dados
            const newEvent = await prisma.event.create({
                data: {
                    title,
                    description,
                    linkEvent,
                    street: address.street,
                    number: address.number,
                    neighborhood: address.neighborhood,
                    complement: address.complement,
                    startDateTime,
                    endDateTime,
                    accessibilityLevel
                }
            })
            // Retornar os dados do evento criado
            return reply.status(200).send(newEvent)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
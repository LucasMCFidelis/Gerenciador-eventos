import { FastifyInstance } from "fastify"
import { schemaEvent } from "../../schemas/schemaEvent.js"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { verifyRole } from "../../utils/security/verifyRole.js"
import { Event } from "../../interfaces/eventInterface.js"
import { AccessibilityLevel } from "@prisma/client"

interface CreateEventRequestBody extends Event {
    userId: string
}

export async function createEventRoute(fastify: FastifyInstance) {
    fastify.post('/eventos', async (request, reply) => {
        try {
            const {
                userId,
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime,
                accessibilityLevel
            } = request.body as CreateEventRequestBody

            // Verificar permissão do usuário antes de validar os dados
            const { status, hasPermission, message } = await verifyRole({
                userId,
                requiredRole: 'Admin'
            })
            if (!hasPermission) {
                return reply.status(status).send({ message })
            }

            // Validar os dados fornecidos no corpo da requisição
            await schemaEvent.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime
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
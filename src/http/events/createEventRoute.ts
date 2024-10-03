import { FastifyInstance } from "fastify"
import { schemaEvent } from "../../schemas/schemaEvent.js"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { verifyRole } from "../../utils/security/verifyRole.js"
import { Event } from "../../interfaces/eventInterface.js"

export async function createEventRoute(fastify: FastifyInstance) {
    fastify.post('/eventos', async (request, reply) => {
        try {
            const { userId, title, description, linkEvent, address, startDateTime, endDateTime } = request.body as Event

            await schemaEvent.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime
            })

            const { status, hasPermission, message } = await verifyRole({ userId, requiredRole: 'Admin' })
            if (!hasPermission) {
                return reply.status(status).send({ message })
            }

            await prisma.event.create({
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
                }
            }).then((event) => {
                return reply.status(200).send(event)
            }).catch((error) => {
                console.error(error)
                return reply.status(500).send({ message: 'Erro ao salvar evento' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
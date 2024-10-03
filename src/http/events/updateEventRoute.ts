import { FastifyInstance } from "fastify"
import { schemaEvent } from "../../schemas/schemaEvent.js"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { verifyRole } from "../../utils/security/verifyRole.js"
import { checkExistingEvent } from "../../utils/validators/checkExistingEvent.js"
import { Event } from "../../interfaces/eventInterface.js"

export async function UpdateEventRoute(fastify: FastifyInstance) {
    fastify.put('/eventos/id/:id', async (request, reply) => {
        try {
            const { userId, title, description, linkEvent, address, startDateTime, endDateTime } = request.body as Event
            const eventId = (request.params as { id: string }).id

            const { status: roleStatus, hasPermission, message: roleMessage } = await verifyRole({
                userId,
                requiredRole: 'Admin'
            })
            if (!hasPermission) {
                return reply.status(roleStatus).send({ roleMessage })
            }

            await schemaEvent.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime
            })

            const { status: eventStatus, eventExisting, message: eventMessage } = await checkExistingEvent(eventId)
            if (!eventExisting) {
                return reply.status(eventStatus).send({ eventMessage })
            }

            await prisma.event.update({
                data: {
                    title,
                    description,
                    linkEvent,
                    street: address.street,
                    number: address.number,
                    neighborhood: address.neighborhood,
                    complement: address.complement,
                    startDateTime,
                    endDateTime
                },
                where: {
                    eventId
                }
            }).then(() => {
                return reply.status(204).send()
            }).catch((error) => {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao atualizar evento' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
import { schemaEvent } from "../schemas/schemaEvent.js"
import { handleError } from "../utils/handlers/handleError.js"
import { FastifyInstance, FastifyReply } from "fastify"
import { prisma } from "../utils/db/prisma.js"
import { verifyRole } from "../utils/security/verifyRole.js"
import { checkExistingEvent } from "../utils/validators/checkExistingEvent.js"
import { getEventById } from "../utils/db/getEventById.js"

interface Event {
    userId: string
    title: string
    description?: string
    linkEvent?: string
    address: {
        street: string
        number: string
        neighborhood: string
        complement?: string
    }
    startDateTime: Date
    endDateTime?: Date
}

export async function eventos(fastify: FastifyInstance) {
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

    fastify.delete('/eventos/id/:id', async (request, reply) => {
        const eventId = (request.params as { id: string }).id
        try {
            const { userId } = request.body as { userId: string }

            const { status: roleStatus, hasPermission, message: roleMessage } = await verifyRole({
                userId,
                requiredRole: 'Admin'
            })
            if (!hasPermission) {
                return reply.status(roleStatus).send({ roleMessage })
            }

            const { status: eventStatus, eventExisting, message: eventMessage } = await checkExistingEvent(eventId)
            if (!eventExisting) {
                return reply.status(eventStatus).send({ eventMessage })
            }

            await prisma.event.delete({
                where: {
                    eventId
                }
            }).then(() => {
                return reply.status(204).send()
            }).catch((error) => {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao excluir evento' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
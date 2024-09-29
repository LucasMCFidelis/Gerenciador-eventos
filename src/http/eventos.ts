import { schemaEvento } from "../schemas/schemaEvento.js"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance, FastifyReply } from "fastify"
import { prisma } from "../utils/prisma.js"
import { verifyRole } from "../utils/verifyRole.js"

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

async function getEventById(eventId: string, reply: FastifyReply) {
    await prisma.event.findUnique({
        where: {
            eventId
        }
    }).then((event) => {
        if (!event) {
            return reply.status(404).send({ message: 'Evento não encontrado' })
        }
        return reply.status(200).send(event)
    }).catch((error) => {
        console.error(error)
        return reply.status(500).send({ message: 'Erro ao consultar o evento' })
    })
}

async function checkExistingEvent(eventId: string, reply: FastifyReply): Promise<boolean> {
    try {
        const event = await prisma.event.findUnique({
            select: {
                eventId: true
            },
            where: {
                eventId
            }
        })

        if (!event) {
            reply.status(404).send({ message: 'Evento não encontrado' })
            return false
        }

        return true
    } catch (error) {
        console.error(error)
        reply.status(500).send({ message: 'Erro ao consultar o evento' })
        return false
    }
}

export async function eventos(fastify: FastifyInstance) {
    fastify.post('/eventos', async (request, reply) => {
        try {
            const { userId, title, description, linkEvent, address, startDateTime, endDateTime } = request.body as Event
            
            await schemaEvento.validateAsync({
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime
            })

            const hasPermission = await verifyRole({ userId, requiredRole: 'Admin' })
            if (!hasPermission) {
                return reply.status(403).send({ message: 'Permissão negada' })
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

    fastify.get('/eventos', async (request, reply) => {
        await prisma.event.findMany({
            orderBy: {
                title: "asc"
            }
        }).then((events) => {
            if (events.length > 0) {
                return reply.status(200).send(events)
            } else {
                return reply.status(404).send({ message: 'Nenhum evento encontrado' })
            }
        }).catch((error) => {
            console.error(error.message)
            return reply.status(500).send({ message: 'Erro na consulta ao banco de dados' })
        })
    })

    fastify.get('/eventos/:id', async (request, reply) => {
        const eventId = (request.params as { id: string }).id
        await getEventById(eventId, reply)
    })

    fastify.put('/eventos/id/:id', async (request, reply) => {
        try {
            const eventId = (request.params as { id: string }).id
            const {
                title,
                description,
                linkEvent,
                address,
                startDateTime,
                endDateTime
            } = await schemaEvento.validateAsync(request.body as Event)

            const eventExisting = await checkExistingEvent(eventId, reply)
            if (!eventExisting) {
                return
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
            const eventExisting = await checkExistingEvent(eventId, reply)
            if (!eventExisting) {
                return
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
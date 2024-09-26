import { db } from "../createDatabase.js"
import { schemaEvento } from "../schemas/schemaEvento.js"
import { randomUUID } from "crypto"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance, FastifyReply } from "fastify"
import { prisma } from "../utils/prisma.js"

interface Event {
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

async function getEventById(eventId: string, reply: FastifyReply){
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

export async function eventos(fastify: FastifyInstance) {
    fastify.post('/eventos', async (request, reply) => {
        try {
            const value = await schemaEvento.validateAsync(request.body)
            const { title, description, linkEvent, address, startDateTime, endDateTime } = value as Event

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

            await prisma.event.findUnique({
                select: {
                    eventId: true
                },
                where: {
                    eventId
                }
            }).then((event) => {
                if (!event) {
                    return reply.status(404).send({ message: 'Evento não encontrado' })
                }
            })

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

    fastify.delete('/eventos/id/:id', (request, reply) => {
        const eventoId = (request.params as { id: string }).id
        try {
            db.get('SELECT id_evento FROM eventos WHERE id_evento = ?', [eventoId], async (error, row) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({ message: 'Erro ao consultar o evento' })
                }

                if (!row) {
                    return reply.status(404).send({ message: 'Evento não encontrado' })
                }

                await db.run('DELETE FROM eventos WHERE id_evento = ?', [eventoId], (error) => {
                    if (error) {
                        console.error(error.message)
                        return reply.status(500).send({ message: 'Erro ao deletar evento' })
                    }
                })

                reply.status(204).send()
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
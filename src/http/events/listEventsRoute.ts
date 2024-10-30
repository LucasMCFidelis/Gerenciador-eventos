import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/db/prisma.js"

export async function listEventRoute(fastify: FastifyInstance) {
    fastify.get('/eventos', async (request, reply) => {
        try {
            const events = await prisma.event.findMany({
                orderBy: {
                    title: "asc"
                }
            })

            if (events.length > 0) {
                // Formatar os eventos antes de enviá-los
                const formattedEvents = events.map(event => ({
                    eventId: event.eventId,
                    title: event.title,
                    description: event.description || null,
                    linkEvent: event.linkEvent || null,
                    address: {
                        street: event.street,
                        number: event.number,
                        neighborhood: event.neighborhood,
                        complement: event.complement || null
                    },
                    accessibilityLevel: event.accessibilityLevel,
                    startDateTime: event.startDateTime.toISOString(), 
                    endDateTime: event.endDateTime ? event.endDateTime.toISOString() : null, 
                    createdAt: event.createdAt.toISOString() 
                }))

                return reply.status(200).send(formattedEvents)
            } else {
                return reply.status(404).send({ message: 'Nenhum evento encontrado' })
            }
        } catch (error) {
            console.error(error)
            return reply.status(500).send({ message: 'Erro na consulta ao banco de dados' })
        }
    })
}
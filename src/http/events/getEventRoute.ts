import { FastifyInstance } from "fastify"
import { getEventById } from "../../utils/db/getEventById.js"

export async function createEventRoute(fastify: FastifyInstance) {
    fastify.get('/eventos/:id', async (request, reply) => {
        const eventId = (request.params as { id: string }).id
        await getEventById(eventId, reply)
    })
}
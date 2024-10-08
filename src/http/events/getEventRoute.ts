import { FastifyInstance } from "fastify"
import { getEventById } from "../../utils/db/getEventById.js"

export async function getEventRoute(fastify: FastifyInstance) {
    fastify.get('/eventos/:id', async (request, reply) => {
        const eventId = (request.params as { id: string }).id

        const eventResponse = await getEventById(eventId)
        if (!eventResponse.data || eventResponse.error){
            return reply.status(eventResponse.status).send({message: eventResponse.message})
        }

        return reply.status(200).send(eventResponse.data)
    })
}
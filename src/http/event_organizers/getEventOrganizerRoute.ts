import { FastifyInstance } from "fastify"
import { handleError } from "../../utils/handlers/handleError.js"
import { getEventOrganizer } from "../../utils/db/getEventOrganizer.js"

export async function getEventOrganizerRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/eventos-organizadores/:id', async (request, reply) => {
        try {
            const organizerId = request.params.id

            const checkResponse = await getEventOrganizer(organizerId)
            if (!checkResponse.data) {
                return reply.status(checkResponse.status).send({ 
                    error: checkResponse.error,
                    message: checkResponse.message 
                })
            }

            return reply.status(200).send(checkResponse.data)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
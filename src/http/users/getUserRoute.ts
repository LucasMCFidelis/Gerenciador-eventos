import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get('/usuarios/id/:id', async (request, reply) => {
        try {
            const { id: userId } = request.params as { id: string }
            if (!userId) {
                return reply.status(400).send({ message: 'ID deve ser fornecido' })
            }

            const {
                status: getStatus, 
                data: user, 
                message: getMessage, 
                error: getError
            } = await getUserById(userId)
            if (!user || getError) {
                return reply.status(getStatus).send({ message: getMessage })
            }

            return reply.status(200).send(user)
        } catch (error: unknown) {
            return handleError(error, reply)
        }
    })
}
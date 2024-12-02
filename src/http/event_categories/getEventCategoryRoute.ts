import { FastifyInstance } from "fastify"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkExistingEventCategory } from "../../utils/validators/checkExistingEventCategory.js"
import { getEventCategory } from "../../utils/db/getEventCategory.js"

export async function getEventCategoryRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/eventos-categorias/:id', async (request, reply) => {
        try {
            const categoryId = request.params.id

            const checkResponse = await checkExistingEventCategory(categoryId)
            if (!checkResponse.categoryExisting) {
                return reply.status(checkResponse.status).send({
                    error: checkResponse.error,
                    message: checkResponse.message
                })
            }

            const categoryEventResponse = await getEventCategory(categoryId)
            if (!categoryEventResponse.data || categoryEventResponse.error) {
                return reply.status(categoryEventResponse.status).send({ 
                    error: categoryEventResponse.error,
                    message: categoryEventResponse.message 
                })
            }

            return reply.status(200).send(categoryEventResponse.data)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
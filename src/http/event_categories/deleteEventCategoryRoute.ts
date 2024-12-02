import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkRole } from "../../utils/security/checkRole.js"
import { checkExistingEventCategory } from "../../utils/validators/checkExistingEventCategory.js"

export async function deleteEventCategoryRoute(fastify: FastifyInstance) {
    fastify.delete<{ 
        Params: { id: string },
    }>('/eventos-categorias/:id', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            const categoryId = request.params.id

            const checkResponse = await checkExistingEventCategory(categoryId)
            if (!checkResponse.categoryExisting) {
                return reply.status(checkResponse.status).send({
                    error: checkResponse.error,
                    message: checkResponse.message
                })
            }

            await prisma.eventCategory.delete({
                where: {
                    categoryId
                }
            })

            return reply.status(204).send()
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
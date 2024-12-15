import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkRole } from "../../utils/security/checkRole.js"
import { ErrorResponse } from "../../types/errorResponseType.js"
import { EventCategory } from "@prisma/client"
import { schemaEventCategoryUpdate } from "../../schemas/schemaEventCategoryUpdate.js"
import { checkExistingEventCategory } from "../../utils/validators/checkExistingEventCategory.js"

export async function UpdateEventCategoryRoute(fastify: FastifyInstance) {
    fastify.put<{
        Params: { id: string },
        Body: Partial<EventCategory>
    }>('/eventos-categorias/:id',  {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            const { categoryName, categoryDescription } = request.body
            const categoryId = request.params.id    
            
            const user = request.user

            if (!user.userId) {
                const errorValue: ErrorResponse = "Erro de validação"
                return reply.status(400).send({ 
                    error: errorValue,
                    message: "userId é obrigatório" 
                })
            }

            await schemaEventCategoryUpdate.validateAsync({ 
                categoryName,
                categoryDescription
            })

            const checkResponse = await checkExistingEventCategory(categoryId)
            if (!checkResponse.categoryExisting) {
                return reply.status(checkResponse.status).send({
                    error: checkResponse.error,
                    message: checkResponse.message
                })
            }

            const updatedEventCategory = await prisma.eventCategory.update({
                data: {
                    ...(categoryName && { categoryName }),
                    ...(categoryDescription && { categoryDescription }),
                },
                where: {
                    categoryId
                }
            })

            return reply.status(200).send(updatedEventCategory)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
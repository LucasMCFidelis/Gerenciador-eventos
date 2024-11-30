import { FastifyInstance } from "fastify";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { checkRole } from "../../utils/security/checkRole.js";
import { CadastreEventCategory } from "../../interfaces/cadastreEventCategory.js";
import { schemaEventCategory } from "../../schemas/schemaEventCategoryCadastre.js";

export async function createEventCategoryRoute(fastify:FastifyInstance) {
    fastify.post<{
        Body: CadastreEventCategory
    }>('/eventos-categorias', {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            const {categoryName, categoryDescription} = request.body

            await schemaEventCategory.validateAsync({
                categoryName, categoryDescription
            })

            const newEventCategory = await prisma.eventCategory.create({
                data: {
                    categoryName, categoryDescription
                }
            })

            return reply.status(201).send(newEventCategory)
            
        } catch (error) {
            handleError(error, reply)
        }
    })
}
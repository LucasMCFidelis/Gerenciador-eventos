import { FastifyInstance } from "fastify";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { ErrorResponse } from "../../types/errorResponseType.js";

export async function listEventCategoriesRoute(fastify:FastifyInstance) {
    fastify.get('/eventos-categorias' , async (request, reply) => {
        try {
            const eventCategories = await prisma.eventCategory.findMany({
                orderBy: {
                    categoryName: "asc"
                }
            })

            if (eventCategories.length > 0){
                return reply.status(200).send(eventCategories)
            } else {
                const errorValue: ErrorResponse = "Erro Not Found"
                return reply.status(404).send({
                    error: errorValue,
                    message: "Nenhuma categoria de eventos encontrada"
                })
            }
        } catch (error) {
            handleError(error, reply)
        }
    })
}
import { FastifyInstance } from "fastify";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { ErrorResponse } from "../../types/errorResponseType.js";

export async function listEventOrganizersRoute(fastify:FastifyInstance) {
    fastify.get('/eventos-organizadores' , async (request, reply) => {
        try {
            const eventOrganizers = await prisma.eventOrganizer.findMany({
                orderBy: {
                    organizerName: "asc"
                }
            })

            if (eventOrganizers.length > 0){
                return reply.status(200).send(eventOrganizers)
            } else {
                const errorValue: ErrorResponse = "Erro Not Found"
                return reply.status(404).send({
                    error: errorValue,
                    message: "Nenhum organizador de eventos encontrado "
                })
            }
        } catch (error) {
            handleError(error, reply)
        }
    })
}
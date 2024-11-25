import { FastifyInstance } from "fastify";
import { handleError } from "../../utils/handlers/handleError.js";
import { schemaEventOrganizer } from "../../schemas/schemaEventOrganizerCadastre.js";
import { CadastreEventOrganizer } from "../../interfaces/cadastreEventOrganizer.js";
import { checkExistingEventOrganizer } from "../../utils/validators/checkExistingEventOrganizer.js";
import { prisma } from "../../utils/db/prisma.js";

export async function createEventOrganizerRoute(fastify:FastifyInstance) {
    fastify.post<{
        Body: CadastreEventOrganizer
    }>('/eventos-organizadores' , async (request, reply) => {
        try {
            const {organizerName, organizerCnpj, organizerEmail, organizerPhoneNumber} = request.body

            await schemaEventOrganizer.validateAsync({
                organizerName, 
                organizerCnpj, 
                organizerEmail, 
                organizerPhoneNumber
            })

            const organizerEmailCheckResponse = await checkExistingEventOrganizer(organizerEmail)
            if (organizerEmailCheckResponse.error) {
                return reply.status(organizerEmailCheckResponse.status).send({
                    error: organizerEmailCheckResponse.error,
                    message: organizerEmailCheckResponse.message
                })
            }

            const newEventOrganizer = await prisma.eventOrganizer.create({
                data: {
                    organizerName,
                    organizerCnpj,
                    organizerEmail: organizerEmail.toLowerCase(),
                    organizerPhoneNumber
                }
            })

            return reply.status(201).send(newEventOrganizer)
            
        } catch (error) {
            handleError(error, reply)
        }
    })
}
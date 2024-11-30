import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { checkExistingEvent } from "../../utils/validators/checkExistingEvent.js"
import { EventRequestBody } from "../../interfaces/eventRequestBodyInterface.js"
import { schemaEventUpdate } from "../../schemas/schemaEventUpdate.js"
import { checkRole } from "../../utils/security/checkRole.js"
import { ErrorResponse } from "../../types/errorResponseType.js"
import { CadastreEventOrganizer } from "../../interfaces/cadastreEventOrganizer.js"
import { schemaEventOrganizer } from "../../schemas/schemaEventOrganizerCadastre.js"
import { checkExistingEventOrganizer } from "../../utils/validators/checkExistingEventOrganizer.js"

export async function UpdateEventOrganizerRoute(fastify: FastifyInstance) {
    fastify.put<{
        Params: { id: string },
        Body: Partial<CadastreEventOrganizer>
    }>('/eventos-organizadores/:id',  {
        onRequest: [fastify.authenticate, await checkRole('Admin')]
    }, async (request, reply) => {
        try {
            // Extrai o Id do organizador de eventos dos parâmetros da rota e os dados do corpo da requisição
            const { organizerName, organizerCnpj, organizerEmail, organizerPhoneNumber } = request.body
            const organizerId = request.params.id    
            
            const user = request.user

            // Verifica se userId está presente
            if (!user.userId) {
                const errorValue: ErrorResponse = "Erro de validação"
                return reply.status(400).send({ 
                    error: errorValue,
                    message: "userId é obrigatório" 
                })
            }

            // Validar os dados fornecidos no corpo da requisição
            await schemaEventOrganizer.validateAsync({ 
                organizerName, 
                organizerCnpj, 
                organizerEmail, 
                organizerPhoneNumber 
            })

            // Checa se o organizador com id fornecido existe
            const checkResponse = await checkExistingEventOrganizer(organizerId)
            if (!checkResponse.existingEventOrganizer) {
                return reply.status(checkResponse.status).send({
                    error: checkResponse.error,
                    message: checkResponse.message
                })
            }

            // Atualiza organizador de eventos no banco de dados
            const updatedEventOrganizer = await prisma.eventOrganizer.update({
                data: {
                    ...(organizerName && { organizerName }),
                    ...(organizerCnpj && { organizerCnpj }),
                    ...(organizerEmail && { organizerEmail }),
                    ...(organizerPhoneNumber && { organizerPhoneNumber }),
                },
                where: {
                    organizerId
                }
            })

            // Retorna sucesso ao atualizar evento
            return reply.status(200).send(updatedEventOrganizer)
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
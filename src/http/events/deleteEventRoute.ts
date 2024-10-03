import { FastifyInstance } from "fastify"
import { prisma } from "../../utils/db/prisma.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { verifyRole } from "../../utils/security/verifyRole.js"
import { checkExistingEvent } from "../../utils/validators/checkExistingEvent.js"

export async function deleteEventRoute(fastify: FastifyInstance) {
    fastify.delete('/eventos/id/:id', async (request, reply) => {
        const eventId = (request.params as { id: string }).id
        try {
            const { userId } = request.body as { userId: string }

            const { status: roleStatus, hasPermission, message: roleMessage } = await verifyRole({
                userId,
                requiredRole: 'Admin'
            })
            if (!hasPermission) {
                return reply.status(roleStatus).send({ roleMessage })
            }

            const { status: eventStatus, eventExisting, message: eventMessage } = await checkExistingEvent(eventId)
            if (!eventExisting) {
                return reply.status(eventStatus).send({ eventMessage })
            }

            await prisma.event.delete({
                where: {
                    eventId
                }
            }).then(() => {
                return reply.status(204).send()
            }).catch((error) => {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao excluir evento' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
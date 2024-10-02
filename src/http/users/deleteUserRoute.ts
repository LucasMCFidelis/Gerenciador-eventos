import { FastifyInstance } from "fastify";
import { getUserById } from "../../utils/getUserById.js";
import { handleError } from "../../utils/handleError.js";
import { prisma } from "../../utils/prisma.js";

export async function deleteUserRoute(fastify:FastifyInstance) {
    fastify.delete('/usuarios/id/:id', async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id
            const user = await getUserById(userId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            await prisma.user.delete({
                where: {
                    userId
                }
            }).then(() => {
                reply.status(204).send()
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
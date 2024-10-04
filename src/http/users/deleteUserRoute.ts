import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { prisma } from "../../utils/db/prisma.js"

export async function deleteUserRoute(fastify: FastifyInstance) {
    fastify.delete('/usuarios/id/:id', async (request, reply) => {
        try {
            // 1. Verifica se o parâmetro id foi fornecido
            const userId = (request.params as { id: string }).id
            if (!userId) {
                return reply.status(400).send({ message: 'ID deve ser fornecido' })
            }

            // 2. Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            // 3. Deletar usuário 
            await prisma.user.delete({
                where: {
                    userId
                }
            })

            // 4. Sucesso ao deletar usuário
            return reply.status(204).send()
        } catch (error) {
            // 5. Tratamento de erros genéricos
            return handleError(error, reply)
        }
    })
}
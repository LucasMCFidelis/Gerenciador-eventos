import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get('/usuarios/id/:id', async (request, reply) => {
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

            // 3. Responde com sucesso, devolvendo o usuário encontrado
            return reply.status(200).send(userResponse.data)
        } catch (error: unknown) {
            // 4. Tratamento de erros genéricos
            return handleError(error, reply)
        }
    })
}
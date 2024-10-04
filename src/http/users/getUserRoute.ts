import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/usuarios/id/:id', async (request, reply) => {
        try {
            // 1. Extrair o parâmetro ID
            const userId = request.params.id;

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
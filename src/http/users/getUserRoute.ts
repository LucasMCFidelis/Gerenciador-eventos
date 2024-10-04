import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { schemaUserId } from "../../schemas/schemaUserId.js"

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/usuarios/id/:id', async (request, reply) => {
        try {
            // 1. Extrair o parâmetro ID
            const userId = request.params.id;

            // 2. Validar o ID utilizando o schemaUserId
            const { error } = schemaUserId.validate({ id: userId });
            if (error) {
                // Se o ID for inválido, retornar a mensagem de erro personalizada
                return reply.status(400).send({ message: error.message });
            }

            // 3. Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            // 4. Responde com sucesso, devolvendo o usuário encontrado
            return reply.status(200).send(userResponse.data)
        } catch (error: unknown) {
            // 5. Tratamento de erros genéricos
            return handleError(error, reply)
        }
    })
}
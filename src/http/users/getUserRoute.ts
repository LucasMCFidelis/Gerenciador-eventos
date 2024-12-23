import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/usuarios/:id', async (request, reply) => {
        try {
            // Extrair o ID do usuário a partir dos parâmetros da rota
            const userId = request.params.id;

            // Buscar o usuário no banco de dados utilizando a função utilitária
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ 
                    error: userResponse.error,
                    message: userResponse.message 
                })
            }

            // Responder com os dados do usuário encontrado
            return reply.status(200).send(userResponse.data)
        } catch (error: unknown) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
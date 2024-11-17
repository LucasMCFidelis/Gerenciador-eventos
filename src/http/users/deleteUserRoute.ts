import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { prisma } from "../../utils/db/prisma.js"
import { authorizeUserById } from "../../utils/security/authorizeUserById.js"

export async function deleteUserRoute(fastify: FastifyInstance) {
    fastify.delete<{ Params: { id: string } }>('/usuarios/:id', {
        onRequest: [
            fastify.authenticate, 
            async (request, reply) => await authorizeUserById(request.params.id)(request, reply)
        ]
    }, async (request, reply) => {
        try {
            // Extrair o ID do usuário a partir dos parâmetros da rota
            const userId = request.params.id

            // Buscar o usuário no banco de dados utilizando a função utilitária
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ 
                    error: userResponse.error,
                    message: userResponse.message 
                })
            }

            // Deletar usuário 
            await prisma.user.delete({
                where: {
                    userId
                }
            })

            // Retornar sucesso ao deletar usuário
            return reply.status(204).send({ message: 'Usuário excluído com sucesso' })
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
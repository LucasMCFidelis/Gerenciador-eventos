import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"
import { prisma } from "../../utils/db/prisma.js"

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deletar um usuário
 *     description: Deleta um usuário específico pelo ID.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser deletado
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário excluído com sucesso
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function deleteUserRoute(fastify: FastifyInstance) {
    fastify.delete<{ Params: { id: string } }>('/usuarios/:id', async (request, reply) => {
        try {
            // Extrair o ID do usuário a partir dos parâmetros da rota
            const userId = request.params.id

            // Buscar o usuário no banco de dados utilizando a função utilitária
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
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
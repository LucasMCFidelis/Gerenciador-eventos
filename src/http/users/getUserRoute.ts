import { FastifyInstance } from "fastify"
import { getUserById } from "../../utils/db/getUserById.js"
import { handleError } from "../../utils/handlers/handleError.js"

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obter informações de um usuário
 *     description: Retorna os dados de um usuário específico pelo ID.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser buscado
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *               example:
 *                 id: "123"
 *                 firstName: "Lucas"
 *                 lastName: "Fidelis"
 *                 email: "lucas.fidelis@example.com"
 *                 phoneNumber: "Lucas Fidelis"   
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuário não encontrado."
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao processar a solicitação."
 */

export async function getUserRoute(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: string } }>('/usuarios/:id', async (request, reply) => {
        try {
            // Extrair o ID do usuário a partir dos parâmetros da rota
            const userId = request.params.id;

            // Buscar o usuário no banco de dados utilizando a função utilitária
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            // Responder com os dados do usuário encontrado
            return reply.status(200).send(userResponse.data)
        } catch (error: unknown) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
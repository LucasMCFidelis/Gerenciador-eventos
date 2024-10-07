import { FastifyInstance } from "fastify";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { getUserByEmail } from "../../utils/db/getUserByEmail.js";
import { updateUserPassword } from "../../utils/db/updateUserPassword.js";

export async function updateUserPasswordRoute(fastify: FastifyInstance) {
    // ADICIONAR VALIDAÇÃO POR CÓDIGO EM EMAIL OU ALGUMA OUTRA OPÇÃO
    fastify.patch('/usuarios/recuperacao/esqueci-senha', async (request, reply) => {
        try {
            // Extrair email e senha fornecida do corpo da requisição
            const { email, newPassword } = request.body as { email: string, newPassword: string }

            // Buscar o usuário no banco de dados utilizando a função utilitária
            const userResponse = await getUserByEmail(email)
            const user = userResponse.data
            if (!user || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            // Validar a nova senha com o schemaUserPassword para que a senha seja segura
            await schemaUserPassword.validateAsync({ password: newPassword })

            // Atualizar a senha do usuário no banco de dados utilizando a função utilitária
            const updateResponse = await updateUserPassword(user.userId, newPassword)
            if (updateResponse.error) {
                return reply.status(updateResponse.status).send({ message: updateResponse.message })
            }

             // Retornar sucesso ap atualizar senha
            return reply.status(200).send({ message: 'Senha atualizada com sucesso' })
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })
}
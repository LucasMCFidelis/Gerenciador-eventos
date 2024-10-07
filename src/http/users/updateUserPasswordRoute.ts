import { FastifyInstance } from "fastify";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { getUserByEmail } from "../../utils/db/getUserByEmail.js";
import { updateUserPassword } from "../../utils/db/updateUserPassword.js";

export async function updateUserPasswordRoute(fastify:FastifyInstance) {
    // ADICIONAR VALIDAÇÃO POR CÓDIGO EM EMAIL OU ALGUMA OUTRA OPÇÃO
    fastify.patch('/usuarios/recuperacao/esqueci-senha', async (request, reply) => {
        try {
            const { email, novaSenha } = request.body as { email: string, novaSenha: string }
            const userResponse = await getUserByEmail(email)
            const user = userResponse.data

            if (!user || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            await schemaUserPassword.validateAsync({ password: novaSenha })
            const updateResponse =await updateUserPassword(user.userId, novaSenha)
            if (updateResponse.error) {
                return reply.status(updateResponse.status).send({message: updateResponse.message})
            }

            return reply.status(200).send({message: 'Senha atualizada com sucesso'})
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
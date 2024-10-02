import { FastifyInstance } from "fastify";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { handleError } from "../../utils/handleError.js";
import { getUserByEmail } from "../../utils/getUserByEmail.js";
import { updateUserPassword } from "../../utils/updateUserPassword.js";

export async function updateUserPasswordRoute(fastify:FastifyInstance) {
    // ADICIONAR VALIDAÇÃO POR CÓDIGO EM EMAIL OU ALGUMA OUTRA OPÇÃO
    fastify.patch('/usuarios/recuperacao/esqueci-senha', async (request, reply) => {
        try {
            const { email, novaSenha } = request.body as { email: string, novaSenha: string }
            const user = await getUserByEmail(email)

            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            await schemaUserPassword.validateAsync({ novaSenha })
            await updateUserPassword(user.userId, novaSenha, reply)
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
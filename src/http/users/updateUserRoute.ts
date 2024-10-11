import { FastifyInstance } from "fastify";
import { checkExistingUser } from "../../utils/validators/checkExistingUser.js";
import { getUserById } from "../../utils/db/getUserById.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { schemaUserUpdate } from "../../schemas/schemaUserUpdate.js";
import { CadastreUser } from "../../interfaces/cadastreUserInterface.js";

export async function updateUserRoute(fastify:FastifyInstance) {
    fastify.put<{
        Params: {id: string},
        Body: Partial<CadastreUser>
    }>('/usuarios/:id', async (request, reply) => {
        try {
            const userId = request.params.id

            // 1. Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }
            const user = userResponse.data

            // 2. Valida o corpo da requisição com schemaCadastre
            const userData = await schemaUserUpdate.validateAsync(request.body)
            const { firstName, lastName, email, phoneNumber } = userData
            
            // 3. Checa se o email já existe, exceto para o email atual do usuário
            if (email !== user.email){
                const emailCheckResponse = await checkExistingUser(email)
                if (emailCheckResponse.existingUser || emailCheckResponse.error) {
                    return reply.status(emailCheckResponse.status).send({ message: emailCheckResponse.message })
                }
            }

            // 4. Atualiza o usuário no banco de dados
            await prisma.user.update({
                where: {
                    userId: user.userId
                },
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber
                }
            })

            // 5. Responde com sucesso
            return reply.status(200).send({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            // 6. Tratamento de erros genéricos
            return handleError(error, reply)
        }
    })
}
import { FastifyInstance } from "fastify";
import { checkExistingUser } from "../../utils/validators/checkExistingUser.js";
import { schemaCadastre } from "../../schemas/schemaCadastre.js";
import { getUserById } from "../../utils/db/getUserById.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";

export async function updateUserRoute(fastify:FastifyInstance) {
    fastify.put('/usuarios/id/:id', async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id
            const {
                status: getStatus, 
                data: user, 
                message: getMessage, 
                error: getError
            } = await getUserById(userId)
            if (!user || getError) {
                return reply.status(getStatus).send({ message: getMessage })
            }

            const userDataValidate = await schemaCadastre.validateAsync(request.body)
            const { firstName, lastName, email, phoneNumber } = userDataValidate
            
            const { 
                status: existingUserStatus, 
                existingUser, 
                message: existingUserMessage, 
                error: existingUserError
            } = await checkExistingUser(email)
            if (existingUser || existingUserError) {
                return reply.status(existingUserStatus).send({ message: existingUserMessage })
            }

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
            }).then(() => {
                return reply.status(200).send({ message: 'Usuário atualizado com sucesso' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })
}
import { FastifyReply } from "fastify"
import { hashPassword } from "./hashPassword.js"
import { prisma } from "./prisma.js"

export async function updateUserPassword(userId: string, newPassword: string, reply: FastifyReply) {
    const newPasswordHash = await hashPassword(newPassword)
    await prisma.user.update({
        where: {
            userId
        },
        data: {
            password: newPasswordHash
        }
    }).then(() => {
        return reply.status(200).send({ message: 'Senha atualizada com sucesso' })
    }).catch((error) => {
        console.error(error)
        return reply.status(500).send({ message: 'Erro ao atualizar senha' })
    })
}
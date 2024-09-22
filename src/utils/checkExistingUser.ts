import { FastifyReply } from "fastify"
import { prisma } from "../utils/prisma.js"

export async function checkExistingUser(userEmail: string, reply: FastifyReply): Promise<FastifyReply | null>{
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
        select: {
            email: true
        }
    })
    console.log(existingUser)
    
    if (existingUser) {
        return reply.status(400).send({ message: 'Este email já está cadastrado' })
    }
    return null
}

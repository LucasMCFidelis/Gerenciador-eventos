import { prisma } from "./prisma.js"

interface UserAutentication {
    userId: string
    email: string
    password: string
}

export async function getUserByEmail(userEmail: string): Promise<UserAutentication | null> {
    if (!userEmail) {
        console.error('Invalid userEmail')
    }

    try {
        return await prisma.user.findUnique({
            where: {
                email: userEmail
            },
            select: {
                userId: true,
                email: true,
                password: true
            }
        })
    } catch (error) {
        console.error("Erro ao buscar usuário", error)
        return null
    }
}
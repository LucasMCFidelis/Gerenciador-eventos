import { prisma } from "./prisma.js"

interface Usuario {
    userId: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    role: { 
        roleId: number; 
        roleName: string; 
        roleDescription: string | null; 
    } | null
}

export async function getUserById(userId: string): Promise<Usuario | null> {
    if (!userId) {
        console.error("Invalid userId")
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                userId
            },
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true
            }
        })
        return user
    } catch (error) {
        console.error("Erro ao buscar usuário", error)
        return null
    }
}
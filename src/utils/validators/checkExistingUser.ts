import { prisma } from "../db/prisma.js"

interface checkExistingUserResponse {
    status: number
    existingUser: boolean
    message?: string
    error?: boolean
}

export async function checkExistingUser(userEmail: string): Promise<checkExistingUserResponse> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { email: true }
        })

        return {
            status: existingUser ? 409 : 200,
            existingUser: !!existingUser,
            message: existingUser ? 'Este email já está cadastrado' : undefined,
            error: false
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            existingUser: false,
            message: 'Erro ao verificar existência do usuário.',
            error: true
        }
    }
}
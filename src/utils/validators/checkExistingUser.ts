import { prisma } from "../db/prisma.js"

interface CheckExistingUserResponse {
    status: number
    existingUser: boolean
    message?: string
    error?: boolean
}

export async function checkExistingUser(userEmail: string): Promise<CheckExistingUserResponse> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { email: true }
        })

        if (existingUser) {
            return {
                status: 409,
                existingUser: true,
                message: 'Este e-mail já está cadastrado.',
                error: true
            }
        }

        return {
            status: 200,
            existingUser: false,
            message: 'E-mail disponível para cadastro.',
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
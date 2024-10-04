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

interface GetUserResponse {
    status: number
    data?: Usuario | null
    message?: string
    error?: boolean
}

export async function getUserById(userId: string): Promise<GetUserResponse> {
    if (!userId.trim()) {
        return {
            status: 400,
            message: "Invalid userId",
            error: true
        }
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
        if (!user) {
            return {
                status: 404,
                message: "Usuário não encontrado",
                error: true
            }
        }
        return {
            status: 200,
            data: user
        }
    } catch (error) {
        console.error("Erro ao buscar usuário", error)
        return {
            status: 500,
            message: "Erro interno ao buscar usuário",
            error: true
        }
    }
}
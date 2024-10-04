import { schemaUserId } from "../../schemas/schemaUserId.js"
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
    // 2. Validar o ID utilizando o schemaUserId
    const { error } = schemaUserId.validate({ id: userId });
    if (error) {
        // Se o ID for inválido, retornar a mensagem de erro personalizada
        return {
            status: 400,
            message: error.message ,
            error: true
        }
    }

    try {
        // 2. Buscar o usuário no banco de dados
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

        // 3. Verificar se o usuário foi encontrado
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
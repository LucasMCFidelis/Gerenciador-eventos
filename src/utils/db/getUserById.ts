import { schemaId } from "../../schemas/schemaId.js"
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
    // Validar o ID utilizando o schemaId
    const { error } = schemaId.validate({ id: userId });
    if (error) {
        // Retornar mensagem de erro caso a validação falhe
        return {
            status: 400,
            message: error.message ,
            error: true
        }
    }

    try {
        // Buscar o usuário no banco de dados com os campos necessários
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

        // Retornar mensagem de erro caso o usuário não seja encontrado
        if (!user) {
            return {
                status: 404,
                message: "Usuário não encontrado",
                error: true
            }
        }

        // Retornar o usuário encontrado
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
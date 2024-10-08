import { prisma } from "./prisma.js"

interface UserAutentication {
    userId: string
    email: string
    password: string
}

interface GetUserResponse {
    status: number
    data?: UserAutentication | null
    message?: string
    error?: boolean
}

export async function getUserByEmail(userEmail: string): Promise<GetUserResponse> {
    // Validação inicial de entrada
    if (!userEmail || typeof userEmail !== "string") {
        return {
            status: 400,
            message: "Email inválido",
            error: true,
            data: null
        };
    }

    try {
        // Buscar usuário no banco de dados com base no email fornecido
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail
            },
            select: {
                userId: true,
                email: true,
                password: true
            }
        })

        // Retorno caso o usuário não seja encontrado
        if (!user){
            return {
                status: 404,
                message: "Nenhum usuário encontrado com este email",
                error: true,
                data: null
            }
        }

        // Retorno bem-sucedido com os dados do usuário
        return {
            status: 200,
            data: user,
            message: "Usuário encontrado com sucesso",
            error: false
        }
    } catch (error) {
        console.error("Erro ao buscar usuário", error)
        return {
            status: 500,
            message: "Erro interno ao buscar usuário",
            error: true,
            data: null
        }
    }
}
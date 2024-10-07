import { hashPassword } from "../security/hashPassword.js"
import { prisma } from "./prisma.js"

interface UpdatePasswordResponse {
    status: number
    message?: string
    error?: boolean
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<UpdatePasswordResponse> {
    try {
        // Gerar o hash da nova senha fornecida
        const newPasswordHash = await hashPassword(newPassword)

        // Atualizar o usuário com a nova senha
        await prisma.user.update({
            where: {
                userId
            },
            data: {
                password: newPasswordHash
            }
        })

        // Retornar sucesso
        return {
            status: 200,
            message: 'Senha atualizada com sucesso',
            error: false
        }
    } catch (error: any) {
        console.error(error)

        // Tratamento de erro específico do Prisma
        if (error.code === 'P2025') {  // Exemplo de um erro Prisma quando o recurso não é encontrado
            return {
                status: 404,
                message: 'Usuário não encontrado para atualização',
                error: true
            }
        }

        // Retorno genérico para erros inesperados
        return {
            status: 500,
            message: 'Erro ao atualizar senha',
            error: true
        }
    }
}
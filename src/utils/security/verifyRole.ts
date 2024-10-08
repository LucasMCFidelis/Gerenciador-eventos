import { getUserById } from "../db/getUserById.js"

interface verifyRoleResponse {
    status: number
    hasPermission: boolean
    message?: string
}

interface verifyRoleProps {
    userId: string
    requiredRole: string
}

export async function verifyRole({ userId, requiredRole }: verifyRoleProps): Promise<verifyRoleResponse> {
    try {
        const { status, data: user, message, error} = await getUserById(userId)

        if (!user || error) {
            return {
                status,
                hasPermission: false,
                message
            }
        }

        if (user.role?.roleName !== requiredRole) {
            return {
                status: 403,
                hasPermission: false,
                message: `Permissão insuficiente. Requerido: ${requiredRole}, atual: ${user.role?.roleName}`
            }
        }

        return { status: 200, hasPermission: true }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Erro ao verificar o papel do usuário: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao verificar o papel do usuário');
        }
        return { 
            status: 500, 
            hasPermission: false, 
            message: 'Erro ao verificar permissões' 
        }
    }
}
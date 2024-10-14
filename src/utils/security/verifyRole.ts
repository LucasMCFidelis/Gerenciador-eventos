import { GetResponse } from "../../interfaces/getResponseInterface.js"
import { getUserById } from "../db/getUserById.js"

interface verifyRoleResponse extends GetResponse{
    hasPermission: boolean
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
                message, 
                error
            }
        }

        if (user.role?.roleName !== requiredRole) {
            return {
                status: 403,
                hasPermission: false,
                message: `Permissão insuficiente. Requerido: ${requiredRole}, atual: ${user.role?.roleName}`,
                error: true
            }
        }

        return { 
            status: 200, 
            hasPermission: true,
            error: false 
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Erro ao verificar o papel do usuário: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao verificar o papel do usuário');
        }
        return { 
            status: 500, 
            hasPermission: false, 
            message: 'Erro ao verificar permissões', 
            error: true
        }
    }
}